import { useState } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";
import { useCalendar } from "../../calendar/context/CalendarContext";

export function useMarkCompleteTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateTaskEvent } = useCalendar();

  const markComplete = async (id: string) => {
    try {
      console.log("markComplete", id);
      setIsLoading(true);
      setError(null);
      const task = await taskService.markComplete(id);
      await updateTaskEvent(task);
    } catch (err) {
      setError("Failed to toggle task completion");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    markComplete,
    isLoading,
    error,
  };
}
