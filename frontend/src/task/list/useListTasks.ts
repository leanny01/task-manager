import { useState, useEffect } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/task";

export const useListTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedTasks = await taskService.getAll();
      setTasks(loadedTasks);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tasks,
    isLoading,
    error,
    loadTasks,
  };
};
