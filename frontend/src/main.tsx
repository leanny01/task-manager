import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import { CalendarProvider } from './calendar/context/CalendarContext'
import SyncStatus from './calendar/components/SyncStatus'

import App from './App'
import './index.css'
import './styles/theme'

const theme = {
    colors: {
        primary: '#2563eb',
        primaryHover: '#1d4ed8',
        secondary: '#64748b',
        secondaryHover: '#475569',
        hover: '#f1f5f9',
        success: '#16a34a',
        successLight: '#dcfce7',
        danger: '#ef4444',
        error: '#dc2626',
        errorLight: '#fee2e2',
        warning: '#f59e0b',
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
            light: '#94a3b8'
        },
        background: {
            primary: '#ffffff',
            secondary: '#f8fafc',
            light: '#f1f5f9',
            white: '#ffffff',
            gray: '#f8fafc',
            dark: '#1e293b'
        },
        border: '#e2e8f0'
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem'
    },
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
    }
} as const;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CalendarProvider>
                <App />
            </CalendarProvider>
        </ThemeProvider>
    </React.StrictMode>,
) 