import { Task } from "../../task/types/task";

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

export interface ProjectBase {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  taskIds: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface Project extends ProjectBase {
  tasks?: Task[];
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
  taskIds?: string[];
  dueDate?: string;
  completedAt?: string;
}

export interface ConvertTaskToProjectInput {
  taskId: string;
  projectTitle?: string;
  projectDescription?: string;
  projectPriority?: ProjectPriority;
  projectDueDate?: string;
}
