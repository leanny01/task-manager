import { useState, useEffect } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";

export const useTasksByDate = (date: Date) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedTasks = taskService.getByDate(date);
      setTasks(loadedTasks);
    } catch (err) {
      setError("Failed to load tasks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [date]);

  return {
    tasks,
    isLoading,
    error,
    loadTasks,
  };
};
