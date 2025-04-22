import React from 'react';
import styled from 'styled-components';
import { Task } from '../types/task';
import TaskItem from '../components/TaskItem';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface TaskListProps {
  tasks?: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onPromoteToProject?: (task: Task) => void;
}

export default function TaskList({
  tasks = [],
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onPromoteToProject,
}: TaskListProps) {
  return (
    <List>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
          onPromoteToProject={onPromoteToProject}
        />
      ))}
    </List>
  );
}