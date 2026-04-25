import { useEffect, useState } from "react";
import { projectsApi } from "../api/projectsApi";
import type { Project } from "../types";

export function useProject(id: number) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    projectsApi
      .getById(id)
      .then((data) => {
        if (!cancelled) {
          setProject(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Error al cargar el proyecto");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { project, isLoading, error };
}