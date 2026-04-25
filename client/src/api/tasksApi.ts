import apiClient from "./client";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  TaskQueryParameters,
  PagedResult,
} from "../types";

const RESOURCE = "/tasks";

export const tasksApi = {
  getAll: async (params?: TaskQueryParameters): Promise<PagedResult<Task>> => {
    const response = await apiClient.get<PagedResult<Task>>(RESOURCE, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`${RESOURCE}/${id}`);
    return response.data;
  },

  create: async (input: CreateTaskInput): Promise<Task> => {
    const response = await apiClient.post<Task>(RESOURCE, input);
    return response.data;
  },

  update: async (id: number, input: UpdateTaskInput): Promise<Task> => {
    const response = await apiClient.put<Task>(`${RESOURCE}/${id}`, input);
    return response.data;
  },

  updateStatus: async (
    id: number,
    input: UpdateTaskStatusInput
  ): Promise<Task> => {
    const response = await apiClient.patch<Task>(
      `${RESOURCE}/${id}/status`,
      input
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${RESOURCE}/${id}`);
  },
};