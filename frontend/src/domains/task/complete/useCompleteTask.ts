import { useState } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";

export const useCompleteTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeTask = async (id: string): Promise<Task> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTask = taskService.toggleTaskCompletion(id);
      return updatedTask;
    } catch (err) {
      setError("Failed to complete task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    completeTask,
    isLoading,
    error,
  };
};
