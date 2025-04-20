import React from 'react';
import styled, { keyframes } from 'styled-components';
import { TaskStatus } from '../../task/types/enums';
import { ProjectStatus } from '../../project/types/project';
import { CheckCircleIcon, EditIcon, DeleteIcon, FolderIcon } from './Icons';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleUp = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const ItemContainer = styled.li<{ completed?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: white;
  margin-bottom: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  opacity: ${props => props.completed ? 0.7 : 1};
  animation: ${slideDown} 0.3s ease-out;
  box-shadow: ${props => props.theme.shadows.sm};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
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
  opacity: ${props => props.completed ? 0.7 : 1};
  transition: all 0.2s ease;
`;

const StatusBadge = styled.span<{ status: TaskStatus | ProjectStatus }>`
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => {
        switch (props.status) {
            case TaskStatus.COMPLETED:
            case ProjectStatus.COMPLETED:
                return props.theme.colors.successLight;
            case TaskStatus.IN_PROGRESS:
            case ProjectStatus.ACTIVE:
                return '#DDE3FF'; // Softer blue for idle state
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
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    background-color: ${props => {
        switch (props.status) {
            case TaskStatus.IN_PROGRESS:
            case ProjectStatus.ACTIVE:
                return props.theme.colors.primary;
            default:
                return props.theme.colors.background.light;
        }
    }};
    color: ${props => {
        switch (props.status) {
            case TaskStatus.IN_PROGRESS:
            case ProjectStatus.ACTIVE:
                return 'white';
            default:
                return props.theme.colors.text.secondary;
        }
    }};
  }
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
        if (props.variant === 'promote') return '#DDE3FF'; // Softer blue for idle state
        return props.theme.colors.border;
    }};
  color: ${props => {
        if (props.variant === 'danger') return props.theme.colors.error;
        if (props.variant === 'promote') return props.theme.colors.primary;
        return props.theme.colors.text.secondary;
    }};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};

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
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => {
        if (props.variant === 'danger') return props.theme.colors.error;
        if (props.variant === 'promote') return props.theme.colors.primary;
        return props.theme.colors.border;
    }};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ToggleButton = styled.button<{ completed?: boolean }>`
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.completed ? props.theme.colors.success : props.theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};

  &:hover {
    background: ${props => props.theme.colors.background.light};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    animation: ${pulse} 0.2s ease;
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
    const isCompleted = data.status === TaskStatus.COMPLETED || data.status === ProjectStatus.COMPLETED;

    return (
        <ItemContainer completed={isCompleted} onClick={onClick} className={className}>
            <Content>
                <Title completed={isCompleted}>
                    {data.title}
                </Title>
                <StatusBadge status={data.status}>
                    {isCompleted && <CheckCircleIcon size={14} />}
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