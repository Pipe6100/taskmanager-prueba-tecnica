using FluentValidation;
using TaskManager.Application.DTOs.Tasks;
using TaskStatusEnum = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Application.Validators;

public class UpdateTaskDtoValidator : AbstractValidator<UpdateTaskDto>
{
    private static readonly string[] AllowedStatuses =
        Enum.GetNames<TaskStatusEnum>();

    public UpdateTaskDtoValidator()
    {
        RuleFor(t => t.Title)
            .NotEmpty().WithMessage("El título de la tarea es obligatorio.")
            .MinimumLength(3).WithMessage("El título debe tener al menos 3 caracteres.")
            .MaximumLength(200).WithMessage("El título no puede superar los 200 caracteres.");

        RuleFor(t => t.Description)
            .MaximumLength(1000).WithMessage("La descripción no puede superar los 1000 caracteres.");

        RuleFor(t => t.Status)
            .NotEmpty().WithMessage("El estado es obligatorio.")
            .Must(BeAValidStatus)
            .WithMessage($"El estado debe ser uno de: {string.Join(", ", AllowedStatuses)}.");

        RuleFor(t => t.DueDate)
            .GreaterThanOrEqualTo(DateTime.UtcNow.Date)
            .When(t => t.DueDate.HasValue)
            .WithMessage("La fecha límite no puede ser anterior al día de hoy.");
    }

    private static bool BeAValidStatus(string status)
    {
        return Enum.TryParse<TaskStatusEnum>(status, ignoreCase: true, out _);
    }
}