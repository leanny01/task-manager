import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Task } from '../../task/types/task';
import { TaskStatus } from '../../task/types/enums';
import { Project } from '../types/project';
import { useProject } from '../hooks/useProject';
import { useTasks } from '../../task/hooks/useTasks';
import { Timeline } from '../../shared/components/Timeline';
import * as S from './ProjectView.styles';
import TaskList from '../../task/list/TaskList';
import { Input } from '../../task/shared/components/forms/Input';
import EditTaskModal from '../../task/edit/EditTaskModal';
import { useProjects } from '../hooks/useProjects';

interface ProjectViewProps {
  onAddTask: (task: Partial<Task>) => Promise<Task>;
  onEditTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onToggleTaskStatus: (taskId: string) => Promise<void>;
  onEditProject: (projectId: string, updates: Partial<Project>) => Promise<Project>;
}

export default function ProjectView({
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
  onEditProject
}: ProjectViewProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading: isLoadingProject, error: projectError } = useProject(projectId);
  const { projects } = useProjects();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  if (isLoadingProject) {
    return <S.LoadingState>Loading...</S.LoadingState>;
  }

  if (projectError || !project) {
    return <S.ErrorState>Error: {projectError || 'Project not found'}</S.ErrorState>;
  }
  const handleAddTask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !newTaskTitle.trim()) return;
    e.preventDefault();

    await onAddTask({
      title: newTaskTitle.trim(),
      status: TaskStatus.PENDING,
      projectId: projectId || undefined
    });
    setNewTaskTitle('');
  };
  console.log("project", project);
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = async (taskId: string) => {
    await onDeleteTask(taskId);
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    await onToggleTaskStatus(taskId);
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
    setEditedDescription(project.description || '');
  };

  const handleSaveDescription = async () => {
    if (!projectId) return;
    await onEditProject(projectId, { description: editedDescription });
    setIsEditingDescription(false);
  };

  const handleCancelEdit = () => {
    setIsEditingDescription(false);
  };

  const handleCloseEditModal = () => {
    setEditingTask(null);
  };

  const handleSaveTask = async (taskId: string, updates: Partial<Task>) => {
    const updatedTask = await onEditTask(taskId, updates);
    setEditingTask(null);
    return updatedTask;
  };

  return (
    <S.Container>
      <S.LeftColumn>
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>Description</S.SectionTitle>
            <S.EditButton onClick={handleEditDescription}>✏️</S.EditButton>
          </S.SectionHeader>
          {isEditingDescription ? (
            <S.DescriptionEditContainer>
              <S.DescriptionInput
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add a description..."
              />
              <S.ButtonGroup>
                <S.SaveButton onClick={handleSaveDescription}>Save</S.SaveButton>
                <S.CancelButton onClick={handleCancelEdit}>Cancel</S.CancelButton>
              </S.ButtonGroup>
            </S.DescriptionEditContainer>
          ) : (
            <S.Description>
              {project.description || 'No description'}
            </S.Description>
          )}
        </S.Section>
      </S.LeftColumn>

      <S.RightColumn>
        <S.TasksSection>
          <S.SectionHeader>
            <S.SectionTitle>
              Tasks
              <S.TaskCount>{project.tasks?.length} {project.tasks?.length === 1 ? 'Task' : 'Tasks'}</S.TaskCount>
            </S.SectionTitle>
          </S.SectionHeader>

          <Input
            label="Add a new task"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleAddTask}
            placeholder="Enter task title and press Enter..."
          />
          <S.Divider />
          <S.TaskListContainer>
            {project.tasks?.length === 0 ? (
              <S.EmptyState>No tasks in this project yet</S.EmptyState>
            ) : (
              <TaskList
                tasks={project.tasks}
                onToggleComplete={handleToggleTaskStatus}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            )}
          </S.TaskListContainer>
        </S.TasksSection>
      </S.RightColumn>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projects={projects}
          onClose={handleCloseEditModal}
          onSave={handleSaveTask}
        />
      )}
    </S.Container>
  );
} 