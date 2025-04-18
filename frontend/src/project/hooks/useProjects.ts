import { useState, useEffect } from "react";
import { Project, ProjectPriority } from "../types/project";
import { Task } from "../../task/types/task";
import { projectService } from "../services/projectService";
import { taskService } from "../../task/services/taskService";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTasks, setProjectTasks] = useState<Record<string, Task[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjectsAndTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Load all projects
      const allProjects = await projectService.getAll();

      // Sort projects by priority
      const sortedProjects = [...allProjects].sort((a, b) => {
        const priorityOrder = {
          [ProjectPriority.HIGH]: 0,
          [ProjectPriority.MEDIUM]: 1,
          [ProjectPriority.LOW]: 2,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      setProjects(sortedProjects);

      // Load tasks for each project
      const tasksMap: Record<string, Task[]> = {};
      const allTasks = await taskService.getAll();

      for (const project of sortedProjects) {
        tasksMap[project.id] = allTasks.filter(
          (task) => task.projectId === project.id
        );
      }

      setProjectTasks(tasksMap);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load projects and tasks"
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
  };
}
