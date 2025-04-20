import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Project } from '../types/project';
import { ProjectStatus, ProjectPriority } from '../types/project';
import { useListProjects } from '../hooks/useListProjects';
import { useCreateProject } from '../hooks/useCreateProject';
import { useEditProject } from '../hooks/useEditProject';
import { projectService } from '../services/projectService';
import styled from 'styled-components';
import { PlusIcon } from '../../shared/components/Icons';
import { CustomTheme } from '../../shared/theme';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const SearchBar = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const SearchInput = styled.input<{ theme: CustomTheme }>`
    flex: 1;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 0.875rem;
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
    }
`;

const AddProjectContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const AddProjectInput = styled.input<{ theme: CustomTheme }>`
    flex: 1;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 0.875rem;
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
    }
`;

const AddButton = styled.button<{ theme: CustomTheme }>`
    padding: 0.5rem 1rem;
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${props => props.theme.borderRadius.md};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: ${props => props.theme.colors.primaryHover};
    }
`;

const LoadingState = styled.div<{ theme: CustomTheme }>`
    text-align: center;
    padding: 2rem;
    color: ${props => props.theme.colors.text.secondary};
    background: ${props => props.theme.colors.background};
    border-radius: ${props => props.theme.borderRadius.md};
    margin: 1rem 0;
`;

const ErrorMessage = styled.div<{ theme: CustomTheme }>`
    color: ${props => props.theme.colors.error};
    padding: 1rem;
    text-align: center;
`;

interface ProjectViewWrapperProps {
    children: (props: {
        projects: Project[];
        onEditProject: (project: Project) => void;
        onDeleteProject: (id: string) => Promise<void>;
        onToggleStatus: (id: string) => Promise<void>;
        isLoading: boolean;
    }) => React.ReactNode;
}

export default function ProjectViewWrapper({ children }: ProjectViewWrapperProps) {
    const { projects, isLoading, error, loadProjects } = useListProjects();
    const { createProject } = useCreateProject();
    const { editProject } = useEditProject();
    console.log('------- ProjectViewWrapper -------'); // TODO: remove this
    console.log({ projects });
    console.log({ isLoading });
    console.log({ error });

    const [searchQuery, setSearchQuery] = useState('');
    const [newProjectTitle, setNewProjectTitle] = useState('');

    useEffect(() => {
        loadProjects();
    }, []);

    const handleToggleStatus = async (id: string): Promise<void> => {
        try {
            const project = projects.find(p => p.id === id);
            if (!project) return;

            const newStatus = project.status === ProjectStatus.ACTIVE
                ? ProjectStatus.COMPLETED
                : ProjectStatus.ACTIVE;

            await editProject(id, { status: newStatus });
            await loadProjects();
        } catch (err) {
            console.error('Failed to toggle project status:', err);
        }
    };

    const handleDeleteProject = async (id: string): Promise<void> => {
        try {
            await projectService.delete(id);
            await loadProjects();
        } catch (err) {
            console.error('Failed to delete project:', err);
        }
    };

    const handleEditProject = (project: Project) => {
        // TODO: Implement project editing modal
        console.log('Edit project:', project);
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectTitle.trim()) return;

        try {
            await createProject({
                title: newProjectTitle.trim(),
                priority: ProjectPriority.MEDIUM
            });
            setNewProjectTitle('');
            await loadProjects();
        } catch (err) {
            console.error('Failed to create project:', err);
        }
    };

    const filteredProjects = useMemo(() => {
        if (!searchQuery) return projects;
        return projects.filter(project =>
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <Container>
            <SearchBar>
                <SearchInput
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </SearchBar>

            <form onSubmit={handleAddProject}>
                <AddProjectContainer>
                    <AddProjectInput
                        type="text"
                        placeholder="Add a new project..."
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                    />
                    <AddButton type="submit">
                        <PlusIcon size={16} />
                        Add Project
                    </AddButton>
                </AddProjectContainer>
            </form>

            {isLoading && projects.length === 0 ? (
                <LoadingState>Loading projects...</LoadingState>
            ) : (
                children({
                    projects: filteredProjects,
                    onEditProject: handleEditProject,
                    onDeleteProject: handleDeleteProject,
                    onToggleStatus: handleToggleStatus,
                    isLoading,
                })
            )}
        </Container>
    );
} 