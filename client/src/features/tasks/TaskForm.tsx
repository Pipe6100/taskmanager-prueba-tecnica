import { useState, type FormEvent } from "react";
import Input from "../../components/Ui/Input";
import Textarea from "../../components/Ui/Textarea";
import Select from "../../components/Ui/Select";
import Button from "../../components/Ui/Button";
import ErrorAlert from "../../components/Ui/ErrorAlert";
import { TASK_STATUSES, statusLabels } from "../../lib/taskStatus";
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from "../../types";

interface TaskFormProps {
  projectId: number;
  initialData?: Task;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  onCancel: () => void;
}

function toInputDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

function TaskForm({ projectId, initialData, onSubmit, onCancel }: TaskFormProps) {
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [dueDate, setDueDate] = useState(toInputDate(initialData?.dueDate));
  const [status, setStatus] = useState<TaskStatus>(initialData?.status ?? "Pending");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "El título es obligatorio.";
    } else if (title.trim().length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres.";
    } else if (title.trim().length > 200) {
      newErrors.title = "El título no puede superar los 200 caracteres.";
    }

    if (description.length > 1000) {
      newErrors.description = "La descripción no puede superar los 1000 caracteres.";
    }

    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(dueDate);
      if (selected < today) {
        newErrors.dueDate = "La fecha límite no puede ser anterior a hoy.";
      }
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
      const dueDateIso = dueDate ? new Date(dueDate).toISOString() : null;

      if (isEditing) {
        const payload: UpdateTaskInput = {
          title: title.trim(),
          description: description.trim() || null,
          dueDate: dueDateIso,
          status,
        };
        await onSubmit(payload);
      } else {
        const payload: CreateTaskInput = {
          title: title.trim(),
          description: description.trim() || null,
          dueDate: dueDateIso,
          projectId,
        };
        await onSubmit(payload);
      }
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([key, values]) => {
          mapped[key.toLowerCase()] = (values as string[])[0];
        });
        setErrors(mapped);
      } else {
        setSubmitError(err?.response?.data?.detail ?? "Error al guardar la tarea.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ej: Implementar autenticación"
        error={errors.title}
        disabled={isSubmitting}
        autoFocus
      />

      <Textarea
        label="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Detalles adicionales de la tarea"
        rows={3}
        error={errors.description}
        disabled={isSubmitting}
      />

      <Input
        type="date"
        label="Fecha límite (opcional)"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        error={errors.dueDate}
        disabled={isSubmitting}
      />

      {isEditing && (
        <Select
          label="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          disabled={isSubmitting}
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </Select>
      )}

      {submitError && <ErrorAlert message={submitError} />}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? "Guardar cambios" : "Crear tarea"}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;