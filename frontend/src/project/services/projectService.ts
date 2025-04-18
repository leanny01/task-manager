import {
  Project,
  ProjectStatus,
  ProjectPriority,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project";
import { v4 as uuidv4 } from "uuid";
import { taskService } from "../../task/services/taskService";
import { Task } from "../../task/types/task";
import { TaskPriority, TaskStatus } from "../../task/types/enums";
import { projectRepository } from "../repositories/projectRepository";

export class ProjectService {
  private storageKey = "projects";

  async getAll(): Promise<Project[]> {
    try {
      return projectRepository.getAll();
    } catch (error) {
      throw new Error("Failed to fetch projects");
    }
  }

  async getById(id: string): Promise<Project> {
    try {
      const projects = projectRepository.getAll();
      const project = projects.find((p) => p.id === id);
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (error) {
      throw new Error("Failed to fetch project");
    }
  }

  async create(input: CreateProjectInput): Promise<Project> {
    try {
      const projects = projectRepository.getAll();
      const newProject: Project = {
        id: uuidv4(),
        ...input,
        status: ProjectStatus.ACTIVE,
        priority: input.priority || ProjectPriority.MEDIUM,
        taskIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      projectRepository.save([...projects, newProject]);
      return newProject;
    } catch (error) {
      throw new Error("Failed to create project");
    }
  }

  async update(id: string, updates: UpdateProjectInput): Promise<Project> {
    try {
      const projects = projectRepository.getAll();
      const projectIndex = projects.findIndex((p) => p.id === id);

      if (projectIndex === -1) {
        throw new Error(`Project with id ${id} not found`);
      }

      const updatedProject: Project = {
        ...projects[projectIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      projects[projectIndex] = updatedProject;
      projectRepository.save(projects);
      return updatedProject;
    } catch (error) {
      throw new Error("Failed to update project");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const projects = projectRepository.getAll();
      const filteredProjects = projects.filter((p) => p.id !== id);

      if (filteredProjects.length === projects.length) {
        throw new Error(`Project with id ${id} not found`);
      }

      projectRepository.save(filteredProjects);
    } catch (error) {
      throw new Error("Failed to delete project");
    }
  }

  async addTask(projectId: string, taskId: string): Promise<Project> {
    const project = await this.getById(projectId);
    return this.update(projectId, {
      taskIds: [...project.taskIds, taskId],
    });
  }

  async removeTask(projectId: string, taskId: string): Promise<Project> {
    const project = await this.getById(projectId);
    return this.update(projectId, {
      taskIds: project.taskIds.filter((id) => id !== taskId),
    });
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
