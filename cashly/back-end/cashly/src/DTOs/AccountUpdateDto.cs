using System.ComponentModel.DataAnnotations;

namespace cashly.src.DTOs;

public class AccountUpdateDto
{
    [MaxLength(100)]
    public string? AccountName { get; set; }
}