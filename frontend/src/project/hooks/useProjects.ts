import { useState, useEffect } from "react";
import { ProjectBase } from "../types/project";
import { Task } from "../../task/types/task";
import { projectService } from "../services/projectService";
import { taskService } from "../../task/services/taskService";
import { toast } from "react-toastify";

export function useProjects() {
  const [projects, setProjects] = useState<ProjectBase[]>([]);
  const [projectTasks, setProjectTasks] = useState<Record<string, Task[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjectsAndTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Load all projects
      const allProjects = await projectService.getAll();
      setProjects(allProjects);

      // Load tasks for all projects
      const tasksMap = await projectService.getTasksForProjects(
        allProjects.map((p) => p.id)
      );
      setProjectTasks(tasksMap);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load projects and tasks"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteToProject = async (task: Task): Promise<void> => {
    setIsLoading(true);
    try {
      await projectService.promoteTaskToProject(task);
      await loadProjectsAndTasks();
      toast.success("Task promoted to project");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to promote task to project"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsAndTasks();
  }, []);

  return {
    projects,
    projectTasks,
    isLoading,
    error,
    refresh: loadProjectsAndTasks,
    handlePromoteToProject,
  };
}
