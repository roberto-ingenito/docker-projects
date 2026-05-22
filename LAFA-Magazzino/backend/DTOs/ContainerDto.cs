namespace WarehouseApi.DTOs;

public class ContainerDto
{
    public string? Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string ShelfId { get; set; } = string.Empty;
    public string? ShelfLabel { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ArticleStockDto> Articles { get; set; } = new();
}
