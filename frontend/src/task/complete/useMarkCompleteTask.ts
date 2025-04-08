import { useState } from "react";
import { taskService } from "../services/taskService";

export const useMarkCompleteTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markComplete = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      return taskService.markComplete(id);
    } catch (err) {
      setError("Failed to mark task as complete");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    markComplete,
    isLoading,
    error,
  };
};
