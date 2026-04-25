using TaskManager.Application.Common;
using TaskManager.Application.DTOs.Tasks;
using TaskManager.Application.Exceptions;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Interfaces.Repositories;
using TaskManager.Domain.Entities;
using TaskStatusEnum = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TaskService(
        ITaskRepository taskRepository,
        IProjectRepository projectRepository,
        IUnitOfWork unitOfWork)
    {
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResult<TaskDto>> GetAllAsync(
        TaskQueryParameters parameters,
        CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _taskRepository.GetPagedAsync(parameters, cancellationToken);

        var dtos = items.Select(MapToDto).ToList();

        return new PagedResult<TaskDto>(
            items: dtos,
            totalCount: totalCount,
            page: parameters.Page,
            pageSize: parameters.PageSize);
    }

    public async Task<TaskDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(TaskItem), id);

        return MapToDto(task);
    }

    public async Task<TaskDto> CreateAsync(CreateTaskDto dto, CancellationToken cancellationToken = default)
    {
        var projectExists = await _projectRepository.ExistsAsync(dto.ProjectId, cancellationToken);
        if (!projectExists)
            throw new NotFoundException(nameof(Project), dto.ProjectId);

        var task = new TaskItem
        {
            Title = dto.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim(),
            DueDate = dto.DueDate,
            ProjectId = dto.ProjectId,
            Status = TaskStatusEnum.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _taskRepository.AddAsync(task, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var created = await _taskRepository.GetByIdAsNoTrackingAsync(task.Id, cancellationToken);
        return MapToDto(created!);
    }

    public async Task<TaskDto> UpdateAsync(int id, UpdateTaskDto dto, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(TaskItem), id);

        if (!Enum.TryParse<TaskStatusEnum>(dto.Status, ignoreCase: true, out var statusEnum))
            throw new ValidationException(new Dictionary<string, string[]>
            {
                [nameof(dto.Status)] = new[] { $"'{dto.Status}' is not a valid task status." }
            });

        task.Title = dto.Title.Trim();
        task.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim();
        task.DueDate = dto.DueDate;
        task.Status = statusEnum;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(task);
    }

    public async Task<TaskDto> UpdateStatusAsync(
        int id,
        UpdateTaskStatusDto dto,
        CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(TaskItem), id);

        if (!Enum.TryParse<TaskStatusEnum>(dto.Status, ignoreCase: true, out var statusEnum))
            throw new ValidationException(new Dictionary<string, string[]>
            {
                [nameof(dto.Status)] = new[] { $"'{dto.Status}' is not a valid task status." }
            });

        task.Status = statusEnum;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(task);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(TaskItem), id);

        _taskRepository.Remove(task);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static TaskDto MapToDto(TaskItem task) => new()
    {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        Status = task.Status.ToString(),
        DueDate = task.DueDate,
        CreatedAt = task.CreatedAt,
        ProjectId = task.ProjectId,
        ProjectName = task.Project?.Name ?? string.Empty
    };
}