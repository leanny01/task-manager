import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Task, CreateTaskInput, TaskStatus, TaskPriority } from '../task/types/task';
import { ProjectPriority, ProjectStatus } from '../project/types/project';
import TaskList from '../task/list/TaskList';
import EditTaskModal from '../task/edit/EditTaskModal';
import { useCreateTask } from '../task/create/useCreateTask';
import { useEditTask } from '../task/edit/useEditTask';
import { useListTasks } from '../task/list/useListTasks';
import { useMarkCompleteTask } from '../task/complete/useMarkCompleteTask';
import { taskService } from '../task/services/taskService';
import { projectService } from '../project/services/projectService';
import { toast } from 'react-toastify';
import ProjectList from '../project/list/ProjectList';
import { useProjects } from '../project/hooks/useProjects';
import {
  AppContainer,
  Sidebar,
  Logo,
  NavList,
  NavItem,
  MainContent,
  Header,
  SearchBar,
  UserProfile,
  AddTaskInput,
  TaskContainer,
  ErrorMessage,
  Section,
  SectionTitle,
  LoadingState,
  EmptyState
} from './Home.styles';

export default function Home() {
  const { tasks, isLoading: isLoadingTasks, error: tasksError, loadTasks } = useListTasks();
  const { projects, projectTasks, isLoading: isLoadingProjects, error: projectsError, refresh: refreshProjects } = useProjects();
  const { createTask, isLoading: isCreating, error: createError } = useCreateTask();
  const { editTask, isLoading: isEditing, error: editError } = useEditTask();
  const { markComplete, isLoading: isCompleting, error: completeError } = useMarkCompleteTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
  };

  const handleAddTask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskTitle.trim()) {
      try {
        await createTask({
          title: newTaskTitle.trim(),
          priority: TaskPriority.MEDIUM,
        });
        setNewTaskTitle('');
        await loadTasks();
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    const updatedTask = await editTask(id, updates);
    await loadTasks();
    return updatedTask;
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    await taskService.delete(id);
    await loadTasks();
  };

  const handleToggleComplete = async (id: string): Promise<void> => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (task.status === TaskStatus.COMPLETED) {
        await handleUpdateTask(id, { status: TaskStatus.PENDING });
      } else {
        await markComplete(id);
      }
      await loadTasks();
      await refreshProjects();
    }
  };

  const handlePromoteToProject = async (task: Task) => {
    try {
      await projectService.promoteTaskToProject(task);
      await loadTasks();
      toast.success('Task promoted to project successfully');
    } catch (error) {
      console.error('Error promoting task to project:', error);
      toast.error('Failed to promote task to project');
    }
  };

  // Combine and sort projects and standalone tasks
  const combinedItems = useMemo(() => {
    const standaloneItems = tasks.filter(task => !task.projectId);
    return [...projects, ...standaloneItems].sort((a, b) => {
      const dateA = new Date(('taskIds' in a ? a.dueDate : a.toDate) || '').getTime() || Infinity;
      const dateB = new Date(('taskIds' in b ? b.dueDate : b.toDate) || '').getTime() || Infinity;
      return dateA - dateB;
    });
  }, [projects, tasks]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = useMemo(() => {
    let items = combinedItems;

    // Apply search filter
    if (searchQuery.trim()) {
      items = items.filter(item => {
        const isProject = 'taskIds' in item;
        if (isProject) {
          return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        } else {
          return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        }
      });
    }

    // Apply status filter
    return items.filter(item => {
      const isProject = 'taskIds' in item;
      if (isProject) {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'completed') return item.status === 'COMPLETED';
        return true;
      } else {
        const task = item;
        switch (activeFilter) {
          case 'completed':
            return task.status === TaskStatus.COMPLETED;
          case 'today':
            const today = new Date();
            const taskDate = task.toDate ? new Date(task.toDate) : null;
            return taskDate &&
              taskDate.getDate() === today.getDate() &&
              taskDate.getMonth() === today.getMonth() &&
              taskDate.getFullYear() === today.getFullYear();
          case 'upcoming':
            return task.toDate && new Date(task.toDate) > new Date();
          default:
            return true;
        }
      }
    });
  }, [combinedItems, searchQuery, activeFilter]);

  const isLoading = isLoadingTasks || isLoadingProjects || isCreating || isEditing || isCompleting;
  const error = tasksError || projectsError || createError || editError || completeError;

  return (
    <AppContainer>
      <Sidebar>
        <Logo>TidyTasks</Logo>
        <NavList>
          <NavItem active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
            ○ All
          </NavItem>
          <NavItem active={activeFilter === 'today'} onClick={() => setActiveFilter('today')}>
            📅 Today
          </NavItem>
          <NavItem active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')}>
            📆 Upcoming
          </NavItem>
          <NavItem active={activeFilter === 'completed'} onClick={() => setActiveFilter('completed')}>
            ✓ Completed
          </NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        <Header>
          <SearchBar>
            <input
              type="text"
              placeholder="Search tasks and projects..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </SearchBar>
          <UserProfile>
            <img src="/default-avatar.png" alt="User profile" />
          </UserProfile>
        </Header>

        <TaskContainer>
          <AddTaskInput>
            <input
              type="text"
              placeholder="Add a task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={handleAddTask}
            />
          </AddTaskInput>

          {isLoading ? (
            <LoadingState>Loading...</LoadingState>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <EmptyState>No items found</EmptyState>
              ) : (
                <TaskList
                  items={filteredItems}
                  projectTasks={projectTasks}
                  onEditTask={handleEditTask}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                  onPromoteToProject={handlePromoteToProject}
                />
              )}
            </>
          )}

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
        </TaskContainer>
      </MainContent>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={handleUpdateTask}
        />
      )}
    </AppContainer>
  );
} 