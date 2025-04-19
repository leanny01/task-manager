import React from 'react';
import styled from 'styled-components';
import { TaskStatus } from '../../task/types/enums';
import { ProjectStatus } from '../../project/types/project';
import { CheckCircleIcon, EditIcon, DeleteIcon, FolderIcon } from './Icons';

const ItemContainer = styled.li`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: white;
  margin-bottom: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.span<{ completed?: boolean }>`
  flex: 1;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.6 : 1};
`;

const StatusBadge = styled.span<{ status: TaskStatus | ProjectStatus }>`
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  background-color: ${props => {
        switch (props.status) {
            case TaskStatus.COMPLETED:
            case ProjectStatus.COMPLETED:
                return props.theme.colors.successLight;
            case TaskStatus.IN_PROGRESS:
            case ProjectStatus.ACTIVE:
                return props.theme.colors.primary;
            default:
                return props.theme.colors.background.light;
        }
    }};
  color: ${props => {
        switch (props.status) {
            case TaskStatus.COMPLETED:
            case ProjectStatus.COMPLETED:
                return props.theme.colors.success;
            case TaskStatus.IN_PROGRESS:
            case ProjectStatus.ACTIVE:
                return props.theme.colors.primary;
            default:
                return props.theme.colors.text.secondary;
        }
    }};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'danger' | 'promote' }>`
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: none;
  border: 1px solid ${props => {
        if (props.variant === 'danger') return props.theme.colors.error;
        if (props.variant === 'promote') return props.theme.colors.primary;
        return props.theme.colors.border;
    }};
  color: ${props => {
        if (props.variant === 'danger') return props.theme.colors.error;
        if (props.variant === 'promote') return props.theme.colors.primary;
        return props.theme.colors.text.secondary;
    }};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => {
        if (props.variant === 'danger') return props.theme.colors.errorLight;
        if (props.variant === 'promote') return props.theme.colors.primary;
        return props.theme.colors.background.light;
    }};
    color: ${props => {
        if (props.variant === 'danger' || props.variant === 'promote') return 'white';
        return props.theme.colors.text.primary;
    }};
  }
`;

interface ItemData {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus | ProjectStatus;
    actions: Array<{
        label: string;
        onClick: () => void;
    }>;
}

interface ItemProps {
    variant?: 'task' | 'project';
    data: ItemData;
    onClick?: () => void;
    className?: string;
}

export default function Item({ variant = 'task', data, onClick, className }: ItemProps) {
    return (
        <ItemContainer onClick={onClick} className={className}>
            <Content>
                <Title completed={data.status === TaskStatus.COMPLETED || data.status === ProjectStatus.COMPLETED}>
                    {data.title}
                </Title>
                <StatusBadge status={data.status}>
                    {data.status}
                </StatusBadge>
            </Content>
            <Actions>
                {data.actions.map((action, index) => (
                    <ActionButton
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                        }}
                        variant={
                            action.label === 'Delete' ? 'danger' :
                                action.label === 'Promote to Project' ? 'promote' : undefined
                        }
                    >
                        {action.label === 'Mark Complete' && <CheckCircleIcon size={16} />}
                        {action.label === 'Edit' && <EditIcon size={16} />}
                        {action.label === 'Delete' && <DeleteIcon size={16} />}
                        {action.label === 'Promote to Project' && <FolderIcon size={16} />}
                        {action.label === 'Add Task' && <EditIcon size={16} />}
                    </ActionButton>
                ))}
            </Actions>
        </ItemContainer>
    );
} 