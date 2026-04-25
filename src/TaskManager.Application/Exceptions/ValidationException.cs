namespace TaskManager.Application.Exceptions;

/// <summary>
/// Se lanza cuando los datos de entrada no pasan las reglas de validación.
/// El middleware global la traduce a HTTP 400 Bad Request con la lista de errores.
/// </summary>
public class ValidationException : Exception
{
    public IReadOnlyDictionary<string, string[]> Errors { get; }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("One or more validation errors occurred.")
    {
        Errors = new Dictionary<string, string[]>(errors);
    }
}