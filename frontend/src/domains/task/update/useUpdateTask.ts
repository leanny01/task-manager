import { useState } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";

export const useUpdateTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = async (task: Task): Promise<Task> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTask = taskService.updateTask(task);
      return updatedTask;
    } catch (err) {
      setError("Failed to update task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateTask,
    isLoading,
    error,
  };
};
