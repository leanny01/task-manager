import React, { useState } from 'react';
import styled from 'styled-components';
import { useTasks } from '../slices/task/hooks/useTasks';
import TaskList from '../slices/task/components/TaskList';
import AddTaskForm from '../slices/task/components/AddTaskForm';
import EditTaskModal from '../slices/task/components/EditTaskModal';
import { Task } from '../slices/task/types/task';

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
  const {
    tasks,
    isLoading,
    error,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask
  } = useTasks();

  // State for the task being edited
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handle opening the edit modal
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  // Handle closing the edit modal
  const handleCloseModal = () => {
    setEditingTask(null);
  };

  // Calculate task statistics
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
                  onToggleComplete={toggleTaskCompletion}
                  onDeleteTask={deleteTask}
                  onEditTask={handleEditTask}
                />
              )}
            </TaskListWrapper>
          </div>

          <div>
            <AddTaskForm onSubmit={addTask} isLoading={isLoading} />
            {error && (
              <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
            )}
          </div>
        </TaskSection>
      </Content>

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={updateTask}
        />
      )}
    </Container>
  );
} 