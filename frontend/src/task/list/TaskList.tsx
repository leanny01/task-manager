import React from 'react';
import styled from 'styled-components';
import { Task } from '../types/task';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input`
  margin-right: 1rem;
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h3<{ completed: boolean }>`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.7 : 1};
`;

const TaskDescription = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDeleteTask, onEditTask }: TaskListProps) {
  return (
    <List>
      {tasks.map(task => (
        <ListItem key={task.id}>
          <Checkbox
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
          />
          <TaskContent>
            <TaskTitle completed={task.completed ?? false}>{task.title}</TaskTitle>
            {task.description && (
              <TaskDescription>{task.description}</TaskDescription>
            )}
          </TaskContent>
          <Actions>
            <Button onClick={() => onEditTask(task)}>Edit</Button>
            <Button onClick={() => onDeleteTask(task.id)}>Delete</Button>
          </Actions>
        </ListItem>
      ))}
    </List>
  );
} 