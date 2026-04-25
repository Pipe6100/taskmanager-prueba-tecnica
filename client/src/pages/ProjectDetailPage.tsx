import { useParams, Link } from "react-router-dom";

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Link
        to="/projects"
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← Volver a proyectos
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mt-4">
        Detalle del proyecto #{id}
      </h1>
      <p className="text-sm text-slate-600 mt-2">
        Pantalla de tareas en construcción (Fase 6).
      </p>
    </div>
  );
}

export default ProjectDetailPage;