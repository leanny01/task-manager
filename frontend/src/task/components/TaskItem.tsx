import React from 'react';
import { Task } from '../types/task';
import { TaskStatus } from '../types/enums';
import Item from '../../shared/components/Item';

interface TaskItemProps {
    task: Task;
    onToggleComplete: (taskId: string) => void;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onPromoteToProject?: (task: Task) => void;
}

export default function TaskItem({
    task,
    onToggleComplete,
    onDelete,
    onEdit,
    onPromoteToProject,
}: TaskItemProps) {
    const actions = [
        {
            label: task.status === TaskStatus.COMPLETED ? 'Mark Incomplete' : 'Mark Complete',
            onClick: () => onToggleComplete(task.id),
        },
        {
            label: 'Edit',
            onClick: () => onEdit(task),
        },
        {
            label: 'Delete',
            onClick: () => onDelete(task.id),
        },
        ...(onPromoteToProject
            ? [{
                label: 'Promote to Project',
                onClick: () => onPromoteToProject(task),
            }]
            : []),
    ];

    return (
        <Item
            variant="task"
            data={{
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                actions,
            }}
        />
    );
} 