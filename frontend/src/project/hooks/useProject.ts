import { useState, useEffect } from "react";
import { Project } from "../types/project";
import { projectService } from "../services/projectService";
import { CreateTaskInput } from "../../task/types/task";

export const useProject = (projectId?: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError("No project ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await projectService.getById(projectId);
        setProject(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch project"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const addTask = async (taskInput: CreateTaskInput) => {
    if (!projectId) {
      throw new Error("No project ID provided");
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedProject = await projectService.addTaskToProject(
        projectId,
        taskInput
      );
      setProject(updatedProject);
      return updatedProject;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add task";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { project, isLoading, error, addTask };
};
