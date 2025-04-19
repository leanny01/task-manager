import React, { useMemo } from 'react';
import TaskView from '../components/TaskView';
import { Task } from '../types/task';
import { TaskStatus } from '../types/enums';
import { Project } from '../../project/types/project';

interface CompletedTasksViewProps {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function CompletedTasksView({
    tasks,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
}: CompletedTasksViewProps) {
    const completedTasks = useMemo(() => {
        return tasks.filter(task => task.status === TaskStatus.COMPLETED);
    }, [tasks]);

    return (
        <TaskView
            tasks={completedTasks}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
        />
    );
} 