export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  completed?: boolean;
}

export interface Task extends CreateTaskInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
