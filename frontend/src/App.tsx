import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import ProjectDetails from './project/pages/ProjectDetails'
import SyncStatus from './calendar/components/SyncStatus'
import { ErrorBoundary } from './shared/components/ErrorBoundary'

export default function App() {
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:projectId" element={<ProjectDetails />} />
            </Routes>
            <ErrorBoundary>
                <SyncStatus />
            </ErrorBoundary>
        </Router>
    )
} 