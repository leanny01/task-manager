import React from 'react';
import { Project } from '../types/project';
import { Task } from '../../task/types/task';
import Item from '../../shared/components/Item';

interface ProjectItemProps {
    project: Project;
    tasks: Task[];
    onProjectClick?: (project: Project) => void;
    onAddTask?: (projectId: string) => void;
    onTaskAction: (task: Task, action: string) => void;
}

export default function ProjectItem({
    project,
    tasks,
    onProjectClick,
    onAddTask,
    onTaskAction,
}: ProjectItemProps) {
    const actions = [
        {
            label: 'Add Task',
            onClick: () => onAddTask?.(project.id),
        },
    ];

    return (
        <Item
            variant="project"
            data={{
                ...project,
                actions,
            }}
            onClick={() => onProjectClick?.(project)}
        />
    );
} 