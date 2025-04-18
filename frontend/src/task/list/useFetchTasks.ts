import { useState, useEffect } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";

export const useFetchTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loadedTasks = taskService.getAll(); // TODO: add loading indicator
      setTasks(loadedTasks);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
  };
};
