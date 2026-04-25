using FluentValidation;
using TaskManager.Application.DTOs.Tasks;

namespace TaskManager.Application.Validators;

public class CreateTaskDtoValidator : AbstractValidator<CreateTaskDto>
{
    public CreateTaskDtoValidator()
    {
        RuleFor(t => t.Title)
            .NotEmpty().WithMessage("El título de la tarea es obligatorio.")
            .MinimumLength(3).WithMessage("El título debe tener al menos 3 caracteres.")
            .MaximumLength(200).WithMessage("El título no puede superar los 200 caracteres.");

        RuleFor(t => t.Description)
            .MaximumLength(1000).WithMessage("La descripción no puede superar los 1000 caracteres.");

        RuleFor(t => t.ProjectId)
            .GreaterThan(0).WithMessage("Debe seleccionar un proyecto válido.");

        RuleFor(t => t.DueDate)
            .GreaterThanOrEqualTo(DateTime.UtcNow.Date)
            .When(t => t.DueDate.HasValue)
            .WithMessage("La fecha límite no puede ser anterior al día de hoy.");
    }
}