import { useState, useEffect } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";

export const useFetchTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const loadedTasks = await taskService.getAll(); // TODO: add loading indicator
        setTasks(loadedTasks);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return {
    tasks,
    isLoading,
    error,
  };
};
