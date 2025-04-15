import {
  Project,
  ProjectStatus,
  ProjectPriority,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project";
import { v4 as uuidv4 } from "uuid";

export class ProjectRepository {
  private readonly STORAGE_KEY = "projects";

  async getAll(): Promise<Project[]> {
    const projectsJson = localStorage.getItem(this.STORAGE_KEY);
    if (!projectsJson) return [];
    return JSON.parse(projectsJson);
  }

  async getById(id: string): Promise<Project | null> {
    const projects = await this.getAll();
    return projects.find((project) => project.id === id) || null;
  }

  async create(
    data: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    const projects = await this.getAll();
    const newProject: Project = {
      ...data,
      id: uuidv4(),
      taskIds: data.taskIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    await this.saveAll(projects);
    return newProject;
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const projects = await this.getAll();
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) throw new Error(`Project with id ${id} not found`);

    const updatedProject = {
      ...projects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    projects[index] = updatedProject;
    await this.saveAll(projects);
    return updatedProject;
  }

  async delete(id: string): Promise<void> {
    const projects = await this.getAll();
    const filteredProjects = projects.filter((project) => project.id !== id);
    await this.saveAll(filteredProjects);
  }

  async addTaskToProject(projectId: string, taskId: string): Promise<Project> {
    const project = await this.getById(projectId);
    if (!project) throw new Error(`Project with id ${projectId} not found`);

    if (!project.taskIds.includes(taskId)) {
      project.taskIds.push(taskId);
      return await this.update(projectId, { taskIds: project.taskIds });
    }
    return project;
  }

  async removeTaskFromProject(
    projectId: string,
    taskId: string
  ): Promise<Project> {
    const project = await this.getById(projectId);
    if (!project) throw new Error(`Project with id ${projectId} not found`);

    project.taskIds = project.taskIds.filter((id) => id !== taskId);
    return await this.update(projectId, { taskIds: project.taskIds });
  }

  private async saveAll(projects: Project[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
}
