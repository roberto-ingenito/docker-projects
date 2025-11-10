using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    // Questo è il saldo che verrà aggiornato dalla tua logica di business
    [Column(TypeName = "decimal(18, 2)")]
    public decimal CurrentBalance { get; set; } = 0;

    [MaxLength(10)]
    public string Currency { get; set; } = "EUR";


    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<Transaction> Transactions { get; set; } = [];
    public virtual ICollection<Category> Categories { get; set; } = [];
}