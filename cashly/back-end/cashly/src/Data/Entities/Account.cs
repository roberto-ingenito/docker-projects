using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cashly.src.Data.Entities;

public class Account
{
    [Key]
    public int AccountId { get; set; }

    [Required]
    [MaxLength(100)]
    public required string AccountName { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal InitialBalance { get; set; } = 0;

    // Questo è il saldo che verrà aggiornato dalla tua logica di business
    [Column(TypeName = "decimal(18, 2)")]
    public decimal CurrentBalance { get; set; } = 0;

    [MaxLength(10)]
    public string Currency { get; set; } = "EUR";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Key per l'utente
    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    // Navigation property: un conto ha una collezione di transazioni
    public virtual ICollection<Transaction> Transactions { get; set; } = [];
}