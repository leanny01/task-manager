import { useState } from "react";
import { taskService } from "../services/taskService";
import { useCalendar } from "../../calendar/context/CalendarContext";
import { Task } from "../types/task";
export const useDeleteTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deleteTaskEvent } = useCalendar();
  const deleteTask = async (task: Task) => {
    try {
      setIsLoading(true);
      setError(null);
      await taskService.delete(task.id);
      await deleteTaskEvent(task);
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteTask,
    isLoading,
    error,
  };
};
