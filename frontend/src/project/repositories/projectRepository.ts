import {
  Project,
  ProjectStatus,
  ProjectPriority,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectBase,
} from "../types/project";
import { v4 as uuidv4 } from "uuid";

class ProjectRepository {
  private readonly storageKey = "projects";

  getAll(): ProjectBase[] {
    const projectsJson = localStorage.getItem(this.storageKey);
    return projectsJson ? JSON.parse(projectsJson) : [];
  }

  save(projects: ProjectBase[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  getById(id: string): ProjectBase | null {
    const projects = this.getAll();
    return projects.find((p) => p.id === id) || null;
  }

  update(id: string, updates: UpdateProjectInput): ProjectBase {
    const projects = this.getAll();
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
    this.save(projects);
    return updatedProject;
  }

  create(input: CreateProjectInput): ProjectBase {
    const projects = this.getAll();
    const newProject: ProjectBase = {
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

    this.save([...projects, newProject]);
    return newProject;
  }

  delete(id: string): void {
    const projects = this.getAll();
    const filteredProjects = projects.filter((p) => p.id !== id);
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
