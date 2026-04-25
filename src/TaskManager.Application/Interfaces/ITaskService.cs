using TaskManager.Application.Common;
using TaskManager.Application.DTOs.Tasks;

namespace TaskManager.Application.Interfaces;

public interface ITaskService
{
    Task<PagedResult<TaskDto>> GetAllAsync(TaskQueryParameters parameters, CancellationToken cancellationToken = default);

    Task<TaskDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<TaskDto> CreateAsync(CreateTaskDto dto, CancellationToken cancellationToken = default);

    Task<TaskDto> UpdateAsync(int id, UpdateTaskDto dto, CancellationToken cancellationToken = default);

    Task<TaskDto> UpdateStatusAsync(int id, UpdateTaskStatusDto dto, CancellationToken cancellationToken = default);

    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}