namespace cashly.src.DTOs;

public class AccountResponseDto
{
    public int AccountId { get; set; }
    public required string AccountName { get; set; }
    public decimal CurrentBalance { get; set; }
    public required string Currency { get; set; }
    public DateTime CreatedAt { get; set; }
}