import { Task, CreateTaskInput } from "../types/task";

// Storage key for localStorage
const STORAGE_KEY = "data.tasks";

// Helper function to parse dates from JSON
const parseDates = (task: any): Task => ({
  ...task,
  createdAt: new Date(task.createdAt),
  updatedAt: new Date(task.updatedAt),
  dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
});

export const getTasks = async (): Promise<Task[]> => {
  try {
    const tasks = localStorage.getItem(STORAGE_KEY);
    if (tasks) {
      const parsedTasks = JSON.parse(tasks);
      return parsedTasks.map(parseDates);
    }
  } catch (error) {
    console.error("Failed to get tasks:", error);
  }
  return [];
};

export const addTask = async (taskInput: CreateTaskInput): Promise<Task> => {
  try {
    const tasks = await getTasks();
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskInput,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  } catch (error) {
    console.error("Failed to add task:", error);
    throw new Error("Failed to add task");
  }
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Omit<Task, "id" | "createdAt">>
): Promise<Task> => {
  try {
    const tasks = await getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date(),
    };

    tasks[index] = updatedTask;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return updatedTask;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw new Error("Failed to update task");
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const tasks = await getTasks();
    const filteredTasks = tasks.filter((t) => t.id !== taskId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw new Error("Failed to delete task");
  }
};

export const toggleTaskCompletion = async (taskId: string): Promise<Task> => {
  try {
    const tasks = await getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = {
      ...tasks[index],
      completed: !tasks[index].completed,
      updatedAt: new Date(),
    };

    tasks[index] = updatedTask;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return updatedTask;
  } catch (error) {
    console.error("Failed to toggle task completion:", error);
    throw new Error("Failed to toggle task completion");
  }
};
