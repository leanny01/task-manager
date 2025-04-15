import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
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

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  background: #fff;
`;

const Sidebar = styled.aside`
  padding: 2rem 1rem;
  border-right: 1px solid #e5e7eb;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li<{ active?: boolean }>`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${props => props.active ? '#f3f4f6' : 'transparent'};
  
  &:hover {
    background: #f3f4f6;
  }
`;

const MainContent = styled.main`
  padding: 1.5rem 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;
  position: relative;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-left: 2.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    
    &::placeholder {
      color: #9ca3af;
    }
  }
  
  &::before {
    content: "🔍";
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
`;

const UserProfile = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #e5e7eb;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AddTaskInput = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: none;
    font-size: 1rem;
    
    &::placeholder {
      color: #9ca3af;
    }
    
    &:focus {
      outline: none;
    }
  }
`;

const TaskContainer = styled.div`
  max-width: 800px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

export default function Home() {
  const { tasks, isLoading: isLoadingTasks, error: tasksError, loadTasks } = useListTasks();
  const { projects, projectTasks, isLoading: isLoadingProjects, error: projectsError, refresh: refreshProjects } = useProjects();
  const { createTask, isLoading: isCreating, error: createError } = useCreateTask();
  const { editTask, isLoading: isEditing, error: editError } = useEditTask();
  const { markComplete, isLoading: isCompleting, error: completeError } = useMarkCompleteTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');

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

  const filteredItems = combinedItems.filter(item => {
    const isProject = 'taskIds' in item;

    if (isProject) {
      // Always show projects in 'all' view
      if (activeFilter === 'all') return true;

      // For other filters, show project if it matches the criteria
      const dueDate = item.dueDate ? new Date(item.dueDate) : null;
      switch (activeFilter) {
        case 'today':
          if (!dueDate) return false;
          const today = new Date();
          return dueDate.getDate() === today.getDate() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getFullYear() === today.getFullYear();
        case 'upcoming':
          return dueDate ? dueDate > new Date() : false;
        case 'completed':
          return item.status === 'COMPLETED';
        default:
          return true;
      }
    } else {
      // Filter tasks as before
      const task = item;
      switch (activeFilter) {
        case 'completed':
          return task.status === TaskStatus.COMPLETED;
        case 'today':
          const today = new Date();
          const taskDate = task.toDate ? new Date(task.toDate) : null;
          return taskDate &&
            taskDate.getDate() === today.getDate() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear();
        case 'upcoming':
          return task.toDate && new Date(task.toDate) > new Date();
        default:
          return true;
      }
    }
  });

  const isLoading = isLoadingTasks || isLoadingProjects || isCreating || isEditing || isCompleting;
  const error = tasksError || projectsError || createError || editError || completeError;

  return (
    <AppContainer>
      <Sidebar>
        <Logo>TidyTasks</Logo>
        <NavList>
          <NavItem active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
            ○ All
          </NavItem>
          <NavItem active={activeFilter === 'today'} onClick={() => setActiveFilter('today')}>
            📅 Today
          </NavItem>
          <NavItem active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')}>
            📆 Upcoming
          </NavItem>
          <NavItem active={activeFilter === 'completed'} onClick={() => setActiveFilter('completed')}>
            ✓ Completed
          </NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        <Header>
          <SearchBar>
            <input type="text" placeholder="Add a task" />
          </SearchBar>
          <UserProfile>
            <img src="/default-avatar.png" alt="User profile" />
          </UserProfile>
        </Header>

        <TaskContainer>
          <AddTaskInput>
            <input
              type="text"
              placeholder="Add a task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={handleAddTask}
            />
          </AddTaskInput>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>
                  No items found
                </div>
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