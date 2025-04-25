import React from 'react';
import styled from 'styled-components';
import { Task } from '../types/task';
import { Project } from '../../project/types/project';
import { Checkbox } from '../../shared/components/Checkbox';
import { Button } from '../../shared/components/Button';
import { EditIcon, DeleteIcon, ArrowUpIcon } from '../../shared/components/Icons';

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.hover};

    .task-actions {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const TaskInfo = styled.div`
  flex: 1;
  margin-left: 1rem;
`;

const TaskTitle = styled.span<{ completed: boolean }>`
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? props.theme.colors.text.secondary : props.theme.colors.text.primary};
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  
  button {
    background: transparent;
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text.secondary};
    padding: 0.5rem;
    
    &:hover {
      background: ${props => props.theme.colors.background.light};
      color: ${props => props.theme.colors.text.primary};
      border-color: ${props => props.theme.colors.text.primary};
    }

    &[data-variant="danger"]:hover {
      background: ${props => props.theme.colors.error}10;
      color: ${props => props.theme.colors.error};
      border-color: ${props => props.theme.colors.error};
    }
  }
`;

interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    onPromoteToProject?: (task: Task) => void;
}

export default function TaskItem({
    task,
    onToggleComplete,
    onDelete,
    onEdit,
    onPromoteToProject,
}: TaskItemProps) {
    return (
        <Item>
            <Checkbox
                checked={task.status === 'COMPLETED'}
                onChange={() => onToggleComplete(task.id)}
            />
            <TaskInfo>
                <TaskTitle completed={task.status === 'COMPLETED'}>
                    {task.title}
                </TaskTitle>
            </TaskInfo>
            <TaskActions className="task-actions">
                {onPromoteToProject && (
                    <Button
                        variant="secondary"
                        onClick={() => onPromoteToProject(task)}
                    >
                        <ArrowUpIcon />
                    </Button>
                )}
                <Button
                    variant="secondary"
                    onClick={() => onEdit(task)}
                >
                    <EditIcon />
                </Button>
                <Button
                    data-variant="danger"
                    variant="secondary"
                    onClick={() => onDelete(task.id)}
                >
                    <DeleteIcon />
                </Button>
            </TaskActions>
        </Item>
    );
} 