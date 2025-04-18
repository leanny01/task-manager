import React, { useState } from 'react';
import styled from 'styled-components';
import { Task } from '../types/task';
import { Project } from '../../project/types/project';
import ListItem from '../../shared/components/ListItem';
import ProjectGroup from '../../shared/components/ProjectGroup';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface TaskListProps {
  items: (Task | Project)[];
  projectTasks?: Record<string, Task[]>;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onPromoteToProject?: (task: Task) => void;
  onProjectClick?: (project: Project) => void;
  onAddTask?: (projectId: string) => void;
}

export default function TaskList({
  items,
  projectTasks = {},
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onPromoteToProject,
  onProjectClick = () => { },
  onAddTask,
}: TaskListProps) {
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
      {items.map(item => {
        if ('taskIds' in item) {
          // This is a project
          const project = item as Project;
          const tasks = projectTasks[project.id] || [];
          return (
            <ProjectGroup
              key={project.id}
              project={project}
              tasks={tasks}
              onTaskAction={handleTaskAction}
              onProjectClick={onProjectClick}
              onAddTask={onAddTask}
            />
          );
        } else {
          // This is a standalone task
          const task = item as Task;
          return (
            <ListItem
              key={task.id}
              variant="task"
              data={{
                ...task,
                actions: [
                  {
                    label: 'Toggle Complete',
                    onClick: () => onToggleComplete(task.id),
                  },
                  {
                    label: 'Edit',
                    onClick: () => onEditTask(task),
                  },
                  {
                    label: 'Delete',
                    onClick: () => onDeleteTask(task.id),
                  },
                  ...(onPromoteToProject
                    ? [{
                      label: 'Promote to Project',
                      onClick: () => onPromoteToProject(task),
                    }]
                    : []),
                ],
              }}
            />
          );
        }
      })}
    </List>
  );
} 