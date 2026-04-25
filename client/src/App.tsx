import { useEffect, useState } from "react";
import { projectsApi } from "./api/projectsApi";
import type { Project } from "./types";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    projectsApi
      .getAll()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Test de conexión con la API
        </h1>

        {loading && <p className="text-slate-600">Cargando proyectos...</p>}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            <p className="text-green-700 font-semibold">
              ✓ Conexión exitosa. {projects.length} proyectos encontrados:
            </p>
            <ul className="space-y-2">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="bg-white p-4 rounded shadow border border-slate-200"
                >
                  <h2 className="font-semibold text-slate-800">{p.name}</h2>
                  <p className="text-sm text-slate-600">{p.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {p.taskCount} tareas
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;