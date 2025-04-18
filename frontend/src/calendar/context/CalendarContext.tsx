import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task } from '../../task/types/task';
import { Project } from '../../project/types/project';
import { CalendarState, CalendarRepository } from '../types/calendar.types';
import { calendarSyncService } from '../services/calendarSyncService';
import { toast } from 'react-toastify';

const CalendarContext = createContext<CalendarRepository | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<CalendarState>({
        status: 'idle',
        lastSyncTime: null,
        error: null,
        syncedItems: {
            tasks: [],
            projects: []
        }
    });

    const startSync = useCallback(() => {
        setState(prev => ({
            ...prev,
            status: 'syncing',
            error: null
        }));
    }, []);

    const syncSuccess = useCallback((tasks: Task[], projects: Project[]) => {
        setState(prev => ({
            ...prev,
            status: 'success',
            lastSyncTime: new Date().toISOString(),
            syncedItems: {
                tasks: tasks.map(task => task.id),
                projects: projects.map(project => project.id)
            }
        }));
    }, []);

    const syncError = useCallback((error: string) => {
        setState(prev => ({
            ...prev,
            status: 'error',
            error
        }));
    }, []);

    const resetSync = useCallback(() => {
        calendarSyncService.resetSync();
        setState(prev => ({
            ...prev,
            status: 'idle',
            error: null
        }));
    }, []);

    const syncTasks = useCallback(async (tasks: Task[]) => {
        try {
            startSync();
            await calendarSyncService.syncTasks(tasks);
            syncSuccess(tasks, []);
            toast.success('Calendar sync completed successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            syncError(errorMessage);
            toast.error(`Calendar sync failed: ${errorMessage}`);
        }
    }, [startSync, syncSuccess, syncError]);

    const syncProjects = useCallback(async (projects: Project[]) => {
        try {
            startSync();
            await calendarSyncService.syncProjects(projects);
            syncSuccess([], projects);
            toast.success('Calendar sync completed successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            syncError(errorMessage);
            toast.error(`Calendar sync failed: ${errorMessage}`);
        }
    }, [startSync, syncSuccess, syncError]);

    const deleteTaskEvent = useCallback(async (task: Task) => {
        try {
            startSync();
            await calendarSyncService.deleteTaskEvent(task);
            syncSuccess([], []);
            toast.success('Calendar event deleted successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            syncError(errorMessage);
            toast.error(`Failed to delete calendar event: ${errorMessage}`);
        }
    }, [startSync, syncSuccess, syncError]);

    const deleteProjectEvent = useCallback(async (project: Project) => {
        try {
            startSync();
            await calendarSyncService.deleteProjectEvent(project);
            syncSuccess([], []);
            toast.success('Calendar event deleted successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            syncError(errorMessage);
            toast.error(`Failed to delete calendar event: ${errorMessage}`);
        }
    }, [startSync, syncSuccess, syncError]);

    const updateTaskEvent = useCallback(async (task: Task) => {
        try {
            startSync();
            await calendarSyncService.updateTaskEvent(task);
            syncSuccess([task], []);
            toast.success('Calendar event updated successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            syncError(errorMessage);
            toast.error(`Failed to update calendar event: ${errorMessage}`);
        }
    }, [startSync, syncSuccess, syncError]);

    const updateProjectEvent = useCallback(async (project: Project) => {
        try {
            startSync();
            await calendarSyncService.updateProjectEvent(project);
            syncSuccess([], [project]);
            toast.success('Calendar event updated successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            syncError(errorMessage);
            toast.error(`Failed to update calendar event: ${errorMessage}`);
        }
    }, [startSync, syncSuccess, syncError]);

    return (
        <CalendarContext.Provider
            value={{
                getState: () => state,
                startSync,
                syncSuccess,
                syncError,
                resetSync,
                syncTasks,
                syncProjects,
                deleteTaskEvent,
                deleteProjectEvent,
                updateTaskEvent,
                updateProjectEvent
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar() {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
} 