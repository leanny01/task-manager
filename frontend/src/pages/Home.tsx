import React, { useState, useEffect, useMemo } from 'react';
import { Task, CreateTaskInput, TaskStatus, TaskPriority } from '../task/types/task';
import { ProjectPriority, ProjectStatus } from '../project/types/project';
import TaskList from '../task/list/TaskList';
import EditTaskModal from '../task/edit/EditTaskModal';
import { useCreateTask } from '../task/create/useCreateTask';
import { useEditTask } from '../task/edit/useEditTask';
import { useListTasks } from '../task/list/useListTasks';
import { useMarkCompleteTask } from '../task/complete/useMarkCompleteTask';
import { taskService } from '../task/services/taskService';
import { projectService } from '../project/services/projectService';
import { toast } from 'react-toastify';
import ProjectList from '../project/list/ProjectList';
import { useProjects } from '../project/hooks/useProjects';
import SyncStatus from '../calendar/components/SyncStatus';
import { ListIcon, TodayIcon, UpcomingIcon, CheckCircleIcon } from '../shared/components/Icons';
import {
  AppContainer,
  Sidebar,
  Logo,
  NavList,
  NavItem,
  MainContent,
  Header,
  SearchBar,
  UserProfile,
  AddTaskInputContainer,
  AddButton,
  TaskContainer,
  ErrorMessage,
  Section,
  SectionTitle,
  LoadingState,
  EmptyState
} from './Home.styles';
import styled from 'styled-components';

const NavBadge = styled.span`
  background: ${props => props.theme.colors.background.light};
  color: ${props => props.theme.colors.text.secondary};
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  margin-left: auto;
`;

const NavItemContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
`;

const NavToggle = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  &.active {
    background: ${props => props.theme.colors.primary};
    color: white;

    ${NavBadge} {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export default function Home() {
  const { tasks, isLoading: isLoadingTasks, error: tasksError, loadTasks } = useListTasks();
  const { projects, projectTasks, isLoading: isLoadingProjects, error: projectsError, refresh: refreshProjects } = useProjects();
  const { createTask, isLoading: isCreating, error: createError } = useCreateTask();
  const { editTask, isLoading: isEditing, error: editError } = useEditTask();
  const { markComplete, isLoading: isCompleting, error: completeError } = useMarkCompleteTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
  };

  const handleAddTask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskTitle.trim()) {
      try {
        await createTask({
          title: newTaskTitle.trim(),
          priority: TaskPriority.MEDIUM,
        });
        setNewTaskTitle('');
        await loadTasks();
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    const updatedTask = await editTask(id, updates);
    await loadTasks();
    return updatedTask;
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    await taskService.delete(id);
    await loadTasks();
  };

  const handleToggleComplete = async (id: string): Promise<void> => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (task.status === TaskStatus.COMPLETED) {
        await handleUpdateTask(id, { status: TaskStatus.PENDING });
      } else {
        await markComplete(id);
      }
      await loadTasks();
      await refreshProjects();
    }
  };

  const handlePromoteToProject = async (task: Task) => {
    try {
      await projectService.promoteTaskToProject(task);
      await loadTasks();
      toast.success('Task promoted to project successfully');
    } catch (error) {
      console.error('Error promoting task to project:', error);
      toast.error('Failed to promote task to project');
    }
  };

  // Combine and sort projects and standalone tasks
  const combinedItems = useMemo(() => {
    const standaloneItems = tasks.filter(task => !task.projectId);
    return [...projects, ...standaloneItems].sort((a, b) => {
      const dateA = new Date(('taskIds' in a ? a.dueDate : a.toDate) || '').getTime() || Infinity;
      const dateB = new Date(('taskIds' in b ? b.dueDate : b.toDate) || '').getTime() || Infinity;
      return dateA - dateB;
    });
  }, [projects, tasks]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Calculate task counts
  const taskCounts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      all: tasks.filter(task => !task.projectId).length,
      today: tasks.filter(task => {
        if (task.projectId) return false;
        const taskDate = task.toDate ? new Date(task.toDate) : null;
        if (!taskDate) return false;
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }).length,
      upcoming: tasks.filter(task => {
        if (task.projectId) return false;
        return task.toDate && new Date(task.toDate) > today;
      }).length,
      completed: tasks.filter(task =>
        !task.projectId && task.status === TaskStatus.COMPLETED
      ).length
    };
  }, [tasks]);

  // Filter items based on current view
  const filteredItems = useMemo(() => {
    let items = combinedItems;

    // Apply search filter
    if (searchQuery.trim()) {
      items = items.filter(item => {
        const isProject = 'taskIds' in item;
        if (isProject) {
          return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        } else {
          return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        }
      });
    }

    // Apply status filter
    return items.filter(item => {
      const isProject = 'taskIds' in item;
      if (isProject) {
        return true; // Always show projects
      } else {
        const task = item as Task;
        const isCompleted = task.status === TaskStatus.COMPLETED;

        // If task is completed, only show if showCompleted is true
        if (isCompleted && !showCompleted) return false;

        switch (activeFilter) {
          case 'today': {
            const today = new Date();
            const taskDate = task.toDate ? new Date(task.toDate) : null;
            return taskDate &&
              taskDate.getDate() === today.getDate() &&
              taskDate.getMonth() === today.getMonth() &&
              taskDate.getFullYear() === today.getFullYear();
          }
          case 'upcoming':
            return task.toDate && new Date(task.toDate) > new Date();
          default:
            return true;
        }
      }
    });
  }, [combinedItems, searchQuery, activeFilter, showCompleted]);

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  const isLoading = isLoadingTasks || isLoadingProjects || isCreating || isEditing || isCompleting;
  const error = tasksError || projectsError || createError || editError || completeError;

  const handleAddTaskClick = () => {
    if (newTaskTitle.trim()) {
      createTask({
        title: newTaskTitle.trim(),
        priority: TaskPriority.MEDIUM,
      }).then(() => {
        setNewTaskTitle('');
        loadTasks();
      }).catch((error) => {
        console.error('Failed to create task:', error);
      });
    }
  };

  return (
    <AppContainer>
      <Sidebar>
        <Logo>TidyTasks</Logo>
        <NavList>
          <NavItem>
            <NavToggle
              className={activeFilter === 'all' ? 'active' : ''}
              onClick={() => setActiveFilter('all')}
              $isActive={activeFilter === 'all'}
            >
              <NavItemContent>
                <ListIcon size={16} />
                <span>All</span>
                <NavBadge>{taskCounts.all}</NavBadge>
              </NavItemContent>
            </NavToggle>
          </NavItem>
          <NavItem>
            <NavToggle
              className={activeFilter === 'today' ? 'active' : ''}
              onClick={() => setActiveFilter('today')}
              $isActive={activeFilter === 'today'}
            >
              <NavItemContent>
                <TodayIcon size={16} />
                <span>Today</span>
                <NavBadge>{taskCounts.today}</NavBadge>
              </NavItemContent>
            </NavToggle>
          </NavItem>
          <NavItem>
            <NavToggle
              className={activeFilter === 'upcoming' ? 'active' : ''}
              onClick={() => setActiveFilter('upcoming')}
              $isActive={activeFilter === 'upcoming'}
            >
              <NavItemContent>
                <UpcomingIcon size={16} />
                <span>Upcoming</span>
                <NavBadge>{taskCounts.upcoming}</NavBadge>
              </NavItemContent>
            </NavToggle>
          </NavItem>
          <NavItem>
            <NavToggle
              onClick={toggleShowCompleted}
              $isActive={showCompleted}
            >
              <NavItemContent>
                <CheckCircleIcon size={16} />
                <span>Completed</span>
                <NavBadge>{taskCounts.completed}</NavBadge>
              </NavItemContent>
            </NavToggle>
          </NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        <Header>
          <SearchBar>
            <input
              type="text"
              placeholder="Search tasks and projects..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </SearchBar>
          <HeaderActions>
            <SyncStatus />
            <UserProfile>
              <img src="/default-avatar.png" alt="User profile" />
            </UserProfile>
          </HeaderActions>
        </Header>

        <TaskContainer>
          <AddTaskInputContainer>
            <input
              type="text"
              placeholder="Type a task name and press Enter or click +"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={handleAddTask}
            />
            <AddButton
              onClick={handleAddTaskClick}
              title="Add task"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </AddButton>
          </AddTaskInputContainer>

          {isLoading ? (
            <LoadingState>Loading...</LoadingState>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <EmptyState>No items found</EmptyState>
              ) : (
                <TaskList
                  items={filteredItems}
                  projectTasks={projectTasks}
                  onEditTask={handleEditTask}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                  onPromoteToProject={handlePromoteToProject}
                />
              )}
            </>
          )}

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
        </TaskContainer>
      </MainContent>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={handleUpdateTask}
        />
      )}
    </AppContainer>
  );
} 