import { useState } from "react";
import { taskService } from "../services/taskService";

export const useDeleteTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      taskService.deleteTask(id);
    } catch (err) {
      setError("Failed to delete task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteTask,
    isLoading,
    error,
  };
};
