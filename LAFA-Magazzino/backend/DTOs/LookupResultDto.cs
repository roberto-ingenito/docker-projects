namespace WarehouseApi.DTOs;

public class LookupResultDto
{
    public string Type { get; set; } = string.Empty; // "shelf", "container", "article"
    public object? Data { get; set; }
}
