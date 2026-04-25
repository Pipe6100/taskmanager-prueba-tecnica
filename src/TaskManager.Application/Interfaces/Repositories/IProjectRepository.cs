using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces.Repositories;

public interface IProjectRepository
{
    Task<IReadOnlyList<Project>> GetAllWithTaskCountAsync(CancellationToken cancellationToken = default);

    Task<Project?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default);

    Task<int> CountTasksAsync(int projectId, CancellationToken cancellationToken = default);

    Task AddAsync(Project project, CancellationToken cancellationToken = default);

    void Remove(Project project);
}