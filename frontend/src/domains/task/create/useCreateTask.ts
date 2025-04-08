import { useState } from "react";
import { Task, CreateTaskInput } from "../types/task";
import { taskService } from "../services/taskService";

export const useCreateTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = async (input: CreateTaskInput): Promise<Task> => {
    setIsLoading(true);
    setError(null);

    try {
      const newTask = taskService.addTask(input);
      return newTask;
    } catch (err) {
      setError("Failed to create task");
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
};
