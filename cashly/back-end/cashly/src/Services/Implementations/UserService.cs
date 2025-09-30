using cashly.src.Data;
using cashly.src.Data.Entities;
using cashly.src.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using cashly.src.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cashly.src.Services.Implementations;

public class UserService(AppDbContext dbContext, IConfiguration configuration) : IUserService
{
    public async Task Delete(int userId)
    {
        await dbContext.Users.Where(u => u.UserId == userId).ExecuteDeleteAsync();
    }

    public async Task<User> SignIn(UserLoginDto dto)
    {

        // Trova l'utente tramite email
        User? user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        // Se l'utente non esiste o la password è errata, restituisci null
        if (user == null)
        {
            throw new InvalidOperationException("user-not-found");
        }

        // controlla se la password è errata
        else if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.HashedPassword))
        {
            throw new InvalidOperationException("wrong-password");
        }

        return user;
    }

    public async Task<User> SignUp(UserCreateDto dto)
    {
        // Controlla se l'email è già in uso
        if (await dbContext.Users.AnyAsync(u => u.Email == dto.Email))
        {
            throw new InvalidOperationException("user-already-exists");
        }

        // Crea un nuovo utente e esegui l'hashing della password
        User newUser = new()
        {
            Email = dto.Email,
            HashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        // Salva l'utente nel database
        dbContext.Users.Add(newUser);
        await dbContext.SaveChangesAsync();

        return newUser;
    }

    public string GenerateJwtToken(User user)
    {
        // Ottieni la chiave segreta e altre impostazioni da appsettings.json
        string? jwtKey = configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new InvalidOperationException("La chiave JWT non è configurata in appsettings.json");
        }
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Definisci le "claims" (informazioni sull'utente da inserire nel token)
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()), // 'Subject' -> ID dell'utente
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // ID univoco per il token
        };

        // Imposta la scadenza del token (es. 1 giorno)
        var expires = DateTime.UtcNow.AddDays(1);

        // Crea il token
        var token = new JwtSecurityToken(
            claims: claims,
            expires: expires,
            signingCredentials: credentials,
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"]
        );

        // Scrivi il token come stringa
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}