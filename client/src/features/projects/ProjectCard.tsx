import { Link } from "react-router-dom";
import type { Project } from "../../types";
import Button from "../../components/Ui/Button";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col">
      <div className="flex-1">
        <Link
          to={`/projects/${project.id}`}
          className="block hover:text-indigo-600 transition-colors"
        >
          <h3 className="font-semibold text-slate-800 mb-1">{project.name}</h3>
        </Link>
        {project.description && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
            {project.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
            {project.taskCount} {project.taskCount === 1 ? "tarea" : "tareas"}
          </span>
          <span>Creado el {formatDate(project.createdAt)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-1 mt-4 pt-4 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            onEdit(project);
          }}
        >
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            onDelete(project);
          }}
          className="text-red-600 hover:bg-red-50"
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}

export default ProjectCard;