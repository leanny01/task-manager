import React from 'react';
import styled from 'styled-components';
import { Task } from '../../task/types/task';
import { Project } from '../types/project';
import ProjectGroup from '../../shared/components/ProjectGroup';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface ProjectsViewProps {
    projects: Project[];
    projectTasks: Record<string, Task[]>;
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export default function ProjectsView({
    projects,
    projectTasks,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
}: ProjectsViewProps) {
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
                <ProjectGroup
                    key={project.id}
                    project={project}
                    tasks={projectTasks[project.id] || []}
                    onTaskAction={handleTaskAction}
                    onProjectClick={() => { }}
                />
            ))}
        </List>
    );
} 