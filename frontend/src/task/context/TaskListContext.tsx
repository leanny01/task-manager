import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Task, TaskStatus } from '../types/task';

interface TaskListState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
}

type TaskListAction =
    | { type: 'SET_TASKS'; payload: Task[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: string };

const initialState: TaskListState = {
    tasks: [],
    isLoading: false,
    error: null,
};

const TaskListContext = createContext<{
    state: TaskListState;
    dispatch: React.Dispatch<TaskListAction>;
    updateTaskList: () => Promise<void>;
} | null>(null);

function taskListReducer(state: TaskListState, action: TaskListAction): TaskListState {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
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
        default:
            return state;
    }
}

export function TaskListProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(taskListReducer, initialState);

    const updateTaskList = useCallback(async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            // TODO: Replace with actual API call
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            dispatch({ type: 'SET_TASKS', payload: tasks });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch tasks' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    return (
        <TaskListContext.Provider value={{ state, dispatch, updateTaskList }}>
            {children}
        </TaskListContext.Provider>
    );
}

export function useTaskList() {
    const context = useContext(TaskListContext);
    if (!context) {
        throw new Error('useTaskList must be used within a TaskListProvider');
    }
    return context;
} 