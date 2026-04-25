using TaskManager.Application.DTOs.Projects;
using TaskManager.Application.Exceptions;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Interfaces.Repositories;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProjectService(IProjectRepository projectRepository, IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<ProjectDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var projects = await _projectRepository.GetAllWithTaskCountAsync(cancellationToken);

        return projects
            .Select(p => MapToDto(p))
            .ToList();
    }

    public async Task<ProjectDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var project = await _projectRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Project), id);

        var taskCount = await _projectRepository.CountTasksAsync(id, cancellationToken);

        return MapToDto(project, taskCount);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto, CancellationToken cancellationToken = default)
    {
        var project = new Project
        {
            Name = dto.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _projectRepository.AddAsync(project, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(project, taskCount: 0);
    }

    public async Task<ProjectDto> UpdateAsync(int id, UpdateProjectDto dto, CancellationToken cancellationToken = default)
    {
        var project = await _projectRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Project), id);

        project.Name = dto.Name.Trim();
        project.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim();

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var taskCount = await _projectRepository.CountTasksAsync(id, cancellationToken);

        return MapToDto(project, taskCount);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var project = await _projectRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Project), id);

        _projectRepository.Remove(project);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static ProjectDto MapToDto(Project project) =>
        MapToDto(project, project.Tasks?.Count ?? 0);

    private static ProjectDto MapToDto(Project project, int taskCount) => new()
    {
        Id = project.Id,
        Name = project.Name,
        Description = project.Description,
        CreatedAt = project.CreatedAt,
        TaskCount = taskCount
    };
}