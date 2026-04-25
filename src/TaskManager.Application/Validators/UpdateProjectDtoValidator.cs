using FluentValidation;
using TaskManager.Application.DTOs.Projects;

namespace TaskManager.Application.Validators;

public class UpdateProjectDtoValidator : AbstractValidator<UpdateProjectDto>
{
    public UpdateProjectDtoValidator()
    {
        RuleFor(p => p.Name)
            .NotEmpty().WithMessage("El nombre del proyecto es obligatorio.")
            .MinimumLength(3).WithMessage("El nombre debe tener al menos 3 caracteres.")
            .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");

        RuleFor(p => p.Description)
            .MaximumLength(500).WithMessage("La descripción no puede superar los 500 caracteres.");
    }
}