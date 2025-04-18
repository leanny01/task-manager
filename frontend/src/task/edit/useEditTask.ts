import { useState } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";
import { useCalendar } from "../../calendar/context/CalendarContext";
import { toast } from "react-toastify";
export const useEditTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateTaskEvent } = useCalendar();

  const editTask = async (id: string, task: Partial<Task>): Promise<Task> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTask = await taskService.update(id, task);
      await updateTaskEvent(updatedTask);
      toast.success("Task updated successfully");
      return updatedTask;
    } catch (err) {
      setError("Failed to update task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editTask,
    isLoading,
    error,
  };
};
