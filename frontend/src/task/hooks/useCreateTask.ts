import { useState } from "react";
import { Task, CreateTaskInput } from "../types/task";
import { taskService } from "../services/taskService";
import { useTaskList } from "../context/TaskListContext";

export function useCreateTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateTaskList } = useTaskList();

  const createTask = async (input: CreateTaskInput): Promise<Task> => {
    try {
      setIsLoading(true);
      setError(null);
      const newTask = await taskService.create(input);
      await updateTaskList(); // Refresh the task list
      return newTask;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create task";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTask,
    isLoading,
    error,
  };
}
