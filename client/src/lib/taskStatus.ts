import type { TaskStatus } from "../types";

export const TASK_STATUSES: TaskStatus[] = ["Pending", "InProgress", "Completed"];

export const statusLabels: Record<TaskStatus, string> = {
  Pending: "Pendiente",
  InProgress: "En Progreso",
  Completed: "Completada",
};

export const statusColors: Record<TaskStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  InProgress: "bg-blue-100 text-blue-800 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};