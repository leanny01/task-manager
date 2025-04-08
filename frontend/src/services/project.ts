import { Project } from "../types/project";

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projects = localStorage.getItem("data.projects");
    return projects ? JSON.parse(projects) : [];
  } catch (error) {
    console.error("Error getting projects", error);
    return [];
  }
};

export const addProject = async (project: Project): Promise<Project[]> => {
  try {
    const projects = await getProjects();
    projects.push(project);
    localStorage.setItem("data.projects", JSON.stringify(projects));
    return projects;
  } catch (error) {
    console.error("Error adding project", error);
    return [];
  }
};

export const updateProject = async (project: Project): Promise<Project[]> => {
  try {
    const projects = await getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    projects[index] = project;
    localStorage.setItem("data.projects", JSON.stringify(projects));
    return projects;
  } catch (error) {
    console.error("Error updating project", error);
    return [];
  }
};

export const deleteProject = async (id: string): Promise<Project[]> => {
  try {
    const projects = await getProjects();
    const index = projects.findIndex((p) => p.id === id);
    projects.splice(index, 1);
    localStorage.setItem("data.projects", JSON.stringify(projects));
    return projects;
  } catch (error) {
    console.error("Error deleting project", error);
    return [];
  }
};

export const linkTaskToProject = async (
  projectId: string,
  taskId: string
): Promise<Project[]> => {
  try {
    const projects = await getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      project.tasks.push(taskId);
    }
    localStorage.setItem("data.projects", JSON.stringify(projects));
    return projects;
  } catch (error) {
    console.error("Error linking task to project", error);
    return [];
  }
};

export const unlinkTaskFromProject = async (
  projectId: string,
  taskId: string
): Promise<Project[]> => {
  try {
    const projects = await getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      project.tasks = project.tasks.filter((id) => id !== taskId);
    }
    localStorage.setItem("data.projects", JSON.stringify(projects));
    return projects;
  } catch (error) {
    console.error("Error unlinking task from project", error);
    return [];
  }
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) || null;
};
