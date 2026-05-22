namespace WarehouseApi.DTOs;

public class ScanActionDto
{
    public string? ArticleId { get; set; }
    public string ContainerId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // "LOAD" | "UNLOAD"
    public int Quantity { get; set; }
    public string? Notes { get; set; }
}

public class ScanActionResultDto
{
    public ArticleDto Article { get; set; } = null!;
    public MovementDto Movement { get; set; } = null!;
}
