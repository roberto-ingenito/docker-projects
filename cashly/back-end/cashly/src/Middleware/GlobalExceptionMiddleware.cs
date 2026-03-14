using System.Net;
using System.Text.Json;

namespace cashly.src.Middleware;

public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Un'eccezione non gestita si è verificata: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError; // 500 di default
        var result = "Si è verificato un errore interno al server.";

        // Mappatura delle eccezioni di business (InvalidOperationException usate nei servizi)
        if (exception is InvalidOperationException invEx)
        {
            (code, result) = invEx.Message switch
            {
                "wrong-credentials" => (HttpStatusCode.Unauthorized, "Credenziali non valide"),
                "category-not-found" => (HttpStatusCode.NotFound, "Categoria non trovata"),
                "transaction-not-found" => (HttpStatusCode.NotFound, "Transazione non trovata"),
                "user-already-exists" => (HttpStatusCode.Conflict, "L'utente esiste già"),
                _ => (HttpStatusCode.BadRequest, invEx.Message),
            };
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        var response = new
        {
            message = result,
            // In produzione non dovremmo mai inviare lo stack trace o i dettagli tecnici dell'eccezione
            // error = exception.Message
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
