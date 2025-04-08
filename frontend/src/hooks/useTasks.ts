import { useState, useEffect } from "react";
import { Task, CreateTaskInput } from "../domains/task/types/task";
import { taskService } from "../domains/task/services/task";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const loadedTasks = await taskService.getAll();
      setTasks(loadedTasks);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: CreateTaskInput): Promise<Task> => {
    try {
      const newTask = await taskService.create(task);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError("Failed to add task");
      throw err;
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const updatedTask = await taskService.toggleCompletion(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError("Failed to update task");
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError("Failed to delete task");
      throw err;
    }
  };

  const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
    try {
      const updatedTask = await taskService.update(id, task);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      setError("Failed to update task");
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
  };
};
