using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Common;
using TaskManager.Application.DTOs.Tasks;
using TaskManager.Application.Interfaces;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    /// <summary>
    /// Devuelve un listado paginado de tareas con filtros opcionales.
    /// Filtros: projectId, status (Pending/InProgress/Completed), search (busca en título y descripción).
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<TaskDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] TaskQueryParameters parameters,
        CancellationToken cancellationToken)
    {
        var result = await _taskService.GetAllAsync(parameters, cancellationToken);
        return Ok(result);
    }

    /// <summary>Devuelve una tarea específica por su ID.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var task = await _taskService.GetByIdAsync(id, cancellationToken);
        return Ok(task);
    }

    /// <summary>Crea una nueva tarea asociada a un proyecto existente.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create(
        [FromBody] CreateTaskDto dto,
        CancellationToken cancellationToken)
    {
        var created = await _taskService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Actualiza completamente una tarea existente.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateTaskDto dto,
        CancellationToken cancellationToken)
    {
        var updated = await _taskService.UpdateAsync(id, dto, cancellationToken);
        return Ok(updated);
    }

    /// <summary>
    /// Cambia únicamente el estado de una tarea (Pending, InProgress, Completed).
    /// Endpoint dedicado para la operación más frecuente en una app de tareas.
    /// </summary>
    [HttpPatch("{id:int}/status")]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateTaskStatusDto dto,
        CancellationToken cancellationToken)
    {
        var updated = await _taskService.UpdateStatusAsync(id, dto, cancellationToken);
        return Ok(updated);
    }

    /// <summary>Elimina una tarea.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _taskService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}