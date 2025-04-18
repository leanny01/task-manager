import { Task } from "../../task/types/task";
import { Project } from "../../project/types/project";
import { CalendarState, CalendarRepository } from "../types/calendar.types";
import {
  createGoogleCalendarRepository,
  GoogleCalendarRepository,
} from "./googleCalendarRepository";

export const createCalendarRepository = (): CalendarRepository => {
  const googleCalendarRepository: GoogleCalendarRepository =
    createGoogleCalendarRepository();

  let state: CalendarState = {
    status: "idle",
    lastSyncTime: null,
    error: null,
    syncedItems: {
      tasks: [],
      projects: [],
    },
  };

  const getState = (): CalendarState => ({ ...state });

  const startSync = (): void => {
    state = {
      ...state,
      status: "syncing",
      error: null,
    };
  };

  const syncSuccess = (tasks: Task[], projects: Project[]): void => {
    state = {
      ...state,
      status: "success",
      lastSyncTime: new Date().toISOString(),
      syncedItems: {
        tasks: tasks.map((task) => task.id),
        projects: projects.map((project) => project.id),
      },
    };
  };

  const syncError = (error: string): void => {
    state = {
      ...state,
      status: "error",
      error,
    };
  };

  const resetSync = (): void => {
    state = {
      ...state,
      status: "idle",
      error: null,
    };
  };

  const deleteTaskEvent = async (task: Task): Promise<void> => {
    try {
      startSync();
      if (task.calendarEventId) {
        await googleCalendarRepository.deleteEvent(
          "primary",
          task.calendarEventId
        );
        task.calendarEventId = undefined;
        syncSuccess([], []);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      syncError(errorMessage);
      throw error;
    }
  };

  const deleteProjectEvent = async (project: Project): Promise<void> => {
    try {
      startSync();
      if (project.calendarEventId) {
        await googleCalendarRepository.deleteEvent(
          "primary",
          project.calendarEventId
        );
        project.calendarEventId = undefined;
        syncSuccess([], []);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      syncError(errorMessage);
      throw error;
    }
  };

  const updateTaskEvent = async (task: Task): Promise<void> => {
    try {
      startSync();
      if (task.calendarEventId) {
        const event = googleCalendarRepository.convertTaskToEvent(task);
        await googleCalendarRepository.updateEvent(
          "primary",
          task.calendarEventId,
          event
        );
        syncSuccess([task], []);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      syncError(errorMessage);
      throw error;
    }
  };

  const updateProjectEvent = async (project: Project): Promise<void> => {
    try {
      startSync();
      if (project.calendarEventId) {
        const event = googleCalendarRepository.convertProjectToEvent(project);
        await googleCalendarRepository.updateEvent(
          "primary",
          project.calendarEventId,
          event
        );
        syncSuccess([], [project]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      syncError(errorMessage);
      throw error;
    }
  };

  const syncTasks = async (tasks: Task[]): Promise<void> => {
    try {
      startSync();

      // Get existing events for the time range
      const timeMin = new Date().toISOString();
      const timeMax = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(); // Next 30 days
      const existingEvents = await googleCalendarRepository.getEvents(
        "primary",
        timeMin,
        timeMax
      );

      // TODO: Load tasks created in this app from Google Calendar to sync them to the app

      // Sync each task
      for (const task of tasks) {
        const event = googleCalendarRepository.convertTaskToEvent(task);

        if (task.calendarEventId) {
          // Update existing event
          await googleCalendarRepository.updateEvent(
            "primary",
            task.calendarEventId,
            event
          );
        } else {
          // Create new event
          const createdEvent = await googleCalendarRepository.createEvent(
            "primary",
            event
          );
          task.calendarEventId = createdEvent.id;
        }
      }

      syncSuccess(tasks, []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      syncError(errorMessage);
      throw error;
    }
  };

  const syncProjects = async (projects: Project[]): Promise<void> => {
    try {
      startSync();

      // Get existing events for the time range
      const timeMin = new Date().toISOString();
      const timeMax = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(); // Next 30 days
      const existingEvents = await googleCalendarRepository.getEvents(
        "primary",
        timeMin,
        timeMax
      );

      // Sync each project
      for (const project of projects) {
        const event = googleCalendarRepository.convertProjectToEvent(project);

        if (project.calendarEventId) {
          // Update existing event
          await googleCalendarRepository.updateEvent(
            "primary",
            project.calendarEventId,
            event
          );
        } else {
          // Create new event
          const createdEvent = await googleCalendarRepository.createEvent(
            "primary",
            event
          );
          project.calendarEventId = createdEvent.id;
        }
      }

      syncSuccess([], projects);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      syncError(errorMessage);
      throw error;
    }
  };

  return {
    getState,
    startSync,
    syncSuccess,
    syncError,
    resetSync,
    syncTasks,
    syncProjects,
    deleteTaskEvent,
    deleteProjectEvent,
    updateTaskEvent,
    updateProjectEvent,
  };
};
