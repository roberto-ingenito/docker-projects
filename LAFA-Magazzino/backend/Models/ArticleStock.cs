using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace WarehouseApi.Models;

[Table("article_stock")]
public class ArticleStock : BaseModel
{
    [PrimaryKey("id", false)]
    public string Id { get; set; } = string.Empty;

    [Column("article_id")]
    public string ArticleId { get; set; } = string.Empty;

    [Column("container_id")]
    public string ContainerId { get; set; } = string.Empty;

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
