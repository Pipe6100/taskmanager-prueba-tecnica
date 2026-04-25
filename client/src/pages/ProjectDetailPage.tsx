import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import { useTasks } from "../hooks/useTasks";
import TaskCard from "../features/tasks/TaskCard";
import TaskForm from "../features/tasks/TaskForm";
import TaskFilters from "../features/tasks/TaskFilters";
import Modal from "../components/Ui/Modal";
import ConfirmDialog from "../components/Ui/ConfirmDialog";
import Button from "../components/Ui/Button";
import Spinner from "../components/Ui/Spinner";
import ErrorAlert from "../components/Ui/ErrorAlert";
import Pagination from "../components/Ui/Pagination";
import type {
  Task,
  TaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
} from "../types";

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  if (!id || Number.isNaN(projectId)) {
    return <Navigate to="/projects" replace />;
  }

  return <ProjectDetailContent projectId={projectId} />;
}

function ProjectDetailContent({ projectId }: { projectId: number }) {
  const { project, isLoading: loadingProject, error: projectError } =
    useProject(projectId);

  const {
    tasks,
    pagination,
    isLoading,
    error,
    params,
    updateParams,
    reload,
    create,
    update,
    updateStatus,
    remove,
  } = useTasks({ projectId });

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = async (data: CreateTaskInput | UpdateTaskInput) => {
    await create(data as CreateTaskInput);
    setCreating(false);
  };

  const handleUpdate = async (data: CreateTaskInput | UpdateTaskInput) => {
    if (!editing) return;
    await update(editing.id, data as UpdateTaskInput);
    setEditing(null);
  };

  const handleQuickStatus = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    try {
      await updateStatus(task.id, { status: newStatus });
    } catch {
      reload();
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await remove(deleting.id);
      setDeleting(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Link
        to="/projects"
        className="inline-block text-sm text-indigo-600 hover:text-indigo-700 mb-4"
      >
        ← Volver a proyectos
      </Link>

      {/* Encabezado del proyecto */}
      {loadingProject ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <Spinner size="sm" />
        </div>
      ) : projectError ? (
        <ErrorAlert message={projectError} />
      ) : project ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
          {project.description && (
            <p className="text-slate-600 mt-2">{project.description}</p>
          )}
        </div>
      ) : null}

      {/* Sección de tareas */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Tareas{" "}
          {pagination && (
            <span className="text-sm font-normal text-slate-500">
              ({pagination.totalCount} en total)
            </span>
          )}
        </h2>
        <Button onClick={() => setCreating(true)}>+ Nueva tarea</Button>
      </div>

      <TaskFilters
        search={params.search ?? ""}
        status={(params.status as TaskStatus | undefined) ?? ""}
        onSearchChange={(search) =>
          updateParams({ search: search || undefined })
        }
        onStatusChange={(status) =>
          updateParams({ status: status || undefined })
        }
        onClear={() => updateParams({ search: undefined, status: undefined })}
      />

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && !isLoading && <ErrorAlert message={error} onRetry={reload} />}

      {!isLoading && !error && tasks.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600 mb-4">
            {params.search || params.status
              ? "No hay tareas que coincidan con los filtros."
              : "Este proyecto aún no tiene tareas."}
          </p>
          {!params.search && !params.status && (
            <Button onClick={() => setCreating(true)}>
              Crear la primera tarea
            </Button>
          )}
        </div>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditing}
                onDelete={setDeleting}
                onChangeStatus={handleQuickStatus}
              />
            ))}
          </div>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasPrevious={pagination.hasPrevious}
              hasNext={pagination.hasNext}
              onPageChange={(page) => updateParams({ page })}
            />
          )}
        </>
      )}

      {/* Modal: crear */}
      <Modal
        isOpen={creating}
        onClose={() => setCreating(false)}
        title="Nueva tarea"
      >
        <TaskForm
          projectId={projectId}
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      {/* Modal: editar */}
      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title="Editar tarea"
      >
        {editing && (
          <TaskForm
            projectId={projectId}
            initialData={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Confirmar borrado */}
      <ConfirmDialog
        isOpen={deleting !== null}
        title="Eliminar tarea"
        message={`¿Seguro quieres eliminar "${deleting?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

export default ProjectDetailPage;