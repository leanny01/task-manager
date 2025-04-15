import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectDetails from './project/pages/ProjectDetails'

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:projectId" element={<ProjectDetails />} />
                {/* Add more routes here as needed */}
            </Routes>
        </Router>
    )
} 