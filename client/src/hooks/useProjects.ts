import { useCallback, useEffect, useState } from "react";
import { projectsApi } from "../api/projectsApi";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar proyectos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (input: CreateProjectInput) => {
    const created = await projectsApi.create(input);
    setProjects((prev) => [created, ...prev]);
    return created;
  };

  const update = async (id: number, input: UpdateProjectInput) => {
    const updated = await projectsApi.update(id, input);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const remove = async (id: number) => {
    await projectsApi.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    projects,
    isLoading,
    error,
    reload: load,
    create,
    update,
    remove,
  };
}