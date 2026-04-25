using TaskManager.Application.DTOs.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces.Repositories;

public interface ITaskRepository
{
    Task<(IReadOnlyList<TaskItem> Items, int TotalCount)> GetPagedAsync(
        TaskQueryParameters parameters,
        CancellationToken cancellationToken = default);

    Task<TaskItem?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<TaskItem?> GetByIdAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);

    Task AddAsync(TaskItem task, CancellationToken cancellationToken = default);

    void Remove(TaskItem task);
}