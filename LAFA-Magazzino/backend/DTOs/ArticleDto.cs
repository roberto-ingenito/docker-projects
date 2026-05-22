namespace WarehouseApi.DTOs;

public class ArticleDto
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ArticleStockDto> Stock { get; set; } = new();
    public int Quantity => Stock.Sum(s => s.Quantity);
}
