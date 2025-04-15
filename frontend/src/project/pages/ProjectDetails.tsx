import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Project, ProjectStatus } from '../types/project';
import { Task, TaskStatus, CreateTaskInput, TaskPriority } from '../../task/types/task';
import { projectService } from '../services/projectService';
import { taskService } from '../../task/services/taskService';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
  color: #4b5563;
  
  &:hover {
    color: #111827;
  }
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
`;

const Description = styled.p`
  margin: 0.5rem 0 0;
  color: #6b7280;
  font-size: 1rem;
`;

const Meta = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const Section = styled.section`
  margin-top: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TaskItem = styled.li`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background: white;
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TaskTitle = styled.h3<{ $completed: boolean }>`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.$completed ? '#9ca3af' : '#111827'};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  flex: 1;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  
  &:hover {
    color: #111827;
  }
`;

const TaskDetails = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const TaskDuration = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const AddTaskForm = styled.form`
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  display: flex;
  gap: 1rem;
`;

const TaskInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function formatDuration(fromDate: string, toDate: string): string {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
        return `${diffDays}d ${diffHours}h`;
    }
    return `${diffHours}h`;
}

export default function ProjectDetails() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadProjectAndTasks = async () => {
        if (!projectId) return;

        setIsLoading(true);
        setError(null);

        try {
            const projectData = await projectService.getById(projectId);
            if (!projectData) {
                throw new Error('Project not found');
            }
            setProject(projectData);

            const allTasks = await taskService.getAll();
            const projectTasks = allTasks.filter(task => task.projectId === projectId);
            setTasks(projectTasks);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load project');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProjectAndTasks();
    }, [projectId]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId || !newTaskTitle.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const newTask: CreateTaskInput = {
                title: newTaskTitle.trim(),
                projectId: projectId,
                priority: TaskPriority.MEDIUM,
            };

            await taskService.create(newTask);
            await loadProjectAndTasks();
            setNewTaskTitle('');
            toast.success('Task added successfully');
        } catch (error) {
            toast.error('Failed to add task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleComplete = async (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        try {
            const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
            await taskService.update(taskId, {
                status: newStatus,
                completedAt: newStatus === TaskStatus.COMPLETED ? new Date().toISOString() : undefined
            });
            await loadProjectAndTasks();
            toast.success('Task status updated');
        } catch (error) {
            toast.error('Failed to update task status');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await taskService.delete(taskId);
            await loadProjectAndTasks();
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const handleEditTask = async (taskId: string) => {
        // Navigate to task edit modal/page
        // This will be implemented later
        toast.info('Edit task functionality coming soon');
    };

    if (isLoading) {
        return <Container>Loading...</Container>;
    }

    if (error || !project) {
        return <Container>Error: {error || 'Project not found'}</Container>;
    }

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate(-1)}>←</BackButton>
                <ProjectInfo>
                    <Title>{project.title}</Title>
                    {project.description && (
                        <Description>{project.description}</Description>
                    )}
                    <Meta>
                        {project.dueDate && (
                            <span>📅 Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                        )}
                        <span>📝 {tasks.length} tasks</span>
                        <span>📊 Status: {project.status}</span>
                    </Meta>
                </ProjectInfo>
            </Header>

            <Section>
                <SectionHeader>
                    <SectionTitle>Tasks</SectionTitle>
                </SectionHeader>

                <AddTaskForm onSubmit={handleAddTask}>
                    <TaskInput
                        type="text"
                        placeholder="Add a new task"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <SubmitButton type="submit" disabled={isSubmitting || !newTaskTitle.trim()}>
                        {isSubmitting ? 'Adding...' : 'Add Task'}
                    </SubmitButton>
                </AddTaskForm>

                {tasks.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>
                        No tasks in this project yet
                    </p>
                ) : (
                    <TaskList>
                        {tasks.map(task => (
                            <TaskItem key={task.id}>
                                <TaskHeader>
                                    <input
                                        type="checkbox"
                                        checked={task.status === TaskStatus.COMPLETED}
                                        onChange={() => handleToggleComplete(task.id)}
                                    />
                                    <TaskTitle $completed={task.status === TaskStatus.COMPLETED}>
                                        {task.title}
                                    </TaskTitle>
                                    <TaskActions>
                                        <ActionButton onClick={() => handleEditTask(task.id)}>Edit</ActionButton>
                                        <ActionButton onClick={() => handleDeleteTask(task.id)}>Delete</ActionButton>
                                    </TaskActions>
                                </TaskHeader>
                                {task.description && (
                                    <TaskDetails>{task.description}</TaskDetails>
                                )}
                                <TaskDuration>
                                    {task.fromDate && task.toDate ? (
                                        <>
                                            <span>⏱️ Duration: {formatDuration(task.fromDate, task.toDate)}</span>
                                            <span>🕒 {new Date(task.fromDate).toLocaleString()} - {new Date(task.toDate).toLocaleString()}</span>
                                        </>
                                    ) : task.fromDate ? (
                                        <span>🕒 From: {new Date(task.fromDate).toLocaleString()}</span>
                                    ) : task.toDate ? (
                                        <span>🕒 Due: {new Date(task.toDate).toLocaleString()}</span>
                                    ) : null}
                                </TaskDuration>
                            </TaskItem>
                        ))}
                    </TaskList>
                )}
            </Section>
        </Container>
    );
} 