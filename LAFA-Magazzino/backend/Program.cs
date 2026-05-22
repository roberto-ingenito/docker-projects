using WarehouseApi.Hubs;
using WarehouseApi.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Supabase Service ──────────────────────────────────────────────────────────
builder.Services.AddSingleton<SupabaseService>();

// ── Controllers ───────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// ── SignalR ───────────────────────────────────────────────────────────────────
builder.Services.AddSignalR(opts =>
{
    opts.EnableDetailedErrors = true;
});

// ── Swagger / OpenAPI ─────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Warehouse API", Version = "v1" });
});

// ── CORS ──────────────────────────────────────────────────────────────────────
var frontendOrigin =
    builder.Configuration["FRONTEND_ORIGIN"]
    ?? Environment.GetEnvironmentVariable("FRONTEND_ORIGIN")
    ?? "http://localhost";

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "FrontendPolicy",
        policy =>
        {
            policy
                .SetIsOriginAllowed(_ => true) // Consente l'accesso da qualsiasi IP della rete locale
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); // richiesto per SignalR
        }
    );
});

// ── Health checks ─────────────────────────────────────────────────────────────
builder.Services.AddHealthChecks();

DotNetEnv.Env.Load(); // carica il .env dalla root del progetto

var app = builder.Build();

// ── Middleware pipeline ───────────────────────────────────────────────────

// ── PATH BASE: /lafa-magazzino-api ───────────────────────────────────────
// Tutte le route vengono prefissate con /lafa-magazzino-api
app.UsePathBase("/lafa-magazzino-api");

// ── FORWARDED HEADERS ────────────────────────────────────────────────────
// Necessario per gestire correttamente HTTPS dietro Traefik
app.UseForwardedHeaders(
    new Microsoft.AspNetCore.HttpOverrides.ForwardedHeadersOptions
    {
        ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor
            | Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto
            | Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedHost,
    }
);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendPolicy");

app.MapHealthChecks("/health");
app.MapControllers();
app.MapHub<WarehouseHub>("/hubs/warehouse");

// Initialise Supabase on startup
var supabaseService = app.Services.GetRequiredService<SupabaseService>();

await supabaseService.InitializeAsync();

app.Run();
