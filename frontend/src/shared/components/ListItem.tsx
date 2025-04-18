import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { TaskStatus } from '../../task/types/task';
import { CheckIcon, EditIcon, DeleteIcon, FolderIcon, CalendarIcon, DotsVerticalIcon } from './Icons';
import Timeline from './Timeline';

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

const QuickActions = styled.div`
  position: absolute;
  right: 3.5rem; // Leave space for menu button
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const QuickActionButton = styled.button`
  background: ${props => props.theme.colors.background.light};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  padding: 0.375rem;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    width: 1rem;
    height: 1rem;
    stroke-width: 1.5;
  }

  &:hover {
    background: ${props => props.theme.colors.background.white};
    color: ${props => props.theme.colors.text.primary};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const StyledListItem = styled.div<{ variant: 'task' | 'project'; $isCompleted?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background: ${props => props.variant === 'project'
        ? props.theme.colors.secondary
        : props.theme.colors.background.white};
  border-radius: 0.75rem;
  box-shadow: ${props => props.variant === 'project'
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'};
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  border: 1px solid ${props => {
        if (props.variant === 'project') return props.theme.colors.primary;
        if (props.$isCompleted) return props.theme.colors.border;
        return 'transparent';
    }};
  opacity: ${props => props.$isCompleted ? 0.8 : 1};

  &:hover {
    box-shadow: ${props => props.$isCompleted
        ? '0 1px 3px rgba(0, 0, 0, 0.05)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'};
    transform: ${props => props.$isCompleted ? 'none' : 'translateY(-1px)'};
    border-color: ${props => {
        if (props.variant === 'project') return props.theme.colors.primary;
        if (props.$isCompleted) return props.theme.colors.border;
        return props.theme.colors.primary;
    }};
    background: ${props => {
        if (props.variant === 'project') return props.theme.colors.secondaryHover;
        if (props.$isCompleted) return props.theme.colors.background.light;
        return props.theme.colors.background.white;
    }};

    ${QuickActions} {
      opacity: 1;
    }
  }
`;

const ListItemContent = styled.div`
  flex: 1;
  margin-left: 1rem;
`;

const ListItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

// Title formatting utility
const formatTitle = (title: string): string => {
    // Split into sentences
    return title.split(/([.!?]\s+)/).map(sentence => {
        if (!sentence.trim()) return sentence;
        // Capitalize first letter of each sentence
        return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
    }).join('');
};

const ListItemTitle = styled.h3<{ $status?: string }>`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.$status === 'COMPLETED'
        ? props.theme.colors.text.light
        : props.theme.colors.text.primary};
  text-decoration: ${props => props.$status === 'COMPLETED' ? 'line-through' : 'none'};
  opacity: ${props => props.$status === 'COMPLETED' ? 0.7 : 1};
  text-transform: capitalize; /* Ensure first letter is always capitalized */
`;

const ListItemDescription = styled.p`
  margin: 0.5rem 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${props => props.theme.colors.text.secondary};
`;

const ListItemMeta = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.text.light};
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ListItemBadge = styled.span<{ variant?: 'project' | 'subtask' }>`
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

const ListItemActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-left: auto;
  padding-left: 1rem;
`;

const ListItemAction = styled.button`
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

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:checked {
    background-color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};

    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 0.875rem;
    }
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: scale(1.05);
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}1A`}; // 10% opacity
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}1A`}; // 10% opacity
  }
`;

const TimelineBadge = styled(ListItemBadge)`
  font-family: 'Inter', sans-serif;
  margin: 0;
  background: none;
  color: ${props => props.theme.colors.text.light};
  padding: 0.25rem 0;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border: none;
  font-weight: normal;

  svg {
    width: 0.875rem;
    height: 0.875rem;
    stroke-width: 1.5;
    color: inherit;
  }
`;

const MenuContainer = styled.div`
  position: relative;
  margin-left: auto;
  padding-left: 1rem;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const MenuDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 10000;
  min-width: 150px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  &:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  &:hover {
    background-color: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text.primary};
  }

  &.promote {
    color: ${props => props.theme.colors.primary};
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

// Global state to track open menu
let openMenuId: string | null = null;

export default function ListItem({ variant = 'task', onClick, data, className }: ListItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuButtonRef = React.useRef<HTMLButtonElement>(null);
    const menuDropdownRef = React.useRef<HTMLDivElement>(null);

    // Close other menus when this one opens
    useEffect(() => {
        if (isMenuOpen) {
            openMenuId = data.id;
        } else if (openMenuId === data.id) {
            openMenuId = null;
        }
    }, [isMenuOpen, data.id]);

    // Close this menu if another one opens
    useEffect(() => {
        if (openMenuId && openMenuId !== data.id && isMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [openMenuId, data.id, isMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const menuButton = menuButtonRef.current;
            const menuDropdown = menuDropdownRef.current;

            if (!menuButton?.contains(target) && !menuDropdown?.contains(target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    if (!data) {
        return null;
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (data.actions) {
            const toggleAction = data.actions.find(action => action.label === 'Toggle Complete');
            if (toggleAction) {
                toggleAction.onClick();
            }
        }
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleActionClick = (e: React.MouseEvent, action: { onClick: () => void }) => {
        e.stopPropagation();
        action.onClick();
        setIsMenuOpen(false);
    };

    const handleQuickAction = (e: React.MouseEvent, action: { onClick: () => void }) => {
        e.stopPropagation();
        action.onClick();
    };

    const formatTimeline = () => {
        if (data.fromDate && data.toDate) {
            const start = moment(data.fromDate);
            const end = moment(data.toDate);
            const isSameDay = start.isSame(end, 'day');

            if (isSameDay) {
                return (
                    <TimelineBadge>
                        <CalendarIcon size={14} />
                        {start.format('MMM D')} {start.format('h:mm A')} - {end.format('h:mm A')}
                    </TimelineBadge>
                );
            }

            return (
                <TimelineBadge>
                    <CalendarIcon size={14} />
                    {start.format('MMM D')} - {end.format('MMM D')}
                </TimelineBadge>
            );
        }
        return null;
    };

    const renderQuickActions = () => {
        if (!data.actions) return null;

        const quickActionMap = {
            'Toggle Complete': <CheckIcon size={16} />,
            'Edit': <EditIcon size={16} />,
            'Delete': <DeleteIcon size={16} />,
            'Promote to Project': <FolderIcon size={16} />
        };

        const priorityActions = ['Toggle Complete', 'Edit', 'Delete'];
        const quickActions = data.actions.filter(action =>
            priorityActions.includes(action.label)
        );

        return (
            <QuickActions>
                {quickActions.map((action, index) => (
                    <QuickActionButton
                        key={index}
                        onClick={(e) => handleQuickAction(e, action)}
                        title={action.label}
                    >
                        {quickActionMap[action.label as keyof typeof quickActionMap]}
                    </QuickActionButton>
                ))}
            </QuickActions>
        );
    };

    return (
        <StyledListItem
            variant={variant}
            onClick={onClick}
            className={className}
            $isCompleted={variant === 'task' && data.status === TaskStatus.COMPLETED}
        >
            {variant === 'task' && (
                <Checkbox
                    checked={data.status === TaskStatus.COMPLETED}
                    onChange={handleCheckboxChange}
                />
            )}
            <ListItemContent>
                <ListItemHeader>
                    <ListItemTitle $status={variant === 'task' ? data.status : undefined}>
                        {formatTitle(data.title)}
                    </ListItemTitle>
                    {variant === 'project' && data.taskCount !== undefined && (
                        <ListItemBadge variant="project">
                            {data.taskCount} {data.taskCount === 1 ? 'task' : 'tasks'}
                        </ListItemBadge>
                    )}
                </ListItemHeader>
                {data.description && (
                    <ListItemDescription>
                        {formatTitle(data.description)}
                    </ListItemDescription>
                )}
                {data.fromDate && data.toDate && (
                    <ListItemMeta>
                        {formatTimeline()}
                    </ListItemMeta>
                )}
            </ListItemContent>
            {renderQuickActions()}
            {data.actions && (
                <MenuContainer>
                    <MenuButton
                        ref={menuButtonRef}
                        onClick={handleMenuClick}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                    >
                        <DotsVerticalIcon size={20} />
                    </MenuButton>
                    <MenuDropdown
                        ref={menuDropdownRef}
                        isOpen={isMenuOpen}
                        role="menu"
                    >
                        {data.actions.map((action, index) => (
                            <MenuItem
                                key={index}
                                onClick={(e) => handleActionClick(e, action)}
                                className={action.className}
                                role="menuitem"
                            >
                                {action.label}
                            </MenuItem>
                        ))}
                    </MenuDropdown>
                </MenuContainer>
            )}
        </StyledListItem>
    );
} 