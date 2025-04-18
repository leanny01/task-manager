import { Task, CreateTaskInput, TaskStatus } from "../types/task";
import { taskRepository } from "../repositories/taskRepository";
import { v4 as uuidv4 } from "uuid";

// Query methods
export const taskService = {
  getAll: (): Task[] => {
    return taskRepository.getAll();
  },

  getById: (id: string): Task | undefined => {
    const tasks = taskRepository.getAll();
    return tasks.find((task) => task.id === id);
  },

  getByStatus: (status: TaskStatus): Task[] => {
    const tasks = taskRepository.getAll();
    return tasks.filter((task) => task.status === status);
  },

  getByDate: (date: Date): Task[] => {
    const tasks = taskRepository.getAll();
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
  },

  getCompleted: (): Task[] => {
    const tasks = taskRepository.getAll();
    return tasks.filter((task) => task.status === TaskStatus.COMPLETED);
  },

  getPending: (): Task[] => {
    const tasks = taskRepository.getAll();
    return tasks.filter((task) => task.status === TaskStatus.PENDING);
  },

  // Command methods
  create: (input: CreateTaskInput): Task => {
    const newTask: Task = {
      id: uuidv4(),
      ...input,
      status: input.status || TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    const tasks = taskRepository.getAll();
    taskRepository.save([...tasks, newTask]);
    return newTask;
  },

  update: (id: string, updates: Partial<Task>): Task => {
    const tasks = taskRepository.getAll();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const currentTask = tasks[taskIndex];
    const updatedTask = {
      ...currentTask,
      ...updates,
      updatedAt: new Date(),
      version: currentTask.version + 1,
      completedAt:
        updates.status === TaskStatus.COMPLETED
          ? new Date()
          : currentTask.completedAt,
      archivedAt:
        updates.status === TaskStatus.ARCHIVED
          ? new Date()
          : currentTask.archivedAt,
    };

    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;
    taskRepository.save(newTasks);

    return updatedTask;
  },

  delete: (id: string): void => {
    const tasks = taskRepository.getAll();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    taskRepository.save(filteredTasks);
  },

  markComplete: (id: string): Task => {
    return taskService.update(id, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date(),
    });
  },

  markIncomplete: (id: string): Task => {
    return taskService.update(id, {
      status: TaskStatus.PENDING,
      completedAt: undefined,
    });
  },

  archive: (id: string): Task => {
    return taskService.update(id, {
      status: TaskStatus.ARCHIVED,
      archivedAt: new Date(),
    });
  },

  toggleComplete: (id: string): Task => {
    const tasks = taskRepository.getAll();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      throw new Error("Task not found");
    }

    return task.status === TaskStatus.COMPLETED
      ? taskService.markIncomplete(id)
      : taskService.markComplete(id);
  },
};
