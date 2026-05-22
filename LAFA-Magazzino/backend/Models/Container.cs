using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace WarehouseApi.Models;

[Table("containers")]
public class Container : BaseModel
{
    [PrimaryKey("id", false)]
    public string Id { get; set; } = string.Empty;

    [Column("label")]
    public string Label { get; set; } = string.Empty;

    [Column("shelf_id")]
    public string ShelfId { get; set; } = string.Empty;

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
