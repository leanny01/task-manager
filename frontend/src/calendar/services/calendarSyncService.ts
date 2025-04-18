import { Task } from "../../task/types/task";
import { Project } from "../../project/types/project";
import { createCalendarRepository } from "../repositories/calendarRepository";

const repository = createCalendarRepository();

export const calendarSyncService = {
  syncTasks: async (tasks: Task[]): Promise<void> => {
    try {
      await repository.syncTasks(tasks);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      repository.syncError(errorMessage);
      throw error;
    }
  },

  syncProjects: async (projects: Project[]): Promise<void> => {
    try {
      await repository.syncProjects(projects);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      repository.syncError(errorMessage);
      throw error;
    }
  },

  deleteTaskEvent: async (task: Task): Promise<void> => {
    try {
      if (task.calendarEventId) {
        await repository.deleteTaskEvent(task);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      repository.syncError(errorMessage);
      throw error;
    }
  },

  deleteProjectEvent: async (project: Project): Promise<void> => {
    try {
      if (project.calendarEventId) {
        await repository.deleteProjectEvent(project);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      repository.syncError(errorMessage);
      throw error;
    }
  },

  updateTaskEvent: async (task: Task): Promise<void> => {
    try {
      if (task.calendarEventId) {
        await repository.updateTaskEvent(task);
      } else {
        await repository.syncTasks([task]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      repository.syncError(errorMessage);
      throw error;
    }
  },

  updateProjectEvent: async (project: Project): Promise<void> => {
    try {
      if (project.calendarEventId) {
        await repository.updateProjectEvent(project);
      } else {
        await repository.syncProjects([project]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      repository.syncError(errorMessage);
      throw error;
    }
  },

  getState: () => repository.getState(),
  resetSync: () => repository.resetSync(),
};
