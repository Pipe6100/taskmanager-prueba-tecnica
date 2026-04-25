using FluentValidation;
using TaskManager.Application.DTOs.Tasks;
using TaskStatusEnum = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Application.Validators;

public class UpdateTaskStatusDtoValidator : AbstractValidator<UpdateTaskStatusDto>
{
    private static readonly string[] AllowedStatuses =
        Enum.GetNames<TaskStatusEnum>();

    public UpdateTaskStatusDtoValidator()
    {
        RuleFor(t => t.Status)
            .NotEmpty().WithMessage("El estado es obligatorio.")
            .Must(BeAValidStatus)
            .WithMessage($"El estado debe ser uno de: {string.Join(", ", AllowedStatuses)}.");
    }

    private static bool BeAValidStatus(string status)
    {
        return Enum.TryParse<TaskStatusEnum>(status, ignoreCase: true, out _);
    }
}