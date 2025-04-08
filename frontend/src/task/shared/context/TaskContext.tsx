import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, TaskStatus } from '../../types/task';
import { taskService } from '../../services/taskService';

// Define the state shape
interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
}

// Define action types
type TaskAction =
    | { type: 'SET_TASKS'; payload: Task[] }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: TaskState = {
    tasks: [],
    isLoading: false,
    error: null,
};

// Create context
const TaskContext = createContext<{
    state: TaskState;
    dispatch: React.Dispatch<TaskAction>;
} | null>(null);

// Reducer function
function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload };
        case 'ADD_TASK':
            return { ...state, tasks: [...state.tasks, action.payload] };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                ),
            };
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.payload),
            };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

// Provider component
export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(taskReducer, initialState);

    // Load tasks on mount
    useEffect(() => {
        const loadTasks = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                const tasks = await taskService.getAll();
                dispatch({ type: 'SET_TASKS', payload: tasks });
            } catch (error) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'Failed to load tasks',
                });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        loadTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
}

// Custom hook for using the context
export function useTaskContext() {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
}

// Helper functions for common operations
export function useTaskActions() {
    const { state, dispatch } = useTaskContext();

    const addTask = async (task: Omit<Task, 'id'>) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const newTask = await taskService.create(task);
            dispatch({ type: 'ADD_TASK', payload: newTask });
            return newTask;
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to add task',
            });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const updatedTask = await taskService.update(id, updates);
            dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
            return updatedTask;
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to update task',
            });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const deleteTask = async (id: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await taskService.delete(id);
            dispatch({ type: 'DELETE_TASK', payload: id });
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to delete task',
            });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const markComplete = async (id: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const task = state.tasks.find((t) => t.id === id);
            if (!task) throw new Error('Task not found');

            const updatedTask = await taskService.update(id, {
                status: TaskStatus.COMPLETED,
                completedAt: new Date().toISOString(),
            });
            dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
            return updatedTask;
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to mark task as complete',
            });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return {
        tasks: state.tasks,
        isLoading: state.isLoading,
        error: state.error,
        addTask,
        updateTask,
        deleteTask,
        markComplete,
    };
} 