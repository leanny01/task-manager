import React from 'react';
import styled from 'styled-components';
import { Task, TaskStatus } from '../types/task';

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

const TaskTitle = styled.h3<{ status: TaskStatus }>`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: ${props => props.status === TaskStatus.COMPLETED ? 'line-through' : 'none'};
  opacity: ${props => props.status === TaskStatus.COMPLETED ? 0.7 : 1};
`;

const TaskDescription = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const TaskMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.light};
  margin-top: 0.25rem;
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
  onArchiveTask?: (id: string) => void;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onArchiveTask
}: TaskListProps) {
  return (
    <List>
      {tasks.map(task => (
        <ListItem key={task.id}>
          <Checkbox
            type="checkbox"
            checked={task.status === TaskStatus.COMPLETED}
            onChange={() => onToggleComplete(task.id)}
            disabled={task.status === TaskStatus.ARCHIVED}
          />
          <TaskContent>
            <TaskTitle status={task.status}>{task.title}</TaskTitle>
            {task.description && (
              <TaskDescription>{task.description}</TaskDescription>
            )}
            <TaskMeta>
              {task.dueDate && `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
              {task.completedAt && `Completed: ${new Date(task.completedAt).toLocaleDateString()}`}
            </TaskMeta>
          </TaskContent>
          <Actions>
            {task.status !== TaskStatus.ARCHIVED && (
              <>
                <Button onClick={() => onEditTask(task)}>Edit</Button>
                <Button onClick={() => onDeleteTask(task.id)}>Delete</Button>
                {onArchiveTask && (
                  <Button onClick={() => onArchiveTask(task.id)}>Archive</Button>
                )}
              </>
            )}
          </Actions>
        </ListItem>
      ))}
    </List>
  );
} 