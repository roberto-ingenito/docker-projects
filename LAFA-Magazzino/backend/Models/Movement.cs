using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace WarehouseApi.Models;

[Table("movements")]
public class Movement : BaseModel
{
    [PrimaryKey("id", false)]
    public string Id { get; set; } = string.Empty;

    [Column("article_id")]
    public string ArticleId { get; set; } = string.Empty;

    [Column("article_name")]
    public string ArticleName { get; set; } = string.Empty;

    [Column("type")]
    public string Type { get; set; } = string.Empty; // "LOAD" | "UNLOAD"

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
