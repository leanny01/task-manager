import { useState } from "react";
import { Project, UpdateProjectInput } from "../types/project";
import { projectService } from "../services/projectService";

export function useEditProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editProject = async (
    id: string,
    updates: UpdateProjectInput
  ): Promise<Project> => {
    try {
      setIsLoading(true);
      setError(null);
      const project = await projectService.update(id, updates);
      return project;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update project";
      setError(errorMessage);
      throw new Error(errorMessage);
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
