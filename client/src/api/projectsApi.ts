import apiClient from "./client";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types";

const RESOURCE = "/projects";

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>(RESOURCE);
    return response.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await apiClient.get<Project>(`${RESOURCE}/${id}`);
    return response.data;
  },

  create: async (input: CreateProjectInput): Promise<Project> => {
    const response = await apiClient.post<Project>(RESOURCE, input);
    return response.data;
  },

  update: async (id: number, input: UpdateProjectInput): Promise<Project> => {
    const response = await apiClient.put<Project>(`${RESOURCE}/${id}`, input);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${RESOURCE}/${id}`);
  },
};