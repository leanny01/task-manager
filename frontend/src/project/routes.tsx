import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetails from './pages/ProjectDetails';

export function ProjectRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="list" replace />} />
            <Route path="list/*" element={<ProjectListPage />} />
            <Route path=":projectId" element={<ProjectDetails />} />
        </Routes>
    );
} 