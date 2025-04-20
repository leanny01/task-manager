import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ListIcon, TodayIcon, UpcomingIcon, CheckCircleIcon, FolderIcon, ChevronIcon } from './Icons';

const NavListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavSectionHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  width: 100%;
  text-align: left;

  &:hover {
    background: ${props => props.theme.colors.background.light};
    border-radius: 0.375rem;
  }
`;

const NavItem = styled.li`
  width: 100%;
`;

const NavToggle = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background.light};
  }

  ${props => props.$isActive && `
    background: ${props.theme.colors.primary};
    color: white;
  `}
`;

const NavItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ChevronWrapper = styled.div<{ $expanded: boolean }>`
    transform: ${props => props.$expanded ? 'rotate(0deg)' : 'rotate(-90deg)'};
    transition: transform 0.2s ease;
`;

interface NavListProps {
    onNavigate: (path: string) => void;
}

export default function NavList({ onNavigate }: NavListProps) {
    const location = useLocation();
    const [expandedSections, setExpandedSections] = useState({
        tasks: true,
        projects: true
    });

    const toggleSection = (section: 'tasks' | 'projects') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const isActive = (path: string) => location.pathname === path;

    const taskItems = [
        { path: '/tasks/all', label: 'All', icon: ListIcon },
        { path: '/tasks/today', label: 'Today', icon: TodayIcon },
        { path: '/tasks/upcoming', label: 'Upcoming', icon: UpcomingIcon },
        { path: '/tasks/completed', label: 'Completed', icon: CheckCircleIcon }
    ];

    const projectItems = [
        { path: '/projects', label: 'All Projects', icon: FolderIcon }
    ];

    return (
        <NavListContainer>
            <NavSection>
                <NavSectionHeader onClick={() => toggleSection('tasks')}>
                    <ChevronWrapper $expanded={expandedSections.tasks}>
                        <ChevronIcon size={16} />
                    </ChevronWrapper>
                    <ListIcon size={16} />
                    <span>Tasks</span>
                </NavSectionHeader>
                {expandedSections.tasks && taskItems.map((item) => (
                    <NavItem key={item.path}>
                        <NavToggle
                            $isActive={isActive(item.path)}
                            onClick={() => onNavigate(item.path)}
                        >
                            <NavItemContent>
                                <item.icon size={16} />
                                <span>{item.label}</span>
                            </NavItemContent>
                        </NavToggle>
                    </NavItem>
                ))}
            </NavSection>

            <NavSection>
                <NavSectionHeader onClick={() => toggleSection('projects')}>
                    <ChevronWrapper $expanded={expandedSections.projects}>
                        <ChevronIcon size={16} />
                    </ChevronWrapper>
                    <FolderIcon size={16} />
                    <span>Projects</span>
                </NavSectionHeader>
                {expandedSections.projects && projectItems.map((item) => (
                    <NavItem key={item.path}>
                        <NavToggle
                            $isActive={isActive(item.path)}
                            onClick={() => onNavigate(item.path)}
                        >
                            <NavItemContent>
                                <item.icon size={16} />
                                <span>{item.label}</span>
                            </NavItemContent>
                        </NavToggle>
                    </NavItem>
                ))}
            </NavSection>
        </NavListContainer>
    );
} 