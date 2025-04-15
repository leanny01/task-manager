import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { useCreateTask } from '../hooks/useCreateTask';
import { CreateTaskInput } from '../types/task';

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.125rem;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background-color: ${props => props.theme.colors.errorLight};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
`;

export default function AddTaskPage() {
    const navigate = useNavigate();
    const { createTask, isLoading, error } = useCreateTask();

    const handleSubmit = async (task: CreateTaskInput) => {
        try {
            await createTask(task);
            navigate('/'); // Redirect to task list after successful creation
        } catch (err) {
            // Error is handled by the useCreateTask hook
            console.error('Failed to create task:', err);
        }
    };

    return (
        <Container>
            <Header>
                <Title>Create New Task</Title>
                <Subtitle>Add a new task to your list</Subtitle>
            </Header>

            <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />

            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}
        </Container>
    );
} 