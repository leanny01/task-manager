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

const ItemContainer = styled.div<{ $status?: string; $variant?: string; $priority?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: ${props => props.theme.colors.background.white};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const StatusBadge = styled.span<{ $status: TaskStatus | ProjectStatus }>`
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => {
    switch (props.$status) {
      case TaskStatus.COMPLETED:
      case ProjectStatus.COMPLETED:
        return props.theme.colors.successLight;
      case TaskStatus.IN_PROGRESS:
      case ProjectStatus.ACTIVE:
        return '#DDE3FF';
      default:
        return props.theme.colors.background.light;
    }
  }};
  color: ${props => {
    switch (props.$status) {
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
    switch (props.$status) {
      case TaskStatus.IN_PROGRESS:
      case ProjectStatus.ACTIVE:
        return props.theme.colors.primary;
      default:
        return props.theme.colors.background.light;
    }
  }};
    color: ${props => {
    switch (props.$status) {
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
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ItemContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button<{ $variant?: string }>`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.background.light};
    color: ${props => props.theme.colors.primary};
  }

  ${props => props.$variant === 'delete' && `
    &:hover {
      background: ${props.theme.colors.error};
      color: ${props.theme.colors.background.white};
    }
  `}

  ${props => props.$variant === 'promote' && `
    &:hover {
      background: ${props.theme.colors.background.light};
      color: ${props.theme.colors.primary};
    }
  `}
`;

const ToggleButton = styled.button<{ $completed?: boolean }>`
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.$completed ? props.theme.colors.success : props.theme.colors.text.secondary};
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
  $variant?: 'task' | 'project';
  data: ItemData;
  onClick?: () => void;
  className?: string;
}

export default function Item({ $variant = 'task', data, onClick, className }: ItemProps) {
  const isCompleted = data.status === TaskStatus.COMPLETED || data.status === ProjectStatus.COMPLETED;

  return (
    <ItemContainer
      $status={data.status}
      $variant={$variant}
      onClick={onClick}
      className={className}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <Content>
        <ToggleButton $completed={isCompleted}>
          <CheckCircleIcon size={20} />
        </ToggleButton>
        <Title>{data.title}</Title>
        {data.description && <Description>{data.description}</Description>}
        <StatusBadge $status={data.status}>
          {data.status}
        </StatusBadge>
      </Content>
      <Actions>
        {data.actions.map((action, index) => (
          <ActionButton
            key={index}
            $variant={action.label === 'Delete' ? 'delete' : action.label === 'Promote to Project' ? 'promote' : undefined}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
          >
            {action.label === 'Edit' && <EditIcon size={16} />}
            {action.label === 'Delete' && <DeleteIcon size={16} />}
            {action.label === 'Promote to Project' && <FolderIcon size={16} />}
          </ActionButton>
        ))}
      </Actions>
    </ItemContainer>
  );
} 