import React from 'react';
import styled from 'styled-components';
import { Project } from '../types/project';
import { Task } from '../../task/types/task';
import ProjectItem from '../components/ProjectItem';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface ProjectListProps {
    projects: Project[];
    projectTasks: Record<string, Task[]>;
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
    onProjectClick?: (project: Project) => void;
    onAddTask?: (projectId: string) => void;
}

export default function ProjectList({
    projects,
    projectTasks,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
    onProjectClick,
    onAddTask,
}: ProjectListProps) {
    const handleTaskAction = (task: Task, action: string) => {
        switch (action) {
            case 'toggle':
                onToggleComplete(task.id);
                break;
            case 'edit':
                onEditTask(task);
                break;
            case 'delete':
                onDeleteTask(task.id);
                break;
        }
    };

    return (
        <List>
            {projects.map(project => (
                <ProjectItem
                    key={project.id}
                    project={project}
                    tasks={projectTasks[project.id] || []}
                    onProjectClick={onProjectClick}
                    onAddTask={onAddTask}
                    onTaskAction={handleTaskAction}
                />
            ))}
        </List>
    );
} 