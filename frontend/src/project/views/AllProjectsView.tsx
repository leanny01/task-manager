import React from 'react';
import { Project } from '../types/project';
import ProjectList from '../list/ProjectList';

interface AllProjectsViewProps {
    projects: Project[];
    onEditProject: (project: Project) => void;
    onDeleteProject: (id: string) => Promise<void>;
    onToggleStatus: (id: string) => Promise<void>;
}

export default function AllProjectsView({
    projects,
    onEditProject,
    onDeleteProject,
    onToggleStatus,
}: AllProjectsViewProps) {
    console.log('------- AllProjectsView -------');
    console.log({ projects });
    return (
        <ProjectList
            projects={projects}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
            onToggleStatus={onToggleStatus}
        />
    );
} 