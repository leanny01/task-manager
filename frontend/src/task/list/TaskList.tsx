import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus } from '../types/task';
import { Project } from '../../project/types/project';

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

const ProjectListItem = styled(ListItem) <{ $isClickable?: boolean }>`
  background: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.$isClickable ? '#f1f5f9' : '#f8fafc'};
  }
`;

const Checkbox = styled.input`
  margin-right: 1rem;
`;

const Content = styled.div`
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.h3<{ $status?: TaskStatus }>`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: ${props => props.$status === TaskStatus.COMPLETED ? 'line-through' : 'none'};
  opacity: ${props => props.$status === TaskStatus.COMPLETED ? 0.7 : 1};
`;

const TaskTitle = styled.span<{ $completed: boolean }>`
  flex: 1;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  color: ${props => props.$completed ? '#9ca3af' : '#111827'};
`;

const Description = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const Meta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.light};
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Badge = styled.span<{ variant?: 'project' | 'subtask' }>`
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  background-color: ${props =>
    props.variant === 'project'
      ? '#818cf8'
      : props.variant === 'subtask'
        ? '#9ca3af'
        : '#e5e7eb'};
  color: ${props => props.variant === 'project' ? 'white' : '#4b5563'};
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

  &.promote {
    color: ${props => props.theme.colors.primary};
    display: flex;
    align-items: center;
    gap: 0.25rem;
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
            <ProjectListItem
              key={item.id}
              $isClickable
              onClick={() => handleProjectClick(item.id)}
            >
              <Content>
                <Header>
                  <Title>{item.title}</Title>
                  <Badge variant="project">Project</Badge>
                  <Badge>{projectTasks?.[item.id]?.length || 0} tasks</Badge>
                </Header>
                {item.description && (
                  <Description>{item.description}</Description>
                )}
                <Meta>
                  {item.dueDate && (
                    <span>📅 Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                  )}
                </Meta>
              </Content>
            </ProjectListItem>
          );
        } else {
          // Render Task
          const task = item;
          return (
            <ListItem key={task.id}>
              <Checkbox
                type="checkbox"
                checked={task.status === TaskStatus.COMPLETED}
                onChange={() => onToggleComplete(task.id)}
              />
              <Content>
                <Header>
                  <Title $status={task.status}>{task.title}</Title>
                  {task.projectId && (
                    <Badge variant="subtask">
                      📎 Part of a Project
                    </Badge>
                  )}
                </Header>
                {task.description && (
                  <Description>{task.description}</Description>
                )}
                <Meta>
                  {task.toDate && (
                    <span>📅 Due: {new Date(task.toDate).toLocaleDateString()}</span>
                  )}
                  {task.completedAt && (
                    <span>✓ Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                  )}
                </Meta>
              </Content>
              <Actions>
                <Button onClick={() => onEditTask(task)}>Edit</Button>
                <Button onClick={() => onDeleteTask(task.id)}>Delete</Button>
                {!task.projectId && onPromoteToProject && (
                  <Button
                    className="promote"
                    onClick={() => handlePromoteToProject(task)}
                  >
                    ⭐ Promote to Project
                  </Button>
                )}
              </Actions>
            </ListItem>
          );
        }
      })}
    </List>
  );
} 