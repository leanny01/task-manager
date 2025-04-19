import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../task/types/task';
import { Project } from '../project/types/project';
import { TaskStatus, TaskPriority } from '../task/types/enums';
import { useCreateTask } from '../task/create/useCreateTask';
import { useEditTask } from '../task/edit/useEditTask';
import { useListTasks } from '../task/list/useListTasks';
import { useMarkCompleteTask } from '../task/complete/useMarkCompleteTask';
import { taskService } from '../task/services/taskService';
import { useProjects } from '../project/hooks/useProjects';
import { PlusIcon } from '../shared/components/Icons';
import AllTasksView from '../task/views/AllTasksView';
import TodayTasksView from '../task/views/TodayTasksView';
import UpcomingTasksView from '../task/views/UpcomingTasksView';
import CompletedTasksView from '../task/views/CompletedTasksView';
import ProjectsList from '../project/list/ProjectList';
import EditTaskModal from '../task/edit/EditTaskModal';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 600px;
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const AddTaskInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const AddButton = styled.button`
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const TaskContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  padding: 1rem;
  text-align: center;
`;

export default function Home() {
  const { tasks, isLoading: isLoadingTasks, error: tasksError, loadTasks } = useListTasks();
  const { projects, projectTasks, isLoading: isLoadingProjects, error: projectsError, refresh: refreshProjects, handlePromoteToProject } = useProjects();
  const { createTask, isLoading: isCreating, error: createError } = useCreateTask();
  const { editTask, isLoading: isEditing, error: editError } = useEditTask();
  const { markComplete, isLoading: isCompleting, error: completeError } = useMarkCompleteTask();
  const navigate = useNavigate();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
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

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  const isLoading = isLoadingTasks || isLoadingProjects || isCreating || isEditing || isCompleting;
  const error = tasksError || projectsError || createError || editError || completeError;

  return (
    <Container>
      <Header>
        <SearchBar>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
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
          <AllTasksView
            tasks={tasks.filter(task => {
              if (!searchQuery) return true;
              return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
            })}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        )}
      </TaskContainer>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projects={projects}
          onClose={handleCloseModal}
          onSave={handleUpdateTask}
          onPromoteToProject={handlePromoteToProject}
        />
      )}
    </Container>
  );
} 