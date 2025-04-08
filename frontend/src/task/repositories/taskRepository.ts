import { Task } from "../types/task";
import { storageService } from "./storageService";
import { taskSerializer } from "./serializer";

const STORAGE_KEY = "tasks";

export const taskRepository = {
  getAll: (): Task[] => {
    const tasksJson = storageService.get(STORAGE_KEY);
    if (!tasksJson) return [];
    return taskSerializer.deserialize(tasksJson);
  },

  save: (tasks: Task[]): void => {
    const tasksJson = taskSerializer.serialize(tasks);
    storageService.set(STORAGE_KEY, tasksJson);
  },
};
