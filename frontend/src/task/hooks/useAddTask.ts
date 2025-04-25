import { useState } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";

export function useAddTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTask = async (task: Task): Promise<Task> => {
    try {
      setIsLoading(true);
      setError(null);
      const newTask = await taskService.create(task);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { addTask, isLoading, error };
}
