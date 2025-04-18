import { Task } from "../../task/types/task";
import { Project } from "../../project/types/project";

export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface CalendarState {
  status: SyncStatus;
  lastSyncTime: string | null;
  error: string | null;
  syncedItems: {
    tasks: string[];
    projects: string[];
  };
}

export interface CalendarRepository {
  getState: () => CalendarState;
  startSync: () => void;
  syncSuccess: (tasks: Task[], projects: Project[]) => void;
  syncError: (error: string) => void;
  resetSync: () => void;
  syncTasks: (tasks: Task[]) => Promise<void>;
  syncProjects: (projects: Project[]) => Promise<void>;
  deleteTaskEvent: (task: Task) => Promise<void>;
  deleteProjectEvent: (project: Project) => Promise<void>;
  updateTaskEvent: (task: Task) => Promise<void>;
  updateProjectEvent: (project: Project) => Promise<void>;
}
