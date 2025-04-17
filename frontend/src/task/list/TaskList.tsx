import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus } from '../types/task';
import { Project } from '../../project/types/project';
import ListItem from '../../shared/components/ListItem';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TaskContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 1rem;
`;

const Checkbox = styled.input`
  margin-right: 1rem;
`;

const StyledTaskItem = styled(ListItem)`
  &:hover {
    .task-actions {
      opacity: 1;
    }
  }

  .task-actions {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
`;

interface TaskListProps {
  items: (Task | Project)[];
  projectTasks?: Record<string, Task[]>;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onPromoteToProject?: (task: Task) => void;
}

export default function TaskList({
  items,
  projectTasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onPromoteToProject
}: TaskListProps) {
  const navigate = useNavigate();

  const isProject = (item: Task | Project): item is Project => {
    return 'taskIds' in item;
  };

  const handlePromoteToProject = async (task: Task) => {
    if (onPromoteToProject) {
      onPromoteToProject(task);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <List>
      {items.map(item => {
        if (isProject(item)) {
          // Render Project
          return (
            <ListItem
              key={item.id}
              variant="project"
              onClick={() => handleProjectClick(item.id)}
              data={{
                id: item.id,
                title: item.title || '',
                description: item.description,
                dueDate: item.dueDate,
                taskCount: projectTasks?.[item.id]?.length || 0
              }}
            />
          );
        } else {
          // Render Task
          const task = item;
          return (
            <StyledTaskItem
              key={task.id}
              variant="task"
              data={{
                id: task.id,
                title: task.title || '',
                description: task.description,
                status: task.status || TaskStatus.PENDING,
                dueDate: task.toDate,
                completedAt: task.completedAt,
                projectId: task.projectId,
                actions: [
                  {
                    label: 'Edit',
                    onClick: () => onEditTask(task)
                  },
                  {
                    label: 'Delete',
                    onClick: () => onDeleteTask(task.id)
                  },
                  ...(!task.projectId && onPromoteToProject
                    ? [{
                      label: '⭐ Promote to Project',
                      onClick: () => handlePromoteToProject(task),
                      className: 'promote'
                    }]
                    : [])
                ]
              }}
            />
          );
        }
      })}
    </List>
  );
} 