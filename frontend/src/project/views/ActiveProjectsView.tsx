import React, { useMemo } from 'react';
import { Project } from '../types/project';
import { ProjectStatus } from '../types/project';
import ProjectList from '../list/ProjectList';

interface ActiveProjectsViewProps {
    projects: Project[];
    onEditProject: (project: Project) => void;
    onDeleteProject: (id: string) => Promise<void>;
    onToggleStatus: (id: string) => Promise<void>;
}

export default function ActiveProjectsView({
    projects,
    onEditProject,
    onDeleteProject,
    onToggleStatus,
}: ActiveProjectsViewProps) {
    const activeProjects = useMemo(() =>
        projects.filter(project => project.status === ProjectStatus.ACTIVE),
        [projects]
    );

    return (
        <ProjectList
            projects={activeProjects}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
            onToggleStatus={onToggleStatus}
        />
    );
} 