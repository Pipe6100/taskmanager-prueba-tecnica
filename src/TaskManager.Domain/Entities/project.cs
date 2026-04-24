namespace TaskManager.Domain.Entities;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relación 1 → N: un proyecto tiene muchas tareas
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}