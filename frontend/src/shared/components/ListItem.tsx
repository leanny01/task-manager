import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { TaskStatus } from '../../task/types/task';
import Timeline from './Timeline';

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
  align-items: center;
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
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  
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

const TimelineTooltip = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  display: none;
`;

const StyledListItem = styled.div<{ variant: 'task' | 'project' }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    
    ${TimelineTooltip} {
      display: block;
    }
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

    return (
        <StyledListItem variant={variant} onClick={onClick}>
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
                {data.completedAt && (
                    <ListItemMeta>
                        <span>✓ Completed: {moment(data.completedAt).format('MMM D, YYYY')}</span>
                    </ListItemMeta>
                )}
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

            {variant === 'task' && data.fromDate && data.toDate && (
                <TimelineTooltip>
                    <Timeline
                        fromDate={data.fromDate}
                        toDate={data.toDate}
                        showLabels={false}
                    />
                </TimelineTooltip>
            )}
        </StyledListItem>
    );
} 