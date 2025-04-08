import React from 'react';
import styled from 'styled-components';
import { Task, TaskPriority } from '../types/task';

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TaskItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.completed ? 0.7 : 1};
`;

const TaskCheckbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 1rem;
  cursor: pointer;
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h3<{ completed: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.theme.colors.text.primary};
`;

const TaskDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0.25rem 0 0;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
`;

const PriorityBadge = styled.span<{ priority: TaskPriority }>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ priority }) => {
    switch (priority) {
      case 'high':
        return '#FEE2E2';
      case 'medium':
        return '#FEF3C7';
      default:
        return '#ECFDF5';
    }
  }};
  color: ${({ priority }) => {
    switch (priority) {
      case 'high':
        return '#991B1B';
      case 'medium':
        return '#92400E';
      default:
        return '#065F46';
    }
  }};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
`;

const EditButton = styled(ActionButton)`
  color: ${props => props.theme.colors.text.light};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const DeleteButton = styled(ActionButton)`
  color: ${props => props.theme.colors.text.light};
  
  &:hover {
    color: #EF4444;
    background-color: #FEE2E2;
  }
`;

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDeleteTask, onEditTask }: TaskListProps) {
  return (
    <TaskContainer>
      {tasks.map(task => (
        <TaskItem key={task.id} completed={task.completed}>
          <TaskCheckbox
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
          />
          <TaskContent>
            <TaskTitle completed={task.completed}>{task.title}</TaskTitle>
            <TaskDescription>{task.description}</TaskDescription>
          </TaskContent>
          <TaskMeta>
            <PriorityBadge priority={task.priority}>
              {task.priority}
            </PriorityBadge>
            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            <ButtonsContainer>
              <EditButton onClick={() => onEditTask(task)}>
                ✎
              </EditButton>
              <DeleteButton onClick={() => onDeleteTask(task.id)}>
                ✕
              </DeleteButton>
            </ButtonsContainer>
          </TaskMeta>
        </TaskItem>
      ))}
    </TaskContainer>
  );
} 