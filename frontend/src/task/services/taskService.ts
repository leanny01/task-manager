import { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";
import { TaskStatus, TaskPriority } from "../types/enums";
import { taskRepository } from "../repositories/taskRepository";
import { v4 as uuidv4 } from "uuid";

class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;

  async getAll(): Promise<Task[]> {
    try {
      return taskRepository.getAll();
    } catch (error) {
      throw new Error("Failed to fetch tasks");
    }
  }

  async getById(id: string): Promise<Task> {
    try {
      const tasks = taskRepository.getAll();
      const task = tasks.find((t) => t.id === id);
      if (!task) {
        throw new Error("Task not found");
      }
      return task;
    } catch (error) {
      throw new Error("Failed to fetch task");
    }
  }

  async create(taskInput: CreateTaskInput): Promise<Task> {
    try {
      const tasks = taskRepository.getAll();
      const newTask: Task = {
        id: uuidv4(),
        ...taskInput,
        status: TaskStatus.PENDING,
        priority: taskInput.priority || TaskPriority.MEDIUM,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      taskRepository.save([...tasks, newTask]);
      return newTask;
    } catch (error) {
      throw new Error("Failed to create task");
    }
  }

  async update(id: string, updates: UpdateTaskInput): Promise<Task> {
    try {
      const tasks = taskRepository.getAll();
      const taskIndex = tasks.findIndex((t) => t.id === id);

      if (taskIndex === -1) {
        throw new Error(`Task with id ${id} not found`);
      }

      const updatedTask: Task = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      tasks[taskIndex] = updatedTask;
      taskRepository.save(tasks);
      return updatedTask;
    } catch (error) {
      throw new Error("Failed to update task");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const tasks = taskRepository.getAll();
      const filteredTasks = tasks.filter((t) => t.id !== id);

      if (filteredTasks.length === tasks.length) {
        throw new Error(`Task with id ${id} not found`);
      }

      taskRepository.save(filteredTasks);
    } catch (error) {
      throw new Error("Failed to delete task");
    }
  }

  async markComplete(id: string): Promise<Task> {
    return this.update(id, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date().toISOString(),
    });
  }

  async markInProgress(id: string): Promise<Task> {
    return this.update(id, {
      status: TaskStatus.IN_PROGRESS,
    });
  }

  // Helper method for testing
  async resetStorage(): Promise<void> {
    taskRepository.save([]);
  }
}

export const taskService = new TaskService();
