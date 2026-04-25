using Microsoft.EntityFrameworkCore;
using TaskManager.Application.Interfaces.Repositories;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Persistence;

namespace TaskManager.Infrastructure.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly ApplicationDbContext _context;

    public ProjectRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Project>> GetAllWithTaskCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .AsNoTracking()
            .Include(p => p.Tasks)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Projects.FindAsync(new object[] { id }, cancellationToken);
    }

    public Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default)
    {
        return _context.Projects.AnyAsync(p => p.Id == id, cancellationToken);
    }

    public Task<int> CountTasksAsync(int projectId, CancellationToken cancellationToken = default)
    {
        return _context.Tasks.CountAsync(t => t.ProjectId == projectId, cancellationToken);
    }

    public async Task AddAsync(Project project, CancellationToken cancellationToken = default)
    {
        await _context.Projects.AddAsync(project, cancellationToken);
    }

    public void Remove(Project project)
    {
        _context.Projects.Remove(project);
    }
}