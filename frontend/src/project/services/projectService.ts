import {
  Project,
  ProjectBase,
  ProjectStatus,
  ProjectPriority,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project";
import { v4 as uuidv4 } from "uuid";
import { taskService } from "../../task/services/taskService";
import { Task, CreateTaskInput } from "../../task/types/task";
import { TaskPriority, TaskStatus } from "../../task/types/enums";
import { projectRepository } from "../repositories/projectRepository";

export class ProjectService {
  private storageKey = "projects";

  async getAll(): Promise<ProjectBase[]> {
    try {
      return projectRepository.getAll();
    } catch (error) {
      throw new Error("Failed to fetch projects");
    }
  }

  async getById(id: string): Promise<ProjectBase> {
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

  async getTasksForProject(projectId: string): Promise<Task[]> {
    try {
      const project = await this.getById(projectId);
      const allTasks = await taskService.getAll();
      return project.taskIds
        .map((taskId) => allTasks.find((task) => task.id === taskId))
        .filter((task): task is Task => task !== undefined);
    } catch (error) {
      throw new Error("Failed to fetch project tasks");
    }
  }

  async getTasksForProjects(
    projectIds: string[]
  ): Promise<Record<string, Task[]>> {
    try {
      const allTasks = await taskService.getAll();
      const projects = await this.getAll();
      const result: Record<string, Task[]> = {};

      for (const projectId of projectIds) {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          result[projectId] = project.taskIds
            .map((taskId) => allTasks.find((task) => task.id === taskId))
            .filter((task): task is Task => task !== undefined);
        }
      }

      return result;
    } catch (error) {
      throw new Error("Failed to fetch projects tasks");
    }
  }

  async create(input: CreateProjectInput): Promise<ProjectBase> {
    try {
      const projects = projectRepository.getAll();
      const newProject: ProjectBase = {
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

  async update(id: string, updates: UpdateProjectInput): Promise<ProjectBase> {
    try {
      const projects = projectRepository.getAll();
      const projectIndex = projects.findIndex((p) => p.id === id);

      if (projectIndex === -1) {
        throw new Error(`Project with id ${id} not found`);
      }

      const updatedProject: ProjectBase = {
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

  async addTask(projectId: string, taskId: string): Promise<ProjectBase> {
    const project = await this.getById(projectId);
    return this.update(projectId, {
      taskIds: [...project.taskIds, taskId],
    });
  }

  async removeTask(projectId: string, taskId: string): Promise<ProjectBase> {
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

  async promoteTaskToProject(task: Task): Promise<ProjectBase> {
    try {
      // Create a new project from the task
      const newProject = await this.create({
        title: task.title,
        description: task.description,
        priority: this.mapTaskPriorityToProjectPriority(task.priority),
        dueDate: task.toDate,
      });

      // If the task is already in a project, remove it from that project first
      if (task.projectId) {
        await this.removeTask(task.projectId, task.id);
      }

      // Add the task to the new project
      await this.addTask(newProject.id, task.id);

      return newProject;
    } catch (error) {
      console.error("Error promoting task to project:", error);
      throw new Error("Failed to promote task to project");
    }
  }

  async addTaskToProject(
    projectId: string,
    taskInput: CreateTaskInput
  ): Promise<Project> {
    try {
      const task = await taskService.create(taskInput);
      const project = await projectRepository.addTaskToProject(
        projectId,
        task.id
      );
      return projectRepository.getById(projectId) as Project;
    } catch (error) {
      throw new Error("Failed to add task to project");
    }
  }
}

export const projectService = new ProjectService();
