import { useCallback, useEffect, useState } from "react";
import { tasksApi } from "../api/tasksApi";
import type {
  Task,
  TaskQueryParameters,
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  PagedResult,
} from "../types";

export function useTasks(initialParams: TaskQueryParameters = {}) {
  const [data, setData] = useState<PagedResult<Task> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<TaskQueryParameters>({
    page: 1,
    pageSize: 10,
    ...initialParams,
  });

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tasksApi.getAll(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar tareas");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  const updateParams = (newParams: Partial<TaskQueryParameters>) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page ?? 1 }));
  };

  const create = async (input: CreateTaskInput) => {
    const created = await tasksApi.create(input);
    await load();
    return created;
  };

  const update = async (id: number, input: UpdateTaskInput) => {
    const updated = await tasksApi.update(id, input);
    await load();
    return updated;
  };

  const updateStatus = async (id: number, input: UpdateTaskStatusInput) => {
    const updated = await tasksApi.updateStatus(id, input);
    // Actualización optimista local sin recargar todo
    setData((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((t) => (t.id === id ? updated : t)),
          }
        : prev
    );
    return updated;
  };

  const remove = async (id: number) => {
    await tasksApi.delete(id);
    await load();
  };

  return {
    tasks: data?.items ?? [],
    pagination: data
      ? {
          page: data.page,
          pageSize: data.pageSize,
          totalCount: data.totalCount,
          totalPages: data.totalPages,
          hasPrevious: data.hasPrevious,
          hasNext: data.hasNext,
        }
      : null,
    isLoading,
    error,
    params,
    updateParams,
    reload: load,
    create,
    update,
    updateStatus,
    remove,
  };
}