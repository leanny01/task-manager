export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
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
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  fromDate?: string;
  toDate?: string;
}

export interface Task extends TaskBase, TaskMeta {}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  fromDate?: string;
  toDate?: string;
  status?: TaskStatus;
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
