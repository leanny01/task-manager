import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { Project, ProjectStatus } from '../types/project';
import { Task, CreateTaskInput } from '../../task/types/task';
import { TaskStatus, TaskPriority } from '../../task/types/enums';
import { projectService } from '../services/projectService';
import { taskService } from '../../task/services/taskService';
import { toast } from 'react-toastify';
import ListItem from '../../shared/components/ListItem';
import EditTaskModal from '../../task/edit/EditTaskModal';
import { useEditTask } from '../../task/edit/useEditTask';
import { useDeleteTask } from '../../task/delete/useDeleteTask';
import TaskList from '../../task/list/TaskList';
import Timeline from '../../shared/components/Timeline';

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
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const Description = styled.p`
  margin: 0.5rem 0 0;
  color: ${props => props.theme.colors.text.light};
  font-size: 1rem;
  white-space: pre-wrap;
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  color: ${props => props.theme.colors.text.primary};
  margin: 0.5rem 0;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.light};
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const Meta = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 2rem;
  color: ${props => props.theme.colors.text.light};
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
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background.white};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const StyledListItem = styled(ListItem)`
  &:hover .task-actions {
    opacity: 1;
  }
`;

const AddTaskInput = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  display: flex;
  gap: 1rem;
  
  input {
    flex: 1;
    padding: 0.5rem;
    border: none;
    font-size: 1rem;
    
    &::placeholder {
      color: ${props => props.theme.colors.text.light};
    }
    
    &:focus {
      outline: none;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.light};
  padding: 2rem 0;
`;

const LoadingState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.light};
  padding: 2rem 0;
`;

const ErrorState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
  padding: 2rem 0;
`;

const SearchBar = styled.div`
  position: relative;
  width: 300px;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-left: 2.5rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 0.5rem;
    font-size: 1rem;
    
    &::placeholder {
      color: ${props => props.theme.colors.text.light};
    }
  }
  
  &::before {
    content: "🔍";
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.text.light};
  }
`;

const ProjectTimeline = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background.light};
  border-radius: 0.375rem;
`;

const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const TimelineLabel = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const TimelineValue = styled.span`
  color: ${props => props.theme.colors.text.secondary};
`;

const TimelineDuration = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const { editTask } = useEditTask();
  const { deleteTask } = useDeleteTask();

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

  useEffect(() => {
    if (tasks.length > 0) {
      const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredTasks(filtered);
    }
  }, [tasks, searchQuery]);

  const handleAddTask = async (e: React.FormEvent | React.KeyboardEvent<HTMLInputElement>) => {
    if (e.type === 'keypress' && (e as React.KeyboardEvent).key !== 'Enter') return;
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

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
      await editTask(id, {
        status: newStatus,
        completedAt: newStatus === TaskStatus.COMPLETED ? new Date().toISOString() : undefined
      });
      await loadProjectAndTasks();
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      await loadProjectAndTasks();
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    try {
      const updatedTask = await editTask(id, updates);
      await loadProjectAndTasks();
      toast.success('Task updated successfully');
      return updatedTask;
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  };

  const handleEditDescription = () => {
    if (!project) return;
    setIsEditingDescription(true);
    setEditedDescription(project.description || '');
  };

  const handleSaveDescription = async () => {
    if (!project) return;
    try {
      await projectService.update(project.id, {
        description: editedDescription
      });
      await loadProjectAndTasks();
      toast.success('Project description updated');
      setIsEditingDescription(false);
    } catch (error) {
      toast.error('Failed to update project description');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingDescription(false);
  };

  const calculateProjectTimeline = (tasks: Task[]) => {
    if (tasks.length === 0) return null;

    const validTasks = tasks.filter(task => task.fromDate && task.toDate);
    if (validTasks.length === 0) return null;

    const startDates = validTasks.map(task => moment(task.fromDate));
    const endDates = validTasks.map(task => moment(task.toDate));

    const projectStart = moment.min(startDates).format();
    const projectEnd = moment.max(endDates).format();

    return {
      fromDate: projectStart,
      toDate: projectEnd
    };
  };

  const formatDuration = (duration: moment.Duration): string => {
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (isLoading) {
    return <LoadingState>Loading...</LoadingState>;
  }

  if (error || !project) {
    return <ErrorState>Error: {error || 'Project not found'}</ErrorState>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>←</BackButton>
        <ProjectInfo>
          <Title>{project.title}</Title>
          {isEditingDescription ? (
            <div>
              <DescriptionInput
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add a description..."
              />
              <div>
                <button onClick={handleSaveDescription}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <Description>
              {project.description || 'No description'}
              <EditButton onClick={handleEditDescription}>✏️</EditButton>
            </Description>
          )}
          <Meta>
            <span>Status: {project.status}</span>
            <span>Priority: {project.priority}</span>
            {project.dueDate && <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>}
          </Meta>
          {tasks.length > 0 && (
            <ProjectTimeline>
              {(() => {
                const timeline = calculateProjectTimeline(tasks);
                if (!timeline) return null;

                return (
                  <Timeline
                    fromDate={timeline.fromDate}
                    toDate={timeline.toDate}
                    showLabels={true}
                  />
                );
              })()}
            </ProjectTimeline>
          )}
        </ProjectInfo>
      </Header>

      <Section>
        <SectionHeader>
          <SectionTitle>Tasks</SectionTitle>
          <SearchBar>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
        </SectionHeader>

        <AddTaskInput>
          <input
            type="text"
            placeholder="Add a new task"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleAddTask}
            disabled={isSubmitting}
          />
          <button
            onClick={handleAddTask}
            disabled={isSubmitting || !newTaskTitle.trim()}
          >
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </AddTaskInput>

        {tasks.length === 0 ? (
          <EmptyState>No tasks in this project yet</EmptyState>
        ) : (
          <TaskList
            items={searchQuery ? filteredTasks : tasks}
            onEditTask={handleEditTask}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </Section>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={handleUpdateTask}
        />
      )}
    </Container>
  );
} 