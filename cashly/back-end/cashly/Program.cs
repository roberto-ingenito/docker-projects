using System.Text;
using System.Text.Json.Serialization;
using cashly.src;
using cashly.src.Data;
using cashly.src.Services.Implementations;
using cashly.src.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using cashly.src.Data.Entities;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Http.HttpResults;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Definisci lo schema di sicurezza (Security Definition)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Inserisci il token JWT in questo formato: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer" // Lo schema deve essere "bearer"
    });

    c.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Aggiungi il DbContext ai servizi dell'applicazione (Dependency Injection).
builder.Services.AddDbContext<AppDbContext>(
    options =>
    {
        options.UseNpgsql(
            builder.Configuration.GetConnectionString("DefaultConnection"),
            o => o.MapEnum<TransactionType>("transaction_type")
        );
    }
);

builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

// Aggiungi i controller
builder.Services.AddControllers().AddJsonOptions(options =>
    {
        // Questa riga dice al serializzatore di trattare gli enum come stringhe
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Abilita l'autorizzazione per i controller
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
        {
            // Qui dici al middleware come deve validare il token
            options.TokenValidationParameters = new TokenValidationParameters
            {
                // Valida la chiave di firma (il segreto)
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"))),

                // Valida l'issuer (chi ha emesso il token)
                ValidateIssuer = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],

                // Valida l'audience (per chi è il token)
                ValidateAudience = true,
                ValidAudience = builder.Configuration["Jwt:Audience"],

                // Valida la scadenza del token
                ValidateLifetime = true
            };
        }
    );

builder.Services.AddAuthorization();

// builder.Services.Configure<ForwardedHeadersOptions>(options =>
// {
//     options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
//     options.KnownProxies.Clear();
//     options.KnownNetworks.Clear();
// });

var app = builder.Build();

app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Applica le migrazioni in sospeso all'avvio
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        // Applica le migrazioni in sospeso
        context.Database.Migrate();

        Console.WriteLine("Migrazioni applicate con successo.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Un errore è avvenuto durante l'applicazione delle migrazioni.");
    }
}

app.Run();