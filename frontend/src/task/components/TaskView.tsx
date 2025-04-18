import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Task } from '../types/task';
import { TaskStatus } from '../types/enums';
import { Project } from '../../project/types/project';
import ListItem from '../../shared/components/ListItem';
import { FolderIcon } from '../../shared/components/Icons';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProjectIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  background: ${props => props.theme.colors.background.light};
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text.primary};
  }
`;

interface TaskViewProps {
    tasks: Task[];
    projects: Project[];
    projectTasks: Record<string, Task[]>;
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function TaskView({
    tasks,
    projects,
    projectTasks,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
}: TaskViewProps) {
    // Create a map of project IDs to project names for quick lookup
    const projectMap = useMemo(() => {
        return projects.reduce((acc, project) => {
            acc[project.id] = project.title;
            return acc;
        }, {} as Record<string, string>);
    }, [projects]);

    // Find which project a task belongs to
    const getProjectName = (task: Task): string | undefined => {
        if (!task.projectId) return undefined;
        return projectMap[task.projectId];
    };

    return (
        <List>
            {tasks.map(task => {
                const projectName = getProjectName(task);
                return (
                    <ListItem
                        key={task.id}
                        variant="task"
                        data={{
                            ...task,
                            subtitle: projectName ? (
                                <ProjectIndicator>
                                    <FolderIcon size={12} />
                                    {projectName}
                                </ProjectIndicator>
                            ) : undefined,
                            status: task.status,
                            actions: [
                                {
                                    label: task.status === TaskStatus.COMPLETED ? 'Mark Incomplete' : 'Mark Complete',
                                    onClick: () => onToggleComplete(task.id),
                                },
                                {
                                    label: 'Edit',
                                    onClick: () => onEditTask(task),
                                },
                                {
                                    label: 'Delete',
                                    onClick: () => onDeleteTask(task.id),
                                },
                            ],
                        }}
                    />
                );
            })}
        </List>
    );
} 