import type { TaskStatus } from "../../types";
import { TASK_STATUSES, statusLabels } from "../../lib/taskStatus";

interface TaskFiltersProps {
  search: string;
  status: TaskStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "") => void;
  onClear: () => void;
}

function TaskFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: TaskFiltersProps) {
  const hasFilters = search || status;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px_auto] gap-3">
        <input
          type="text"
          placeholder="Buscar por título o descripción..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | "")}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los estados</option>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={onClear}
            className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskFilters;