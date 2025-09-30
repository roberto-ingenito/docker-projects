using System.ComponentModel.DataAnnotations;

namespace cashly.src.Data.Entities;

public class User
{
    [Key] // Chiave primaria
    public int UserId { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Email { get; set; }

    [Required]
    public required string HashedPassword { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties: un utente ha una collezione di conti e categorie
    public virtual ICollection<Account> Accounts { get; set; } = [];
    public virtual ICollection<Category> Categories { get; set; } = [];
}