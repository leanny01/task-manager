import { Task, CreateTaskInput } from "../types/task";

const STORAGE_KEY = "tasks";

export const taskService = {
  getAllTasks: (): Task[] => {
    const tasksJson = localStorage.getItem(STORAGE_KEY);
    if (!tasksJson) return [];

    const tasks = JSON.parse(tasksJson);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  },

  addTask: (input: CreateTaskInput): Task => {
    const tasks = taskService.getAllTasks();
    const newTask: Task = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...tasks, newTask]));
    return newTask;
  },

  updateTask: (task: Task): Task => {
    const tasks = taskService.getAllTasks();
    const updatedTask = {
      ...task,
      updatedAt: new Date(),
    };

    const updatedTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    return updatedTask;
  },

  deleteTask: (id: string): void => {
    const tasks = taskService.getAllTasks();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
  },

  toggleTaskCompletion: (id: string): Task => {
    const tasks = taskService.getAllTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error("Task not found");

    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date(),
    };

    const updatedTasks = tasks.map((t) => (t.id === id ? updatedTask : t));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    return updatedTask;
  },
};
