import { useState } from "react";
import { Project } from "../types/project";
import { projectService } from "../services/projectService";

export function useEditProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editProject = async (
    id: string,
    updates: Partial<Project>
  ): Promise<Project> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedProject = await projectService.update(id, updates);
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editProject,
    isLoading,
    error,
  };
}
