using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace WarehouseApi.Models;

[Table("articles")]
public class Article : BaseModel
{
    [PrimaryKey("id", false)]
    public string Id { get; set; } = string.Empty;

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("photo_url")]
    public string? PhotoUrl { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
