import { Task } from "./task";

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: string[];
}

export interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
}
