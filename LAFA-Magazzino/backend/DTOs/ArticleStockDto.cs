namespace WarehouseApi.DTOs;

public class ArticleStockDto
{
    public string? Id { get; set; }
    public string ArticleId { get; set; } = string.Empty;
    public string ContainerId { get; set; } = string.Empty;
    public string? ContainerLabel { get; set; }
    public string? ShelfLabel { get; set; }
    public string? ArticleName { get; set; }
    public int Quantity { get; set; }
}
