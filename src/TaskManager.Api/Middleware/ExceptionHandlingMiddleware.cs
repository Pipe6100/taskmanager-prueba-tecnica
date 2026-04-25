using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Exceptions;

namespace TaskManager.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, problemDetails) = exception switch
        {
            NotFoundException notFound => (
                HttpStatusCode.NotFound,
                new ProblemDetails
                {
                    Status = (int)HttpStatusCode.NotFound,
                    Title = "Resource not found",
                    Detail = notFound.Message,
                    Instance = context.Request.Path
                }
            ),

            ValidationException validation => (
                HttpStatusCode.BadRequest,
                BuildValidationProblem(context, validation)
            ),

            _ => (
                HttpStatusCode.InternalServerError,
                new ProblemDetails
                {
                    Status = (int)HttpStatusCode.InternalServerError,
                    Title = "Internal server error",
                    Detail = "An unexpected error occurred. Please try again later.",
                    Instance = context.Request.Path
                }
            )
        };

        // Loguear como error solo las excepciones inesperadas
        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Unhandled exception while processing {Path}", context.Request.Path);

        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/problem+json";

        var json = JsonSerializer.Serialize(problemDetails, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }

    private static ValidationProblemDetails BuildValidationProblem(
        HttpContext context,
        ValidationException exception)
    {
        var problem = new ValidationProblemDetails(exception.Errors.ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value))
        {
            Status = (int)HttpStatusCode.BadRequest,
            Title = "One or more validation errors occurred.",
            Instance = context.Request.Path
        };

        return problem;
    }
}