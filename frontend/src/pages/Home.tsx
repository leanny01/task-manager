import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Task, CreateTaskInput } from '../task/types/task';
import TaskList from '../task/list/TaskList';
import AddTaskForm from '../task/create/AddTaskForm';
import EditTaskModal from '../task/edit/EditTaskModal';
import { useCreateTask } from '../task/create/useCreateTask';
import { useEditTask } from '../task/edit/useEditTask';
import { useListTasks } from '../task/list/useListTasks';
import { taskService } from '../task/services/taskService';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const TaskSection = styled.section`
  display: grid;
  gap: 2rem;
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }
`;

const TaskListWrapper = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: ${props => props.theme.colors.text.light};
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const TaskCount = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

export default function Home() {
  const { tasks, isLoading: isLoadingList, error: listError, loadTasks } = useListTasks();
  const { createTask, isLoading: isCreating, error: createError } = useCreateTask();
  const { editTask, isLoading: isEditing, error: editError } = useEditTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
  };

  const handleAddTask = async (task: CreateTaskInput): Promise<Task> => {
    const newTask = await createTask(task);
    await loadTasks();
    return newTask;
  };

  const handleUpdateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
    const updatedTask = await editTask(id, task);
    await loadTasks();
    return updatedTask;
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    await taskService.delete(id);
    await loadTasks();
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <Container>
      <Content>
        <Header>
          <Title>Task Manager</Title>
          <Subtitle>Manage your tasks efficiently</Subtitle>
        </Header>

        <TaskSection>
          <div>
            <TasksHeader>
              <TaskCount>
                {totalTasks === 0
                  ? 'No Tasks'
                  : `${completedTasks}/${totalTasks} Tasks${completedTasks === totalTasks && totalTasks > 0 ? ' (All completed!)' : ''}`}
              </TaskCount>
            </TasksHeader>

            <TaskListWrapper>
              {tasks.length === 0 ? (
                <EmptyState>
                  <p>No tasks yet. Add your first task to get started!</p>
                </EmptyState>
              ) : (
                <TaskList
                  tasks={tasks}
                  onEditTask={handleEditTask}
                  onToggleComplete={async (id) => {
                    const task = tasks.find(t => t.id === id);
                    if (task) {
                      await handleUpdateTask(id, { completed: !task.completed });
                    }
                  }}
                  onDeleteTask={handleDeleteTask}
                />
              )}
            </TaskListWrapper>
          </div>

          <div>
            <AddTaskForm onSubmit={handleAddTask} isLoading={isCreating} />
            {(createError || listError) && (
              <p style={{ color: 'red', marginTop: '1rem' }}>{createError || listError}</p>
            )}
          </div>
        </TaskSection>
      </Content>

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