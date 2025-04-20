import { useState } from "react";
import { Project, CreateProjectInput } from "../types/project";
import { projectService } from "../services/projectService";

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (input: CreateProjectInput): Promise<Project> => {
    try {
      setIsLoading(true);
      setError(null);
      const project = await projectService.create(input);
      return project;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create project";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProject,
    isLoading,
    error,
  };
}
