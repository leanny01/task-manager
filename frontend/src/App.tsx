import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ErrorBoundary } from './shared/components/ErrorBoundary'
import { AppLayout } from './shared/components/AppLayout'
import NavList from './shared/components/NavList'
import styled from 'styled-components'
import TaskListPage from './task/pages/TaskListPage'
import { ProjectRoutes } from './project/routes'
import { CustomTheme } from './shared/theme'

const Logo = styled.h1<{ theme: CustomTheme }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 2.5rem;
  padding: 0 1rem;
`;

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <ErrorBoundary>
                <AppLayout
                    sidebar={
                        <>
                            <Logo>NovaTasks</Logo>
                            <NavList onNavigate={navigate} />
                        </>
                    }
                >
                    <Routes>
                        <Route path="/tasks/*" element={<TaskListPage />} />
                        <Route path="/projects/*" element={<ProjectRoutes />} />
                        <Route path="/" element={<TaskListPage />} />
                    </Routes>
                </AppLayout>
            </ErrorBoundary>
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
} 