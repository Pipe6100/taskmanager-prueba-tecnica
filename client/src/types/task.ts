export type TaskStatus = "Pending" | "InProgress" | "Completed";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  projectId: number;
  projectName: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  projectId: number;
}

export interface UpdateTaskInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: TaskStatus;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

export interface TaskQueryParameters {
  projectId?: number;
  status?: TaskStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}