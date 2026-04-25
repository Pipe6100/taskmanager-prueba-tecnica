import { useState, type FormEvent } from "react";
import Input from "../../components/Ui/Input";
import Textarea from "../../components/Ui/Textarea";
import Button from "../../components/Ui/Button";
import ErrorAlert from "../../components/Ui/ErrorAlert";
import type { Project, CreateProjectInput } from "../../types";

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  onCancel: () => void;
}

function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    } else if (name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    } else if (name.trim().length > 100) {
      newErrors.name = "El nombre no puede superar los 100 caracteres.";
    }
    if (description.length > 500) {
      newErrors.description = "La descripción no puede superar los 500 caracteres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
      });
    } catch (err: any) {
      // Si el backend devolvió errores por campo, mapearlos
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([key, values]) => {
          mapped[key.toLowerCase()] = (values as string[])[0];
        });
        setErrors(mapped);
      } else {
        setSubmitError(
          err?.response?.data?.detail ?? "Error al guardar el proyecto."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del proyecto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej: Rediseño del sitio web"
        error={errors.name}
        disabled={isSubmitting}
        autoFocus
      />

      <Textarea
        label="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe brevemente el objetivo del proyecto"
        rows={4}
        error={errors.description}
        disabled={isSubmitting}
      />

      {submitError && <ErrorAlert message={submitError} />}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? "Guardar cambios" : "Crear proyecto"}
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;