import { Task } from "../types/task";

export const taskSerializer = {
  serialize: (tasks: Task[]): string => {
    try {
      return JSON.stringify(tasks);
    } catch (error) {
      console.error("Error serializing tasks:", error);
      return "[]";
    }
  },

  deserialize: (json: string): Task[] => {
    try {
      const tasks = JSON.parse(json);
      return tasks.map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      console.error("Error deserializing tasks:", error);
      return [];
    }
  },
};
