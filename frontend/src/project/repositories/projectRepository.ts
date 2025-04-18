import {
  Project,
  ProjectStatus,
  ProjectPriority,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project";
import { v4 as uuidv4 } from "uuid";

class ProjectRepository {
  private readonly storageKey = "projects";

  getAll(): Project[] {
    const projectsJson = localStorage.getItem(this.storageKey);
    return projectsJson ? JSON.parse(projectsJson) : [];
  }

  save(projects: Project[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  async getById(id: string): Promise<Project | null> {
    const projects = this.getAll();
    return projects.find((project) => project.id === id) || null;
  }

  async create(
    data: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    const projects = this.getAll();
    const newProject: Project = {
      ...data,
      id: uuidv4(),
      taskIds: data.taskIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    this.save(projects);
    return newProject;
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const projects = this.getAll();
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) throw new Error(`Project with id ${id} not found`);

    const updatedProject = {
      ...projects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    projects[index] = updatedProject;
    this.save(projects);
    return updatedProject;
  }

  async delete(id: string): Promise<void> {
    const projects = this.getAll();
    const filteredProjects = projects.filter((project) => project.id !== id);
    this.save(filteredProjects);
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
}

export const projectRepository = new ProjectRepository();
