export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum TaskStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export interface TaskMeta {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  archivedAt?: Date;
  version: number;
  projectId?: string;
  tags?: string[];
}

export interface TaskBase {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
}

export interface CreateTaskInput extends Omit<TaskBase, "status"> {
  status?: TaskStatus;
}

export interface Task extends TaskBase, TaskMeta {}
