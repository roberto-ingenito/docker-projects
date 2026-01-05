using System.Text.Json.Serialization;
using Microsoft.AspNetCore.HttpOverrides;
using MrWhite.Backend.Hubs;
using MrWhite.Backend.Services;

var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder
    .Services.AddSignalR()
    // .AddStackExchangeRedis("localhost:6379")
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter()); // Trasforma gli Enum in stringhe
    });

builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddSingleton<GameService>();
builder.Services.AddSingleton<WordService>();

// ===================================
// CORS
// ===================================
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: myAllowSpecificOrigins,
        policy =>
        {
            policy
                .WithOrigins(
                    "https://roberto-ingenito.ddns.net", // produzione
                    "http://localhost:3000" // sviluppo
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});

var app = builder.Build();

// ===================================
// Questo fa sì che tutte le route siano prefissate con /mr-white-api/
// ===================================
app.UsePathBase("/mr-white-api");

// ===================================
// FORWARDED HEADERS
// Necessario per gestire correttamente HTTPS dietro Nginx
// ===================================
app.UseForwardedHeaders(
    new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost,
    }
);

app.UseCors(myAllowSpecificOrigins);

app.MapHub<GameHub>("");

app.Run();
