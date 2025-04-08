import React from 'react';
import styled from 'styled-components';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { Button } from '../buttons/Button';
import { TaskPriority } from '../../../domains/task/types/task';

interface TaskFormProps {
    initialValues?: {
        title: string;
        description: string;
        priority: TaskPriority;
    };
    onSubmit: (values: {
        title: string;
        description: string;
        priority: TaskPriority;
    }) => void;
    onCancel: () => void;
    submitButtonText: string;
    isLoading?: boolean;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PrioritySelect = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  color: ${props => props.theme.colors.text.primary};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

export const TaskForm: React.FC<TaskFormProps> = ({
    initialValues = {
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM,
    },
    onSubmit,
    onCancel,
    submitButtonText,
    isLoading = false,
}) => {
    const [values, setValues] = React.useState(initialValues);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(values);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                label="Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                required
                placeholder="Enter task title"
            />

            <TextArea
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows={4}
            />

            <div>
                <label htmlFor="priority">Priority</label>
                <PrioritySelect
                    id="priority"
                    name="priority"
                    value={values.priority}
                    onChange={handleChange}
                >
                    <option value={TaskPriority.LOW}>Low</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High</option>
                </PrioritySelect>
            </div>

            <ButtonGroup>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : submitButtonText}
                </Button>
            </ButtonGroup>
        </Form>
    );
}; 