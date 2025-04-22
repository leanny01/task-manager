import React from 'react';
import { Project } from '../types/project';
import { Task } from '../../task/types/task';
import Item from '../../shared/components/Item';

interface ProjectItemProps {
    project: Project;
    tasks: Task[];
    onProjectClick?: (project: Project) => void;
    onTaskAction: (task: Task, action: string) => void;
}

export default function ProjectItem({
    project,
    onProjectClick,
    onTaskAction,
}: ProjectItemProps) {
    const actions = [
        {
            label: 'Mark Complete',
            onClick: () => onTaskAction(project as unknown as Task, 'toggle'),
        },
        {
            label: 'Edit',
            onClick: () => onTaskAction(project as unknown as Task, 'edit'),
        },
        {
            label: 'Delete',
            onClick: () => onTaskAction(project as unknown as Task, 'delete'),
        },
    ];

    return (
        <Item
            $variant="project"
            data={{
                id: project.id,
                title: project.title,
                description: project.description,
                status: project.status,
                actions,
            }}
            onClick={() => onProjectClick?.(project)}
        />
    );
} 