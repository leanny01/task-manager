import React from 'react';
import TaskView from '../components/TaskView';
import { Task } from '../types/task';
import { Project } from '../../project/types/project';

interface AllTasksViewProps {
    tasks: Task[];
    projects: Project[];
    projectTasks: Record<string, Task[]>;
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function AllTasksView({
    tasks,
    projects,
    projectTasks,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
}: AllTasksViewProps) {
    return (
        <TaskView
            tasks={tasks}
            projects={projects}
            projectTasks={projectTasks}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
        />
    );
} 