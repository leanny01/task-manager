import React from 'react';
import styled from 'styled-components';
import { Task } from '../types/task';
import TaskItem from './TaskItem';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProjectIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  background: ${props => props.theme.colors.background.light};
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text.primary};
  }
`;

interface TaskViewProps {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
    onPromoteToProject?: (task: Task) => void;
}

export default function TaskView({
    tasks,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
    onPromoteToProject,
}: TaskViewProps) {

    return (
        <List>
            {tasks.map(task => {
                return (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDeleteTask}
                        onEdit={onEditTask}
                        onPromoteToProject={onPromoteToProject}
                    />
                );
            })}
        </List>
    );
} 