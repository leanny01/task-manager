import React from 'react';
import TaskView from '../components/TaskView';
import { Task } from '../types/task';

interface AllTasksViewProps {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function AllTasksView({
    tasks,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
}: AllTasksViewProps) {
    return (
        <TaskView
            tasks={tasks}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
        />
    );
} 