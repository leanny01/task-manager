import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import App from './App'
import './index.css'
import './styles/theme'

const theme = {
    colors: {
        primary: '#2563eb',
        primaryHover: '#1d4ed8',
        secondary: '#f8fafc',
        secondaryHover: '#f1f5f9',
        hover: '#f8fafc',
        border: '#e5e7eb',
        background: {
            white: '#ffffff',
            light: '#f8fafc',
        },
        text: {
            primary: '#111827',
            secondary: '#4b5563',
            light: '#6b7280'
        },
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px'
        },
        borderRadius: {
            sm: '4px',
            md: '8px',
            lg: '16px'
        },
        shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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