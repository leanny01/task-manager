import { useState } from "react";
import { taskService } from "../services/taskService";

export const useDeleteTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      taskService.delete(id);
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
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
