namespace WarehouseApi.DTOs;

public class MovementDto
{
    public string? Id { get; set; }
    public string ArticleId { get; set; } = string.Empty;
    public string ArticleName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
