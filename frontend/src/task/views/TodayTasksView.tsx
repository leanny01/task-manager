import React, { useMemo } from 'react';
import TaskView from '../components/TaskView';
import { Task } from '../types/task';
import { Project } from '../../project/types/project';

interface TodayTasksViewProps {
    tasks: Task[];

    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function TodayTasksView({
    tasks,

    onToggleComplete,
    onDeleteTask,
    onEditTask,
}: TodayTasksViewProps) {
    const todayTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return tasks.filter(task => {
            const taskDate = task.toDate ? new Date(task.toDate) : null;
            if (!taskDate) return false;
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        });
    }, [tasks]);


    return (
        <TaskView
            tasks={todayTasks}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
        />
    );
} 