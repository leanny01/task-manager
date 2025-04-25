import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types/project';
import { Task } from '../../task/types/task';
import { useProjects } from '../hooks/useProjects';
import { useEditProject } from '../edit/useEditProject';
import { useDeleteProject } from '../delete/useDeleteProject';
import { useTasks } from '../../task/hooks/useTasks';
import { useAddTask } from '../../task/hooks/useAddTask';
import { useEditTask } from '../../task/hooks/useEditTask';
import { useDeleteTask } from '../../task/hooks/useDeleteTask';
import { projectService } from '../services/projectService';
import { taskService } from '../../task/services/taskService';
import styled from 'styled-components';
import { TaskStatus } from '../../task/types/enums';

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

interface ProjectViewContainerProps {
    children: (props: {
        projects: Project[];
        projectTasks: Record<string, Task[]>;
        onEditProject: (id: string, updates: Partial<Project>) => Promise<Project>;
        onDeleteProject: (id: string) => Promise<void>;
        onProjectClick: (project: Project) => void;
        onProjectAdded: () => Promise<void>;
        onAddTask: (task: Task) => Promise<Task>;
        onEditTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
        onDeleteTask: (taskId: string) => Promise<void>;
        onToggleTaskStatus: (taskId: string) => Promise<void>;
        isLoading: boolean;
        error: string | null;
    }) => React.ReactNode;
}

export default function ProjectViewContainer({ children }: ProjectViewContainerProps) {
    const { projects, projectTasks, isLoading: isLoadingProjects, error: projectsError, refresh: refreshProjects } = useProjects();
    const { editProject, isLoading: isEditing, error: editError } = useEditProject();
    const { deleteProject, isLoading: isDeleting, error: deleteError } = useDeleteProject();
    const { addTask, isLoading: isAddingTask, error: addTaskError } = useAddTask();
    const { editTask, isLoading: isEditingTask, error: editTaskError } = useEditTask();
    const { deleteTask, isLoading: isDeletingTask, error: deleteTaskError } = useDeleteTask();
    const navigate = useNavigate();

    useEffect(() => {
        refreshProjects();
    }, []);

    const handleEditProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
        const updatedProject = await editProject(id, updates);
        await refreshProjects();
        return updatedProject;
    };

    const handleDeleteProject = async (id: string): Promise<void> => {
        await deleteProject(id);
        await refreshProjects();
    };

    const handleProjectClick = (project: Project) => {
        navigate(`/projects/${project.id}`);
    };

    const handleProjectAdded = useCallback(async () => {
        await refreshProjects();
    }, [refreshProjects]);

    const handleAddTask = async (task: Task): Promise<Task> => {
        const newTask = await addTask(task);
        await refreshProjects();
        return newTask;
    };

    const handleEditTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
        const updatedTask = await editTask(taskId, updates);
        await refreshProjects();
        return updatedTask;
    };

    const handleDeleteTask = async (taskId: string): Promise<void> => {
        alert('delete task');
        await deleteTask(taskId);
        await refreshProjects();
    };

    const handleToggleTaskStatus = async (taskId: string): Promise<void> => {
        const task = Object.values(projectTasks).flat().find(t => t.id === taskId);
        if (!task) return;

        const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
        await handleEditTask(taskId, { status: newStatus });
    };

    const isLoading = isLoadingProjects || isEditing || isDeleting || isAddingTask || isEditingTask || isDeletingTask;
    const error = projectsError || editError || deleteError || addTaskError || editTaskError || deleteTaskError;

    if (isLoading) {
        return <LoadingState>Loading...</LoadingState>;
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return children({
        projects,
        projectTasks,
        onEditProject: handleEditProject,
        onDeleteProject: handleDeleteProject,
        onProjectClick: handleProjectClick,
        onProjectAdded: handleProjectAdded,
        onAddTask: handleAddTask,
        onEditTask: handleEditTask,
        onDeleteTask: handleDeleteTask,
        onToggleTaskStatus: handleToggleTaskStatus,
        isLoading,
        error
    });
} 