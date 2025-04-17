import React from 'react';
import styled from 'styled-components';

const BaseListItem = styled.li<{ $variant?: 'project' | 'task' }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background: ${props => props.$variant === 'project'
        ? props.theme.colors.secondary
        : props.theme.colors.background.white};

  &:hover {
    background: ${props => props.$variant === 'project'
        ? props.theme.colors.secondaryHover
        : props.theme.colors.hover};
  }
`;

export const ListItemContent = styled.div`
  flex: 1;
`;

export const ListItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ListItemTitle = styled.h3<{ $status?: string }>`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.$status === 'COMPLETED'
        ? props.theme.colors.text.light
        : props.theme.colors.text.primary};
  text-decoration: ${props => props.$status === 'COMPLETED' ? 'line-through' : 'none'};
  opacity: ${props => props.$status === 'COMPLETED' ? 0.7 : 1};
`;

export const ListItemDescription = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

export const ListItemMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.light};
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ListItemBadge = styled.span<{ variant?: 'project' | 'subtask' }>`
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  background-color: ${props =>
        props.variant === 'project'
            ? props.theme.colors.primary
            : props.variant === 'subtask'
                ? props.theme.colors.text.light
                : props.theme.colors.border};
  color: ${props => props.variant === 'subtask' || props.theme.colors.background.white ? props.theme.colors.background.white : props.theme.colors.text.secondary};
display: flex;
align - items: center;
gap: 0.25rem;
`;

export const ListItemActions = styled.div`
display: flex;
gap: 0.5rem;
`;

export const ListItemAction = styled.button`
padding: 0.25rem 0.5rem;
background: none;
border: none;
font - size: 0.875rem;
color: ${props => props.theme.colors.text.secondary};
cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
}

  &.promote {
    color: ${props => props.theme.colors.primary};
    display: flex;
    align - items: center;
    gap: 0.25rem;
}
`;

interface ListItemData {
    id: string;
    title: string;
    description?: string;
    status?: string;
    dueDate?: string;
    completedAt?: string;
    projectId?: string;
    taskCount?: number;
    fromDate?: string;
    toDate?: string;
    actions?: {
        label: string;
        onClick: () => void;
        className?: string;
    }[];
}

interface ListItemProps {
    variant?: 'project' | 'task';
    onClick?: () => void;
    data: ListItemData;
    className?: string;
}

export default function ListItem({ variant = 'task', onClick, data, className }: ListItemProps) {
    if (!data) {
        return null;
    }

    const formatDuration = (fromDate: string, toDate: string): string => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffDays > 0) {
            return `${diffDays}d ${diffHours} h`;
        }
        return `${diffHours} h`;
    };

    return (
        <BaseListItem
            $variant={variant}
            onClick={onClick}
            className={className}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <ListItemContent>
                <ListItemHeader>
                    <ListItemTitle $status={data.status}>{data.title}</ListItemTitle>
                    {variant === 'project' && (
                        <>
                            <ListItemBadge variant="project">Project</ListItemBadge>
                            {data.taskCount !== undefined && (
                                <ListItemBadge>{data.taskCount} tasks</ListItemBadge>
                            )}
                        </>
                    )}
                    {variant === 'task' && data.projectId && (
                        <ListItemBadge variant="subtask">📎 Part of a Project</ListItemBadge>
                    )}
                </ListItemHeader>
                {data.description && (
                    <ListItemDescription>{data.description}</ListItemDescription>
                )}
                <ListItemMeta>
                    {data.fromDate && data.toDate ? (
                        <>
                            <span>⏱️ Duration: {formatDuration(data.fromDate, data.toDate)}</span>
                            <span>🕒 {new Date(data.fromDate).toLocaleString()} - {new Date(data.toDate).toLocaleString()}</span>
                        </>
                    ) : data.fromDate ? (
                        <span>🕒 From: {new Date(data.fromDate).toLocaleString()}</span>
                    ) : data.toDate ? (
                        <span>🕒 Due: {new Date(data.toDate).toLocaleString()}</span>
                    ) : null}
                    {data.completedAt && (
                        <span>✓ Completed: {new Date(data.completedAt).toLocaleDateString()}</span>
                    )}
                </ListItemMeta>
            </ListItemContent>
            {data.actions && data.actions.length > 0 && (
                <ListItemActions className="task-actions">
                    {data.actions.map((action, index) => (
                        <ListItemAction
                            key={index}
                            onClick={action.onClick}
                            className={action.className}
                        >
                            {action.label}
                        </ListItemAction>
                    ))}
                </ListItemActions>
            )}
        </BaseListItem>
    );
} 