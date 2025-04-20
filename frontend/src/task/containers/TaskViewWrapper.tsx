import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Task } from '../types/task';
import { TaskStatus, TaskPriority } from '../types/enums';
import { useListTasks } from '../list/useListTasks';
import { useMarkCompleteTask } from '../complete/useMarkCompleteTask';
import { useEditTask } from '../edit/useEditTask';
import { useCreateTask } from '../create/useCreateTask';
import { taskService } from '../services/taskService';
import styled from 'styled-components';
import { PlusIcon } from '../../shared/components/Icons';
import { CustomTheme } from '../../shared/theme';
import EditTaskModal from '../edit/EditTaskModal';
import { Project } from '../../project/types/project';
import { useProjects } from '../../project/hooks/useProjects';
import { projectService } from '../../project/services/projectService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input<{ theme: CustomTheme }>`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const AddTaskContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AddTaskInput = styled.input<{ theme: CustomTheme }>`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const AddButton = styled.button<{ theme: CustomTheme }>`
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LoadingState = styled.div<{ theme: CustomTheme }>`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ErrorMessage = styled.div<{ theme: CustomTheme }>`
  color: ${props => props.theme.colors.error};
  padding: 1rem;
  text-align: center;
`;

interface TaskViewWrapperProps {
    children: (props: {
        tasks: Task[];
        onToggleComplete: (id: string) => Promise<void>;
        onDeleteTask: (id: string) => Promise<void>;
        onEditTask: (task: Task) => void;
    }) => React.ReactNode;
}

export default function TaskViewWrapper({ children }: TaskViewWrapperProps) {
    const { tasks, isLoading, error, loadTasks } = useListTasks();
    const { markComplete } = useMarkCompleteTask();
    const { editTask } = useEditTask();
    const { createTask } = useCreateTask();
    const { projects, refresh: refreshProjects } = useProjects();

    const [searchQuery, setSearchQuery] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const handleToggleComplete = async (id: string): Promise<void> => {
        try {
            await markComplete(id);
            await loadTasks();
        } catch (err) {
            console.error('Failed to toggle task completion:', err);
        }
    };

    const handleDeleteTask = async (id: string): Promise<void> => {
        try {
            await taskService.delete(id);
            await loadTasks();
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleCloseModal = () => {
        setEditingTask(null);
    };

    const handleSaveTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
        try {
            const updatedTask = await editTask(id, updates);
            await loadTasks();
            return updatedTask;
        } catch (err) {
            console.error('Failed to update task:', err);
            throw err;
        }
    };

    const handlePromoteToProject = async (task: Task) => {
        try {
            await projectService.promoteTaskToProject(task);
            await loadTasks();
            await refreshProjects();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to promote task to project:', err);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            await createTask({
                title: newTaskTitle.trim(),
                priority: TaskPriority.MEDIUM
            });
            setNewTaskTitle('');
            await loadTasks();
        } catch (err) {
            console.error('Failed to create task:', err);
        }
    };

    const filteredTasks = useMemo(() => {
        if (!searchQuery) return tasks;
        return tasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tasks, searchQuery]);

    if (isLoading) {
        return <LoadingState>Loading tasks...</LoadingState>;
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <Container>
            <SearchBar>
                <SearchInput
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </SearchBar>

            <form onSubmit={handleAddTask}>
                <AddTaskContainer>
                    <AddTaskInput
                        type="text"
                        placeholder="Add a new task..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <AddButton type="submit">
                        <PlusIcon size={16} />
                    </AddButton>
                </AddTaskContainer>
            </form>

            {children({
                tasks: filteredTasks,
                onToggleComplete: handleToggleComplete,
                onDeleteTask: handleDeleteTask,
                onEditTask: handleEditTask,
            })}

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    projects={projects}
                    onClose={handleCloseModal}
                    onSave={handleSaveTask}
                    onPromoteToProject={handlePromoteToProject}
                />
            )}
        </Container>
    );
} 