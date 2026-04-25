namespace TaskManager.Application.DTOs.Tasks;

public class UpdateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public string Status { get; set; } = string.Empty;
}