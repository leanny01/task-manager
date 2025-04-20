import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Task } from '../../task/types/task';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';
import { useListTasks } from '../../task/list/useListTasks';
import { useMarkCompleteTask } from '../../task/complete/useMarkCompleteTask';
import { useEditTask } from '../../task/edit/useEditTask';
import { useCreateTask } from '../../task/create/useCreateTask';
import TaskView from '../../task/components/TaskView';

const Container = styled.div`
  padding: 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1rem;
`;

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const { tasks, isLoading: isLoadingTasks, error: tasksError, loadTasks } = useListTasks();
  const { markComplete, isLoading: isCompleting, error: completeError } = useMarkCompleteTask();
  const { editTask, isLoading: isEditing, error: editError } = useEditTask();
  const { createTask, isLoading: isCreating, error: createError } = useCreateTask();

  const [project, setProject] = React.useState<Project | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const projectData = await projectService.getById(projectId!);
      setProject(projectData);
      setError(null);
    } catch (error) {
      setError('Failed to load project');
    }
  };

  const handleToggleComplete = async (id: string): Promise<void> => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        if (task.status === 'COMPLETED') {
          await editTask(id, { status: 'PENDING' });
        } else {
          await markComplete(id);
        }
        await loadTasks();
        setError(null);
      }
    } catch (error) {
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    try {
      await projectService.removeTask(projectId!, id);
      await loadTasks();
      setError(null);
    } catch (error) {
      setError('Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    // This will be handled by the parent component
  };

  const handleAddTask = async (title: string): Promise<void> => {
    try {
      const newTask = await createTask({
        title,
        projectId: projectId,
      });
      await projectService.addTask(projectId!, newTask.id);
      await loadTasks();
      setError(null);
    } catch (error) {
      setError('Failed to create task');
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  const projectTasks = tasks.filter(task => task.projectId === projectId);

  return (
    <Container>
      {error && <div>{error}</div>}
      <Header>
        <Title>{project.title}</Title>
        {project.description && (
          <Description>{project.description}</Description>
        )}
      </Header>
      <TaskView
        tasks={projectTasks}
        onToggleComplete={handleToggleComplete}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
      />
    </Container>
  );
} 