import { Task, CreateTaskInput } from "../types/task";
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

  getByDate: (date: Date): Task[] => {
    const tasks = taskRepository.getAll();
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
  },

  getCompleted: (): Task[] => {
    const tasks = taskRepository.getAll();
    return tasks.filter((task) => task.completed);
  },

  getPending: (): Task[] => {
    const tasks = taskRepository.getAll();
    return tasks.filter((task) => !task.completed);
  },

  // Command methods
  create: (input: CreateTaskInput): Task => {
    const newTask: Task = {
      id: uuidv4(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
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

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
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
    return taskService.update(id, { completed: true });
  },

  markIncomplete: (id: string): Task => {
    return taskService.update(id, { completed: false });
  },

  toggleComplete: (id: string): Task => {
    const tasks = taskRepository.getAll();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      throw new Error("Task not found");
    }

    return task.completed
      ? taskService.markIncomplete(id)
      : taskService.markComplete(id);
  },
};
