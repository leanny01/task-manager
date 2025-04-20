import React from 'react';
import styled from 'styled-components';
import { Project } from '../types/project';
import { CustomTheme } from '../../shared/theme';
import ProjectItem from '../components/ProjectItem';
import { Task } from '../../task/types/task';

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

interface ProjectListProps {
    projects: Project[];
    onEditProject: (project: Project) => void;
    onDeleteProject: (id: string) => Promise<void>;
    onToggleStatus: (id: string) => Promise<void>;
}

export default function ProjectList({ projects, onEditProject, onDeleteProject, onToggleStatus }: ProjectListProps) {
    const handleTaskAction = (task: Task, action: string) => {
        switch (action) {
            case 'toggle':
                onToggleStatus(task.id);
                break;
            case 'edit':
                onEditProject(task as unknown as Project);
                break;
            case 'delete':
                onDeleteProject(task.id);
                break;
        }
    };

    return (
        <List>
            {projects.map(project => (
                <ProjectItem
                    key={project.id}
                    project={project}
                    tasks={[]}
                    onProjectClick={onEditProject}
                    onTaskAction={handleTaskAction}
                />
            ))}
        </List>
    );
} 