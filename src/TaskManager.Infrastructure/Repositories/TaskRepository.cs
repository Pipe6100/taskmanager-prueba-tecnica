using Microsoft.EntityFrameworkCore;
using TaskManager.Application.DTOs.Tasks;
using TaskManager.Application.Interfaces.Repositories;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Persistence;
using TaskStatusEnum = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly ApplicationDbContext _context;

    public TaskRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(IReadOnlyList<TaskItem> Items, int TotalCount)> GetPagedAsync(
        TaskQueryParameters parameters,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Tasks
            .AsNoTracking()
            .Include(t => t.Project)
            .AsQueryable();

        if (parameters.ProjectId.HasValue)
            query = query.Where(t => t.ProjectId == parameters.ProjectId.Value);

        if (!string.IsNullOrWhiteSpace(parameters.Status)
            && Enum.TryParse<TaskStatusEnum>(parameters.Status, true, out var statusEnum))
        {
            query = query.Where(t => t.Status == statusEnum);
        }

        if (!string.IsNullOrWhiteSpace(parameters.Search))
        {
            var search = parameters.Search.Trim().ToLower();
            query = query.Where(t =>
                t.Title.ToLower().Contains(search) ||
                (t.Description != null && t.Description.ToLower().Contains(search)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((parameters.Page - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<TaskItem?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<TaskItem?> GetByIdAsNoTrackingAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
            .Include(t => t.Project)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task AddAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        await _context.Tasks.AddAsync(task, cancellationToken);
    }

    public void Remove(TaskItem task)
    {
        _context.Tasks.Remove(task);
    }
}