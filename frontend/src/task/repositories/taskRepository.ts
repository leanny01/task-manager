import { Task } from "../types/task";

const STORAGE_KEY = "tasks";

export const taskRepository = {
  getAll: (): Task[] => {
    const tasksJson = localStorage.getItem(STORAGE_KEY);
    if (!tasksJson) return [];

    try {
      const tasks = JSON.parse(tasksJson);
      return tasks.map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      console.error("Error parsing tasks from storage:", error);
      return [];
    }
  },

  save: (tasks: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to storage:", error);
    }
  },
};
