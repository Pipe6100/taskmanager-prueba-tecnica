using TaskManager.Application.DTOs.Projects;

namespace TaskManager.Application.Interfaces;

public interface IProjectService
{
    Task<IReadOnlyList<ProjectDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ProjectDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<ProjectDto> CreateAsync(CreateProjectDto dto, CancellationToken cancellationToken = default);

    Task<ProjectDto> UpdateAsync(int id, UpdateProjectDto dto, CancellationToken cancellationToken = default);

    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}