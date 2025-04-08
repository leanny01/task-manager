import { Task, CreateTaskInput } from "../types/task";

class TaskService {
  private readonly STORAGE_KEY = "tasks";

  private getTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  async getAll(): Promise<Task[]> {
    return this.getTasks();
  }

  async create(task: CreateTaskInput): Promise<Task> {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saveTasks([...tasks, newTask]);
    return newTask;
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");

    const updatedTask = {
      ...tasks[index],
      ...task,
      updatedAt: new Date(),
    };

    tasks[index] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const tasks = this.getTasks();
    this.saveTasks(tasks.filter((t) => t.id !== id));
  }

  async toggleCompletion(id: string): Promise<Task> {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error("Task not found");

    return this.update(id, { completed: !task.completed });
  }
}

export const taskService = new TaskService();
