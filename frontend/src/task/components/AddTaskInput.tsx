import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div<{ $isSubmitting?: boolean }>`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 0.875rem;
    color: ${props => props.theme.colors.text.primary};
    background: ${props => props.theme.colors.background.white};
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }

    &::placeholder {
      color: ${props => props.theme.colors.text.secondary};
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background.white};
    border: none;
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${props => props.theme.colors.primaryHover};
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

interface AddTaskInputProps {
    onAddTask: (title: string) => Promise<void>;
    isSubmitting?: boolean;
}

export default function AddTaskInput({ onAddTask, isSubmitting = false }: AddTaskInputProps) {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent<HTMLInputElement>) => {
        if (e.type === 'keypress' && (e as React.KeyboardEvent).key !== 'Enter') return;
        e.preventDefault();

        if (!title.trim() || isSubmitting) return;

        try {
            await onAddTask(title.trim());
            setTitle('');
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    return (
        <Container $isSubmitting={isSubmitting}>
            <input
                type="text"
                placeholder="Add a new task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleSubmit}
                disabled={isSubmitting}
            />
            <button
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim()}
            >
                {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
        </Container>
    );
} 