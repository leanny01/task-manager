import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                {/* Add more routes here as needed */}
            </Routes>
        </Router>
    )
} 