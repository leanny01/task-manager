import {
  Project,
  ProjectStatus,
  ProjectPriority,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectBase,
} from "../types/project";
import { v4 as uuidv4 } from "uuid";
import { taskRepository } from "../../task/repositories/taskRepository";
import { Task } from "../../task/types/task";

class ProjectRepository {
  private readonly storageKey = "projects";

  private transformTasks(project: ProjectBase): Project {
    const tasks = taskRepository.getAll();
    return {
      ...project,
      tasks: project.taskIds
        .map((id) => tasks.find((task) => task.id === id))
        .filter(Boolean) as Task[],
    };
  }

  private getAllBase(): ProjectBase[] {
    const projectsJson = localStorage.getItem(this.storageKey);
    return projectsJson ? JSON.parse(projectsJson) : [];
  }

  getAll(): Project[] {
    const projects = this.getAllBase();
    return projects.map(this.transformTasks);
  }

  save(projects: ProjectBase[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  getById(id: string): Project | null {
    const projects = this.getAllBase();
    const project = projects.find((p) => p.id === id);
    return project ? this.transformTasks(project) : null;
  }

  update(id: string, updates: UpdateProjectInput): ProjectBase {
    const projects = this.getAllBase();
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
    const projects = this.getAllBase();
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
    const projects = this.getAllBase();
    const filteredProjects = projects.filter((p) => p.id !== id);
    this.save(filteredProjects);
  }

  async addTaskToProject(
    projectId: string,
    taskId: string
  ): Promise<ProjectBase> {
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
  ): Promise<ProjectBase> {
    const project = await this.getById(projectId);
    if (!project) throw new Error(`Project with id ${projectId} not found`);

    project.taskIds = project.taskIds.filter((id) => id !== taskId);
    return await this.update(projectId, { taskIds: project.taskIds });
  }
}

export const projectRepository = new ProjectRepository();
