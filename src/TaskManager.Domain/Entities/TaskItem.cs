using TaskStatusEnum = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Domain.Entities;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskStatusEnum Status { get; set; } = TaskStatusEnum.Pending;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Clave foránea hacia Project
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}