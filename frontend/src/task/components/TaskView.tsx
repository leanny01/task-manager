import React from 'react';
import styled from 'styled-components';
import { Task } from '../types/task';
import { Project } from '../../project/types/project';
import ListItem from '../../shared/components/ListItem';
import { FolderIcon } from '../../shared/components/Icons';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProjectIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: ${props => props.theme.colors.background.light};
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
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
    // Get all tasks, including those within projects
    const getAllTasks = () => {
        const allTasks: Task[] = [...tasks];
        projects.forEach(project => {
            const projectTaskList = projectTasks[project.id] || [];
            projectTaskList.forEach(task => {
                allTasks.push({
                    ...task,
                    projectName: project.title // Add project name for display
                });
            });
        });
        return allTasks;
    };

    const handleTaskAction = (task: Task, action: string) => {
        switch (action) {
            case 'toggle':
                onToggleComplete(task.id);
                break;
            case 'edit':
                onEditTask(task);
                break;
            case 'delete':
                onDeleteTask(task.id);
                break;
        }
    };

    const renderProjectIndicator = (task: Task) => {
        if (!task.projectName) return null;
        return (
            <ProjectIndicator>
                <FolderIcon size={12} />
                <span>{task.projectName}</span>
            </ProjectIndicator>
        );
    };

    return (
        <List>
            {getAllTasks().map(task => (
                <ListItem
                    key={task.id}
                    variant="task"
                    data={{
                        ...task,
                        subtitle: renderProjectIndicator(task),
                        actions: [
                            {
                                label: 'Toggle Complete',
                                onClick: () => handleTaskAction(task, 'toggle'),
                            },
                            {
                                label: 'Edit',
                                onClick: () => handleTaskAction(task, 'edit'),
                            },
                            {
                                label: 'Delete',
                                onClick: () => handleTaskAction(task, 'delete'),
                            }
                        ],
                    }}
                />
            ))}
        </List>
    );
} 