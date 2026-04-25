import { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../features/projects/ProjectCard";
import ProjectForm from "../features/projects/ProjectForm";
import Modal from "../components/Ui/Modal";
import ConfirmDialog from "../components/Ui/ConfirmDialog";
import Button from "../components/Ui/Button";
import Spinner from "../components/Ui/Spinner";
import ErrorAlert from "../components/Ui/ErrorAlert";
import type { Project, CreateProjectInput } from "../types";

function ProjectsPage() {
  const { projects, isLoading, error, reload, create, update, remove } =
    useProjects();

  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = async (data: CreateProjectInput) => {
    await create(data);
    setCreating(false);
  };

  const handleUpdate = async (data: CreateProjectInput) => {
    if (!editing) return;
    await update(editing.id, data);
    setEditing(null);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Proyectos</h1>
          <p className="text-sm text-slate-600 mt-1">
            Organiza tu trabajo en proyectos y tareas
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>+ Nuevo proyecto</Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {error && !isLoading && <ErrorAlert message={error} onRetry={reload} />}

      {!isLoading && !error && projects.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600 mb-4">
            Aún no tienes proyectos creados.
          </p>
          <Button onClick={() => setCreating(true)}>
            Crear el primer proyecto
          </Button>
        </div>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      {/* Modal: Crear */}
      <Modal
        isOpen={creating}
        onClose={() => setCreating(false)}
        title="Nuevo proyecto"
      >
        <ProjectForm
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      {/* Modal: Editar */}
      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title="Editar proyecto"
      >
        {editing && (
          <ProjectForm
            initialData={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Confirmación de borrado */}
      <ConfirmDialog
        isOpen={deleting !== null}
        title="Eliminar proyecto"
        message={`¿Seguro quieres eliminar "${deleting?.name}"? Esta acción también eliminará todas sus tareas asociadas y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

export default ProjectsPage;