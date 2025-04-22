import { useState } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";

export function useDeleteTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await taskService.delete(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteTask, isLoading, error };
}
