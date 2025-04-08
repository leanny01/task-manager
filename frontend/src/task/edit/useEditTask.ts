import { useState } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/task";

export const useEditTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTask = async (id: string, task: Partial<Task>): Promise<Task> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTask = await taskService.update(id, task);
      return updatedTask;
    } catch (err) {
      setError("Failed to update task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editTask,
    isLoading,
    error,
  };
};
