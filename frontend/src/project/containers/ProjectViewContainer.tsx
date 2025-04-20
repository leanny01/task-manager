import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types/project';
import { Task } from '../../task/types/task';
import { useProjects } from '../hooks/useProjects';
import { useEditProject } from '../edit/useEditProject';
import { useDeleteProject } from '../delete/useDeleteProject';
import { projectService } from '../services/projectService';
import styled from 'styled-components';

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
        isLoading: boolean;
        error: string | null;
    }) => React.ReactNode;
}

export default function ProjectViewContainer({ children }: ProjectViewContainerProps) {
    const { projects, projectTasks, isLoading: isLoadingProjects, error: projectsError, refresh: refreshProjects } = useProjects();
    const { editProject, isLoading: isEditing, error: editError } = useEditProject();
    const { deleteProject, isLoading: isDeleting, error: deleteError } = useDeleteProject();
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

    const isLoading = isLoadingProjects || isEditing || isDeleting;
    const error = projectsError || editError || deleteError;

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
        isLoading,
        error
    });
} 