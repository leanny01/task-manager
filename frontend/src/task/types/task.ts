import { TaskStatus, TaskPriority } from "./enums";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface TaskMeta {
  id: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  archivedAt?: string;
  version: number;
  projectId?: string;
  tags?: string[];
}

export interface TaskBase {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  fromDate?: string;
  toDate?: string;
  completedAt?: string;
  projectId?: string;
  projectName?: string;
  calendarEventId?: string;
}

export type Task = TaskBase;

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  fromDate?: string;
  toDate?: string;
  projectId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  fromDate?: string;
  toDate?: string;
  completedAt?: string;
  projectId?: string;
}

export interface ListItemData extends TaskBase {
  subtitle?: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}
