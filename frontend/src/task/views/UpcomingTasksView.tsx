import React, { useMemo } from 'react';
import TaskView from '../components/TaskView';
import { Task } from '../types/task';

interface UpcomingTasksViewProps {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function UpcomingTasksView({
    tasks,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
}: UpcomingTasksViewProps) {
    const upcomingTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return tasks.filter(task => {
            const taskDate = task.toDate ? new Date(task.toDate) : null;
            if (!taskDate) return false;
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() > today.getTime();
        });
    }, [tasks]);


    return (
        <TaskView
            tasks={upcomingTasks}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
        />
    );
} 