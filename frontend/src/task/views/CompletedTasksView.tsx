import React, { useMemo } from 'react';
import TaskView from '../components/TaskView';
import { Task } from '../types/task';
import { TaskStatus } from '../types/enums';
import { Project } from '../../project/types/project';

interface CompletedTasksViewProps {
    tasks: Task[];
    projects: Project[];
    projectTasks: Record<string, Task[]>;
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function CompletedTasksView({
    tasks,
    projects,
    projectTasks,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
}: CompletedTasksViewProps) {
    const completedTasks = useMemo(() => {
        return tasks.filter(task => task.status === TaskStatus.COMPLETED);
    }, [tasks]);

    const projectsWithCompletedTasks = useMemo(() => {
        return projects.filter(project => {
            const tasks = projectTasks[project.id] || [];
            return tasks.some(task => task.status === TaskStatus.COMPLETED);
        });
    }, [projects, projectTasks]);

    return (
        <TaskView
            tasks={completedTasks}
            projects={projectsWithCompletedTasks}
            projectTasks={projectTasks}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
        />
    );
} 