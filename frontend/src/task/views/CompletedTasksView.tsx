import React from 'react';
import TaskView from '../components/TaskView';
import { Task } from '../types/task';
import { TaskStatus } from '../types/enums';

interface CompletedTasksViewProps {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function CompletedTasksView({ tasks, onToggleComplete, onDeleteTask, onEditTask }: CompletedTasksViewProps) {
    const filterCompletedTasks = (tasks: Task[]) => {
        return tasks.filter(task => task.status === TaskStatus.COMPLETED);
    };

    const completedTasks = filterCompletedTasks(tasks);

    return (
        <TaskView
            tasks={completedTasks}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
        />
    );
} 