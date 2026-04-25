import type { TaskStatus } from "../../types";
import { statusColors, statusLabels } from "../../lib/taskStatus";

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export default TaskStatusBadge;