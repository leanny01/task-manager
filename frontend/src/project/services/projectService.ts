import {
  Project,
  ProjectStatus,
  ProjectPriority,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project";
import { v4 as uuidv4 } from "uuid";
import { taskService } from "../../task/services/taskService";
import { Task, TaskPriority } from "../../task/types/task";

export class ProjectService {
  private storageKey = "projects";

  async getAll(): Promise<Project[]> {
    try {
      const projectsJson = localStorage.getItem(this.storageKey);
      return projectsJson ? JSON.parse(projectsJson) : [];
    } catch (error) {
      console.error("Error getting projects:", error);
      throw new Error("Failed to get projects");
    }
  }

  async getById(id: string): Promise<Project | null> {
    try {
      const projects = await this.getAll();
      return projects.find((project) => project.id === id) || null;
    } catch (error) {
      console.error("Error getting project:", error);
      throw new Error("Failed to get project");
    }
  }

  async create(input: CreateProjectInput): Promise<Project> {
    try {
      const projects = await this.getAll();
      const newProject: Project = {
        id: uuidv4(),
        title: input.title,
        description: input.description,
        status: ProjectStatus.ACTIVE,
        priority: input.priority || ProjectPriority.MEDIUM,
        taskIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: input.dueDate,
      };

      projects.push(newProject);
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    try {
      const projects = await this.getAll();
      const projectIndex = projects.findIndex((project) => project.id === id);

      if (projectIndex === -1) {
        throw new Error("Project not found");
      }

      const updatedProject = {
        ...projects[projectIndex],
        ...input,
        updatedAt: new Date().toISOString(),
      };

      if (
        input.status === ProjectStatus.COMPLETED &&
        !updatedProject.completedAt
      ) {
        updatedProject.completedAt = new Date().toISOString();
      }

      projects[projectIndex] = updatedProject;
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return updatedProject;
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error("Failed to update project");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const projects = await this.getAll();
      const project = projects.find((p) => p.id === id);

      if (project) {
        // Update all associated tasks to remove project reference
        for (const taskId of project.taskIds) {
          try {
            await taskService.update(taskId, { projectId: undefined });
          } catch (error) {
            console.warn(
              `Failed to update task ${taskId} while deleting project`,
              error
            );
          }
        }
      }

      const filteredProjects = projects.filter((project) => project.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredProjects));
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }

  async addTask(projectId: string, taskId: string): Promise<Project> {
    try {
      const projects = await this.getAll();
      const projectIndex = projects.findIndex(
        (project) => project.id === projectId
      );

      if (projectIndex === -1) {
        throw new Error("Project not found");
      }

      if (!projects[projectIndex].taskIds.includes(taskId)) {
        // Update the task's projectId
        await taskService.update(taskId, { projectId });

        projects[projectIndex].taskIds.push(taskId);
        projects[projectIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
      }

      return projects[projectIndex];
    } catch (error) {
      console.error("Error adding task to project:", error);
      throw new Error("Failed to add task to project");
    }
  }

  async removeTask(projectId: string, taskId: string): Promise<Project> {
    try {
      const projects = await this.getAll();
      const projectIndex = projects.findIndex(
        (project) => project.id === projectId
      );

      if (projectIndex === -1) {
        throw new Error("Project not found");
      }

      // Remove project reference from task
      await taskService.update(taskId, { projectId: undefined });

      projects[projectIndex].taskIds = projects[projectIndex].taskIds.filter(
        (id) => id !== taskId
      );
      projects[projectIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(projects));

      return projects[projectIndex];
    } catch (error) {
      console.error("Error removing task from project:", error);
      throw new Error("Failed to remove task from project");
    }
  }

  private mapTaskPriorityToProjectPriority(
    taskPriority: TaskPriority
  ): ProjectPriority {
    switch (taskPriority) {
      case TaskPriority.HIGH:
        return ProjectPriority.HIGH;
      case TaskPriority.MEDIUM:
        return ProjectPriority.MEDIUM;
      case TaskPriority.LOW:
        return ProjectPriority.LOW;
      default:
        return ProjectPriority.MEDIUM;
    }
  }

  async promoteTaskToProject(task: Task): Promise<Project> {
    try {
      // Create a new project from the task
      const newProject = await this.create({
        title: task.title,
        description: task.description,
        priority: this.mapTaskPriorityToProjectPriority(task.priority),
        dueDate: task.toDate,
      });

      // Add the task to the project
      await this.addTask(newProject.id, task.id);

      return newProject;
    } catch (error) {
      console.error("Error promoting task to project:", error);
      throw new Error("Failed to promote task to project");
    }
  }
}

export const projectService = new ProjectService();
