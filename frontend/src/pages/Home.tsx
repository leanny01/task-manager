import React, { useState, useEffect } from 'react';
import { Task } from '../task/types/task';
import { TaskStatus, TaskPriority } from '../task/types/enums';
import { useCreateTask } from '../task/create/useCreateTask';
import { useEditTask } from '../task/edit/useEditTask';
import { useListTasks } from '../task/list/useListTasks';
import { useMarkCompleteTask } from '../task/complete/useMarkCompleteTask';
import { taskService } from '../task/services/taskService';
import { useProjects } from '../project/hooks/useProjects';
import SyncStatus from '../calendar/components/SyncStatus';
import { ListIcon, TodayIcon, UpcomingIcon, CheckCircleIcon, PlusIcon, FolderIcon } from '../shared/components/Icons';
import AllTasksView from '../task/views/AllTasksView';
import TodayTasksView from '../task/views/TodayTasksView';
import UpcomingTasksView from '../task/views/UpcomingTasksView';
import CompletedTasksView from '../task/views/CompletedTasksView';
import ProjectsList from '../project/list/ProjectList';
import EditTaskModal from '../task/edit/EditTaskModal';
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
  const { projects, projectTasks, isLoading: isLoadingProjects, error: projectsError, refresh: refreshProjects, handlePromoteToProject } = useProjects();
  const { createTask, isLoading: isCreating, error: createError } = useCreateTask();
  const { editTask, isLoading: isEditing, error: editError } = useEditTask();
  const { markComplete, isLoading: isCompleting, error: completeError } = useMarkCompleteTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'projects'>('all');
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
    await refreshProjects();
    return updatedTask;
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    await taskService.delete(id);
    await loadTasks();
    await refreshProjects();
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


  // Calculate task counts
  const taskCounts = {
    all: tasks.length,
    today: tasks.filter(task => {
      const taskDate = task.toDate ? new Date(task.toDate) : null;
      if (!taskDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }).length,
    upcoming: tasks.filter(task => {
      const taskDate = task.toDate ? new Date(task.toDate) : null;
      if (!taskDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() > today.getTime();
    }).length,
    completed: tasks.filter(task => task.status === TaskStatus.COMPLETED).length,
    projects: projects.length
  };

  const renderActiveView = () => {
    const commonProps = {
      tasks: tasks.filter(task => {
        if (!searchQuery) return true;
        return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      }),
      projects,
      projectTasks,
      onToggleComplete: handleToggleComplete,
      onDeleteTask: handleDeleteTask,
      onEditTask: handleEditTask,
    };

    switch (activeFilter) {
      case 'today':
        return <TodayTasksView {...commonProps} />;
      case 'upcoming':
        return <UpcomingTasksView {...commonProps} />;
      case 'completed':
        return <CompletedTasksView {...commonProps} />;
      case 'projects':
        return <ProjectsList {...commonProps} />;
      case 'all':
      default:
        return <AllTasksView {...commonProps} />;
    }
  };

  const isLoading = isLoadingTasks || isLoadingProjects || isCreating || isEditing || isCompleting;
  const error = tasksError || projectsError || createError || editError || completeError;

  return (
    <AppContainer>
      <Sidebar>
        <Logo>NovaTasks</Logo>
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
              className={activeFilter === 'projects' ? 'active' : ''}
              onClick={() => setActiveFilter('projects')}
              $isActive={activeFilter === 'projects'}
            >
              <NavItemContent>
                <FolderIcon size={16} />
                <span>Projects</span>
                <NavBadge>{taskCounts.projects}</NavBadge>
              </NavItemContent>
            </NavToggle>
          </NavItem>
          <NavItem>
            <NavToggle
              className={activeFilter === 'completed' ? 'active' : ''}
              onClick={() => setActiveFilter('completed')}
              $isActive={activeFilter === 'completed'}
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
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <AddButton onClick={handleAddTaskClick}>
              <PlusIcon size={16} />
            </AddButton>
          </AddTaskInputContainer>

          {isLoading ? (
            <LoadingState>Loading...</LoadingState>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            renderActiveView()
          )}
        </TaskContainer>
      </MainContent>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projects={projects}
          onClose={handleCloseModal}
          onSave={handleUpdateTask}
          onPromoteToProject={handlePromoteToProject}
        />
      )}
    </AppContainer>
  );
} 