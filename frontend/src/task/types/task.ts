import { TaskStatus, TaskPriority } from "./enums";

export interface TaskBase {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  fromDate?: string;
  toDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type Task = TaskBase;

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  projectId?: string;
  fromDate?: string;
  toDate?: string;
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
