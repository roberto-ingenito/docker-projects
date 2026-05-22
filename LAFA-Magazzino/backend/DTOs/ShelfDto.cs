namespace WarehouseApi.DTOs;

public class ShelfDto
{
    public string? Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ContainerDto> Containers { get; set; } = new();
}
