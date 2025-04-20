import React, { useMemo } from 'react';
import { Project } from '../types/project';
import { ProjectStatus } from '../types/project';
import ProjectList from '../list/ProjectList';

interface CompletedProjectsViewProps {
    projects: Project[];
    onEditProject: (project: Project) => void;
    onDeleteProject: (id: string) => Promise<void>;
    onToggleStatus: (id: string) => Promise<void>;
}

export default function CompletedProjectsView({
    projects,
    onEditProject,
    onDeleteProject,
    onToggleStatus,
}: CompletedProjectsViewProps) {
    const completedProjects = useMemo(() =>
        projects.filter(project => project.status === ProjectStatus.COMPLETED),
        [projects]
    );

    return (
        <ProjectList
            projects={completedProjects}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
            onToggleStatus={onToggleStatus}
        />
    );
} 