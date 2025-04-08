import { useState, useCallback, useEffect } from "react";
import { Task, CreateTaskInput } from "../types/task";
import * as taskService from "../services/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on initial render
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const data = await taskService.getTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        setError("Failed to load tasks");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = useCallback(async (input: CreateTaskInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const newTask = await taskService.addTask(input);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(taskId);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }, []);

  const updateTask = useCallback(
    async (
      taskId: string,
      updates: Partial<Omit<Task, "id" | "createdAt">>
    ) => {
      try {
        const updatedTask = await taskService.updateTask(taskId, updates);
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task");
      }
    },
    []
  );

  return {
    tasks,
    isLoading,
    error,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
  };
}
