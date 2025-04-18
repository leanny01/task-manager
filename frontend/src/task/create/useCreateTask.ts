import { useState } from "react";
import { Task, CreateTaskInput } from "../types/task";
import { taskService } from "../services/taskService";
import { useCalendar } from "../../calendar/context/CalendarContext";

export const useCreateTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { syncTasks, updateTaskEvent } = useCalendar();
  const createTask = async (input: CreateTaskInput): Promise<Task> => {
    setIsLoading(true);
    setError(null);

    try {
      const newTask = await taskService.create(input);
      await updateTaskEvent(newTask);
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
