import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import App from './App'
import './index.css'

const theme = {
    colors: {
        primary: '#2563eb',
        primaryHover: '#1d4ed8',
        secondary: '#eef2ff',
        border: '#e5e7eb',
        text: {
            primary: '#111827',
            secondary: '#4b5563',
            light: '#6b7280'
        }
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px'
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
) 