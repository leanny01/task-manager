import { Task, TaskStatus } from "../../task/types/task";

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export enum ProjectPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  taskIds: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  dueDate?: string;
  calendarEventId?: string;
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  priority?: ProjectPriority;
  dueDate?: string;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  dueDate?: string;
}

export interface ConvertTaskToProjectInput {
  taskId: string;
  projectTitle?: string;
  projectDescription?: string;
  projectPriority?: ProjectPriority;
  projectDueDate?: string;
}
