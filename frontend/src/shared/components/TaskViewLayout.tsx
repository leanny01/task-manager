import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { PlusIcon } from './Icons';
import { TaskPriority } from '../../task/types/enums';
import { useCreateTask } from '../../task/create/useCreateTask';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchBar = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const AddTaskContainer = styled.div`
  position: relative;
  width: 100%;
`;

const AddTaskInput = styled.input`
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const AddButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  transition: all 0.2s ease;
  border-radius: 0.375rem;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.background.light};
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

interface TaskViewLayoutProps {
    children: React.ReactNode;
    onSearch?: (query: string) => void;
    onTaskAdded?: (title: string) => void;
    autoFocus?: boolean;
}

export default function TaskViewLayout({
    children,
    onSearch,
    onTaskAdded,
    autoFocus = false,
}: TaskViewLayoutProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const { createTask, isLoading: isCreating } = useCreateTask();
    const addTaskInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && addTaskInputRef.current) {
            addTaskInputRef.current.focus();
        }
    }, [autoFocus]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch?.(query);
    };

    const handleAddTask = async () => {
        if (newTaskTitle.trim()) {
            try {
                await createTask({
                    title: newTaskTitle.trim(),
                    priority: TaskPriority.MEDIUM,
                });
                setNewTaskTitle('');
                onTaskAdded?.(newTaskTitle.trim());
            } catch (error) {
                console.error('Failed to create task:', error);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };

    return (
        <Layout>
            <Header>
                <SearchBar
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <AddTaskContainer>
                    <AddTaskInput
                        ref={addTaskInputRef}
                        type="text"
                        placeholder="Add a new task..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isCreating}
                    />
                    <AddButton onClick={handleAddTask} disabled={isCreating}>
                        <PlusIcon size={16} />
                    </AddButton>
                </AddTaskContainer>
            </Header>
            <Content>{children}</Content>
        </Layout>
    );
} 