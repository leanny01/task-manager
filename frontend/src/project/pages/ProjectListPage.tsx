import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectViewWrapper from '../containers/ProjectViewWrapper';
import ActiveProjectsView from '../views/ActiveProjectsView';
import CompletedProjectsView from '../views/CompletedProjectsView';
import AllProjectsView from '../views/AllProjectsView';

export default function ProjectListPage() {
    return (
        <ProjectViewWrapper>
            {({ projects, onEditProject, onDeleteProject, onToggleStatus, isLoading }) => (
                <Routes>
                    <Route path="/" element={<Navigate to="all" replace />} />
                    <Route path="all" element={
                        <AllProjectsView
                            projects={projects}
                            onEditProject={onEditProject}
                            onDeleteProject={onDeleteProject}
                            onToggleStatus={onToggleStatus}
                            isLoading={isLoading}
                        />
                    } />
                    <Route path="active" element={
                        <ActiveProjectsView
                            projects={projects}
                            onEditProject={onEditProject}
                            onDeleteProject={onDeleteProject}
                            onToggleStatus={onToggleStatus}
                            isLoading={isLoading}
                        />
                    } />
                    <Route path="completed" element={
                        <CompletedProjectsView
                            projects={projects}
                            onEditProject={onEditProject}
                            onDeleteProject={onDeleteProject}
                            onToggleStatus={onToggleStatus}
                            isLoading={isLoading}
                        />
                    } />
                </Routes>
            )}
        </ProjectViewWrapper>
    );
} 