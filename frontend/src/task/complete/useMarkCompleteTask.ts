import { useState } from "react";
import { taskService } from "../services/taskService";
import { calendarSyncService } from "../../calendar/services/calendarSyncService";
import { useCalendar } from "../../calendar/context/CalendarContext";
export const useMarkCompleteTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateTaskEvent } = useCalendar();

  const markComplete = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const task = await taskService.markComplete(id);
      await updateTaskEvent(task);
    } catch (err) {
      setError("Failed to mark task as complete");
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
};
