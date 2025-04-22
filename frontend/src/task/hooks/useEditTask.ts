import { useState } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";

export function useEditTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTask = async (
    taskId: string,
    updates: Partial<Task>
  ): Promise<Task> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedTask = await taskService.update(taskId, updates);
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to edit task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { editTask, isLoading, error };
}
