import React from 'react';
import styled from 'styled-components';
import { Project, ProjectStatus, ProjectPriority } from '../types/project';
import { Task } from '../../task/types/task';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProjectItem = styled.li`
  margin-bottom: 2rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const ProjectHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProjectIcon = styled.span`
  font-size: 1.25rem;
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProjectMeta = styled.div`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PriorityBadge = styled.span<{ priority: ProjectPriority }>`
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  background-color: ${props => {
        switch (props.priority) {
            case ProjectPriority.HIGH:
                return '#fee2e2';
            case ProjectPriority.MEDIUM:
                return '#fef3c7';
            default:
                return '#ecfdf5';
        }
    }};
  color: ${props => {
        switch (props.priority) {
            case ProjectPriority.HIGH:
                return '#991b1b';
            case ProjectPriority.MEDIUM:
                return '#92400e';
            default:
                return '#065f46';
        }
    }};
`;

const TasksList = styled.ul`
  list-style: none;
  padding: 1rem;
  margin: 0;
`;

const TaskItem = styled.li`
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: #f9fafb;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Checkbox = styled.input`
  margin: 0;
`;

const TaskTitle = styled.span<{ completed: boolean }>`
  flex: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#9ca3af' : '#111827'};
`;

interface ProjectListProps {
    projects: Project[];
    projectTasks: Record<string, Task[]>;
    onToggleTask: (taskId: string) => void;
}

export default function ProjectList({ projects, projectTasks, onToggleTask }: ProjectListProps) {
    const getPriorityIcon = (priority: ProjectPriority) => {
        switch (priority) {
            case ProjectPriority.HIGH:
                return '🔴';
            case ProjectPriority.MEDIUM:
                return '🟡';
            case ProjectPriority.LOW:
                return '🟢';
            default:
                return '⚪';
        }
    };

    return (
        <List>
            {projects.map(project => (
                <ProjectItem key={project.id}>
                    <ProjectHeader>
                        <ProjectIcon>{getPriorityIcon(project.priority)}</ProjectIcon>
                        <ProjectInfo>
                            <ProjectTitle>
                                📁 {project.title}
                                <PriorityBadge priority={project.priority}>
                                    {project.priority}
                                </PriorityBadge>
                            </ProjectTitle>
                            <ProjectMeta>
                                {project.dueDate && (
                                    <span>📅 Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                                )}
                                <span>📝 {projectTasks[project.id]?.length || 0} tasks</span>
                            </ProjectMeta>
                        </ProjectInfo>
                    </ProjectHeader>

                    <TasksList>
                        {projectTasks[project.id]?.map(task => (
                            <TaskItem key={task.id}>
                                <Checkbox
                                    type="checkbox"
                                    checked={task.status === 'COMPLETED'}
                                    onChange={() => onToggleTask(task.id)}
                                />
                                <TaskTitle completed={task.status === 'COMPLETED'}>
                                    {task.title}
                                </TaskTitle>
                            </TaskItem>
                        ))}
                    </TasksList>
                </ProjectItem>
            ))}
        </List>
    );
} 