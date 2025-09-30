using System.ComponentModel.DataAnnotations;

namespace cashly.src.DTOs;


public class AccountCreateDto
{
    [Required]
    [MaxLength(100)]
    public required string AccountName { get; set; }

    public decimal InitialBalance { get; set; } = 0;
}