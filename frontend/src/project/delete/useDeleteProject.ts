import { useState } from "react";
import { projectService } from "../services/projectService";

export function useDeleteProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProject = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await projectService.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteProject,
    isLoading,
    error,
  };
}
