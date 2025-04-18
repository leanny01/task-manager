import React, { useState } from 'react';
import styled from 'styled-components';
import { Project } from '../../project/types/project';
import { Task } from '../../task/types/task';
import ListItem from './ListItem';
import { ChevronIcon, FolderIcon, PlusIcon } from './Icons';

const ProjectGroupContainer = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  background: ${props => props.theme.colors.background.light};
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const ToggleButton = styled.button<{ $isExpanded: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
  transform: rotate(${props => props.$isExpanded ? '0deg' : '-90deg'});

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    background-color: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ProjectIcon = styled.span`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    stroke-width: 1.5;
  }
`;

const TasksContainer = styled.div<{ $isExpanded: boolean }>`
  padding: ${props => props.$isExpanded ? '1rem' : '0'};
  max-height: ${props => props.$isExpanded ? '1000px' : '0'};
  opacity: ${props => props.$isExpanded ? '1' : '0'};
  transition: all 0.3s ease;
  background: ${props => props.theme.colors.background.white};

  > * + * {
    margin-top: 0.75rem;
  }
`;

const ProjectContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const QuickAddTask = styled.div`
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const QuickAddButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  svg {
    width: 1rem;
    height: 1rem;
    stroke-width: 1.5;
  }

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.primary};
  }
`;

interface ProjectGroupProps {
    project: Project;
    tasks: Task[];
    onTaskAction: (task: Task, action: string) => void;
    onProjectClick: (project: Project) => void;
    onAddTask?: (projectId: string) => void;
}

export default function ProjectGroup({
    project,
    tasks,
    onTaskAction,
    onProjectClick,
    onAddTask
}: ProjectGroupProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleProjectClick = () => {
        onProjectClick(project);
    };

    const handleAddTask = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAddTask) {
            onAddTask(project.id);
        }
    };

    return (
        <ProjectGroupContainer>
            <ProjectHeader onClick={handleProjectClick}>
                <ToggleButton
                    onClick={handleToggle}
                    $isExpanded={isExpanded}
                    title={isExpanded ? "Collapse project" : "Expand project"}
                >
                    <ChevronIcon size={20} />
                </ToggleButton>
                <ProjectIcon>
                    <FolderIcon size={24} />
                </ProjectIcon>
                <ProjectContent>
                    <ListItem
                        variant="project"
                        data={{
                            id: project.id,
                            title: project.title,
                            description: project.description,
                            taskCount: tasks.length,
                        }}
                    />
                </ProjectContent>
            </ProjectHeader>
            <TasksContainer $isExpanded={isExpanded}>
                {tasks.map(task => (
                    <ListItem
                        key={task.id}
                        variant="task"
                        data={{
                            ...task,
                            actions: [
                                {
                                    label: 'Toggle Complete',
                                    onClick: () => onTaskAction(task, 'toggle'),
                                },
                                {
                                    label: 'Edit',
                                    onClick: () => onTaskAction(task, 'edit'),
                                },
                                {
                                    label: 'Delete',
                                    onClick: () => onTaskAction(task, 'delete'),
                                },
                            ],
                        }}
                    />
                ))}
                {isExpanded && onAddTask && (
                    <QuickAddTask>
                        <QuickAddButton onClick={handleAddTask} title="Add a task to this project">
                            <PlusIcon size={16} />
                            Add a task
                        </QuickAddButton>
                    </QuickAddTask>
                )}
            </TasksContainer>
        </ProjectGroupContainer>
    );
} 