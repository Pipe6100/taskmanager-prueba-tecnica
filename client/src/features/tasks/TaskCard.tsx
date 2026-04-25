import type { Task, TaskStatus } from "../../types";
import { TASK_STATUSES, statusLabels } from "../../lib/taskStatus";
import TaskStatusBadge from "./TaskStatusBadge";
import Button from "../../components/Ui/Button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onChangeStatus: (task: Task, newStatus: TaskStatus) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TaskCard({ task, onEdit, onDelete, onChangeStatus }: TaskCardProps) {
  const isOverdue =
    task.dueDate &&
    task.status !== "Completed" &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-slate-800 flex-1">{task.title}</h3>
        <TaskStatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="text-sm text-slate-600 mb-3">{task.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        {task.dueDate && (
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            📅 Vence el {formatDate(task.dueDate)}
            {isOverdue && " (vencida)"}
          </span>
        )}
        <span>Creada el {formatDate(task.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-100">
        <select
          value={task.status}
          onChange={(e) => onChangeStatus(task, e.target.value as TaskStatus)}
          className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task)}
            className="text-red-600 hover:bg-red-50"
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;