import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import ProjectDetails from './project/pages/ProjectDetails'
import { ErrorBoundary } from './shared/components/ErrorBoundary'
import { AppLayout } from './shared/components/AppLayout'
import { ListIcon, TodayIcon, UpcomingIcon, CheckCircleIcon, FolderIcon } from './shared/components/Icons'
import styled from 'styled-components'

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.li`
  width: 100%;
`;

const NavToggle = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  &.active {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const NavItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavBadge = styled.span`
  background: ${props => props.theme.colors.background.light};
  color: ${props => props.theme.colors.text.secondary};
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  margin-left: auto;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 2rem;
`;

export default function App() {
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <ErrorBoundary>
                <AppLayout
                    sidebar={
                        <>
                            <Logo>NovaTasks</Logo>
                            <NavList>
                                <NavItem>
                                    <NavToggle $isActive={true}>
                                        <NavItemContent>
                                            <ListIcon size={16} />
                                            <span>All Tasks</span>
                                            <NavBadge>0</NavBadge>
                                        </NavItemContent>
                                    </NavToggle>
                                </NavItem>
                                <NavItem>
                                    <NavToggle $isActive={false}>
                                        <NavItemContent>
                                            <TodayIcon size={16} />
                                            <span>Today</span>
                                            <NavBadge>0</NavBadge>
                                        </NavItemContent>
                                    </NavToggle>
                                </NavItem>
                                <NavItem>
                                    <NavToggle $isActive={false}>
                                        <NavItemContent>
                                            <UpcomingIcon size={16} />
                                            <span>Upcoming</span>
                                            <NavBadge>0</NavBadge>
                                        </NavItemContent>
                                    </NavToggle>
                                </NavItem>
                                <NavItem>
                                    <NavToggle $isActive={false}>
                                        <NavItemContent>
                                            <FolderIcon size={16} />
                                            <span>Projects</span>
                                            <NavBadge>0</NavBadge>
                                        </NavItemContent>
                                    </NavToggle>
                                </NavItem>
                                <NavItem>
                                    <NavToggle $isActive={false}>
                                        <NavItemContent>
                                            <CheckCircleIcon size={16} />
                                            <span>Completed</span>
                                            <NavBadge>0</NavBadge>
                                        </NavItemContent>
                                    </NavToggle>
                                </NavItem>
                            </NavList>
                        </>
                    }
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects/:projectId" element={<ProjectDetails />} />
                    </Routes>
                </AppLayout>
            </ErrorBoundary>
        </Router>
    )
} 