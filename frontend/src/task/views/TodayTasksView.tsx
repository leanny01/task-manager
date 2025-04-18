import React, { useMemo } from 'react';
import TaskView from '../components/TaskView';
import { Task } from '../types/task';
import { Project } from '../../project/types/project';

interface TodayTasksViewProps {
    tasks: Task[];
    projects: Project[];
    projectTasks: Record<string, Task[]>;
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function TodayTasksView({
    tasks,
    projects,
    projectTasks,
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

    const todayProjects = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return projects.filter(project => {
            const tasks = projectTasks[project.id] || [];
            return tasks.some(task => {
                const taskDate = task.toDate ? new Date(task.toDate) : null;
                if (!taskDate) return false;
                taskDate.setHours(0, 0, 0, 0);
                return taskDate.getTime() === today.getTime();
            });
        });
    }, [projects, projectTasks]);

    return (
        <TaskView
            tasks={todayTasks}
            projects={todayProjects}
            projectTasks={projectTasks}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
        />
    );
} 