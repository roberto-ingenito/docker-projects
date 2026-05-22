using Supabase;
using WarehouseApi.DTOs;
using WarehouseApi.Models;

namespace WarehouseApi.Services;

public class SupabaseService
{
    private readonly Client _client;
    private readonly ILogger<SupabaseService> _logger;

    public SupabaseService(IConfiguration configuration, ILogger<SupabaseService> logger)
    {
        _logger = logger;

        var url =
            Environment.GetEnvironmentVariable("SUPABASE_URL")
            ?? configuration["Supabase:Url"]
            ?? throw new InvalidOperationException("SUPABASE_URL is not configured.");

        var key =
            Environment.GetEnvironmentVariable("SUPABASE_ANON_KEY")
            ?? configuration["Supabase:AnonKey"]
            ?? throw new InvalidOperationException("SUPABASE_ANON_KEY is not configured.");

        var options = new SupabaseOptions { AutoRefreshToken = true, AutoConnectRealtime = false };

        _client = new Client(url, key, options);
    }

    public async Task InitializeAsync()
    {
        await _client.InitializeAsync();
        _logger.LogInformation("Supabase client initialized.");
    }

    // ── Articles ─────────────────────────────────────────────────────────────

    public async Task<List<ArticleDto>> GetArticlesAsync()
    {
        var response = await _client
            .From<Article>()
            .Order("created_at", Supabase.Postgrest.Constants.Ordering.Descending)
            .Get();

        var articles = response.Models;
        var dtos = new List<ArticleDto>();

        foreach (var a in articles)
        {
            var dto = await GetArticleByIdAsync(a.Id);
            if (dto != null) dtos.Add(dto);
        }

        return dtos;
    }

    public async Task<ArticleDto?> GetArticleByIdAsync(string id)
    {
        var response = await _client.From<Article>().Where(a => a.Id == id).Single();
        if (response == null) return null;

        var dto = MapArticle(response);
        var stockResponse = await _client
            .From<ArticleStock>()
            .Where(s => s.ArticleId == id)
            .Get();

        var stockDtos = new List<ArticleStockDto>();
        foreach (var s in stockResponse.Models)
        {
            var sDto = MapStock(s);
            // Hydrate labels
            var container = await _client.From<Container>().Where(c => c.Id == s.ContainerId).Single();
            if (container != null)
            {
                sDto.ContainerLabel = container.Label;
                var shelf = await _client.From<Shelf>().Where(sh => sh.Id == container.ShelfId).Single();
                if (shelf != null) sDto.ShelfLabel = shelf.Label;
            }
            stockDtos.Add(sDto);
        }
        dto.Stock = stockDtos;

        return dto;
    }

    public async Task<List<ArticleDto>> GetArticlesByContainerIdAsync(string containerId)
    {
        var stockEntries = await _client
            .From<ArticleStock>()
            .Where(s => s.ContainerId == containerId)
            .Get();

        var articleIds = stockEntries.Models.Select(s => s.ArticleId).Distinct();
        var articles = new List<ArticleDto>();

        foreach (var id in articleIds)
        {
            var art = await GetArticleByIdAsync(id);
            if (art != null) articles.Add(art);
        }

        return articles;
    }

    public async Task<List<ArticleDto>> SearchArticlesAsync(string query)
    {
        var response = await _client
            .From<Article>()
            .Filter("name", Supabase.Postgrest.Constants.Operator.ILike, $"%{query}%")
            .Order("created_at", Supabase.Postgrest.Constants.Ordering.Descending)
            .Get();

        var dtos = new List<ArticleDto>();
        foreach (var a in response.Models)
        {
            var dto = await GetArticleByIdAsync(a.Id);
            if (dto != null) dtos.Add(dto);
        }
        return dtos;
    }

    public async Task<ArticleDto> AddArticleAsync(ArticleDto dto)
    {
        var article = new Article
        {
            Name = dto.Name,
            PhotoUrl = dto.PhotoUrl,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
        };

        var response = await _client.From<Article>().Insert(article);
        var created = response.Models.First();

        // Salva lo stock
        foreach (var s in dto.Stock)
        {
            var stock = new ArticleStock
            {
                ArticleId = created.Id,
                ContainerId = s.ContainerId,
                Quantity = s.Quantity
            };
            await _client.From<ArticleStock>().Insert(stock);
        }

        return (await GetArticleByIdAsync(created.Id))!;
    }

    public async Task<ArticleDto?> UpdateArticleAsync(string id, ArticleDto dto)
    {
        var existing = await _client.From<Article>().Where(a => a.Id == id).Single();
        if (existing == null) return null;

        existing.Name = dto.Name;
        existing.PhotoUrl = string.IsNullOrWhiteSpace(dto.PhotoUrl) ? null : dto.PhotoUrl;
        existing.Notes = dto.Notes;

        await _client.From<Article>().Update(existing);

        // Aggiorna lo stock (semplificato: elimina e ricrea)
        await _client.From<ArticleStock>().Where(s => s.ArticleId == id).Delete();
        foreach (var s in dto.Stock)
        {
            var stock = new ArticleStock
            {
                ArticleId = id,
                ContainerId = s.ContainerId,
                Quantity = s.Quantity
            };
            await _client.From<ArticleStock>().Insert(stock);
        }

        return await GetArticleByIdAsync(id);
    }

    public async Task DeleteArticleAsync(string id)
    {
        await _client.From<Article>().Where(a => a.Id == id).Delete();
    }

    public async Task UpdateQuantityAsync(string articleId, string containerId, int delta)
    {
        await _client.Rpc(
            "update_stock_quantity",
            new Dictionary<string, object>
            {
                { "p_article_id", articleId },
                { "p_container_id", containerId },
                { "p_delta", delta }
            }
        );
    }

    // ── Shelves ──────────────────────────────────────────────────────────────

    public async Task<List<ShelfDto>> GetShelvesAsync()
    {
        var response = await _client.From<Shelf>().Order("label", Supabase.Postgrest.Constants.Ordering.Ascending).Get();
        var dtos = new List<ShelfDto>();
        foreach (var s in response.Models)
        {
            var dto = await GetShelfByIdAsync(s.Id);
            if (dto != null) dtos.Add(dto);
        }
        return dtos;
    }

    public async Task<ShelfDto?> GetShelfByIdAsync(string id)
    {
        var response = await _client.From<Shelf>().Where(s => s.Id == id).Single();
        if (response == null) return null;

        var dto = new ShelfDto { Id = response.Id, Label = response.Label, Notes = response.Notes, CreatedAt = DateTime.SpecifyKind(response.CreatedAt, DateTimeKind.Utc) };
        
        var containersResponse = await _client.From<Container>().Where(c => c.ShelfId == id).Get();
        dto.Containers = containersResponse.Models.Select(c => new ContainerDto 
        { 
            Id = c.Id, 
            Label = c.Label, 
            ShelfId = c.ShelfId, 
            ShelfLabel = dto.Label,
            CreatedAt = DateTime.SpecifyKind(c.CreatedAt, DateTimeKind.Utc) 
        }).ToList();

        return dto;
    }

    public async Task<ShelfDto> AddShelfAsync(ShelfDto dto)
    {
        var shelf = new Shelf { Label = dto.Label, Notes = dto.Notes, CreatedAt = DateTime.UtcNow };
        var response = await _client.From<Shelf>().Insert(shelf);
        return (await GetShelfByIdAsync(response.Models.First().Id))!;
    }

    public async Task<ShelfDto?> UpdateShelfAsync(string id, ShelfDto dto)
    {
        var existing = await _client.From<Shelf>().Where(s => s.Id == id).Single();
        if (existing == null) return null;
        existing.Label = dto.Label;
        existing.Notes = dto.Notes;
        await _client.From<Shelf>().Update(existing);
        return await GetShelfByIdAsync(id);
    }

    public async Task DeleteShelfAsync(string id) => await _client.From<Shelf>().Where(s => s.Id == id).Delete();

    // ── Containers ───────────────────────────────────────────────────────────

    public async Task<List<ContainerDto>> GetContainersAsync()
    {
        var response = await _client.From<Container>().Order("label", Supabase.Postgrest.Constants.Ordering.Ascending).Get();
        var dtos = new List<ContainerDto>();
        foreach (var c in response.Models)
        {
            var dto = await GetContainerByIdAsync(c.Id);
            if (dto != null) dtos.Add(dto);
        }
        return dtos;
    }

    public async Task<ContainerDto?> GetContainerByIdAsync(string id)
    {
        var response = await _client.From<Container>().Where(c => c.Id == id).Single();
        if (response == null) return null;

        var shelf = await _client.From<Shelf>().Where(s => s.Id == response.ShelfId).Single();

        var dto = new ContainerDto 
        { 
            Id = response.Id, 
            Label = response.Label, 
            ShelfId = response.ShelfId, 
            ShelfLabel = shelf?.Label,
            Notes = response.Notes,
            CreatedAt = DateTime.SpecifyKind(response.CreatedAt, DateTimeKind.Utc) 
        };

        var stockResponse = await _client.From<ArticleStock>().Where(s => s.ContainerId == id).Get();
        foreach (var s in stockResponse.Models)
        {
            var art = await _client.From<Article>().Where(a => a.Id == s.ArticleId).Single();
            dto.Articles.Add(new ArticleStockDto 
            { 
                Id = s.Id, 
                ArticleId = s.ArticleId, 
                ArticleName = art?.Name,
                ContainerId = id, 
                ContainerLabel = dto.Label,
                ShelfLabel = shelf?.Label,
                Quantity = s.Quantity 
            });
        }

        return dto;
    }

    public async Task<ContainerDto> AddContainerAsync(ContainerDto dto)
    {
        var container = new Container { Label = dto.Label, ShelfId = dto.ShelfId, Notes = dto.Notes, CreatedAt = DateTime.UtcNow };
        var response = await _client.From<Container>().Insert(container);
        return (await GetContainerByIdAsync(response.Models.First().Id))!;
    }

    public async Task<ContainerDto?> UpdateContainerAsync(string id, ContainerDto dto)
    {
        var existing = await _client.From<Container>().Where(c => c.Id == id).Single();
        if (existing == null) return null;
        existing.Label = dto.Label;
        existing.ShelfId = dto.ShelfId;
        existing.Notes = dto.Notes;
        await _client.From<Container>().Update(existing);
        return await GetContainerByIdAsync(id);
    }

    public async Task DeleteContainerAsync(string id) => await _client.From<Container>().Where(c => c.Id == id).Delete();

    public async Task<LookupResultDto?> LookupAsync(string id)
    {
        // Try Article
        var art = await GetArticleByIdAsync(id);
        if (art != null) return new LookupResultDto { Type = "article", Data = art };

        // Try Container
        var cont = await GetContainerByIdAsync(id);
        if (cont != null) return new LookupResultDto { Type = "container", Data = cont };

        // Try Shelf
        var shelf = await GetShelfByIdAsync(id);
        if (shelf != null) return new LookupResultDto { Type = "shelf", Data = shelf };

        return null;
    }

    // ── Movements ─────────────────────────────────────────────────────────────

    public async Task<MovementDto> AddMovementAsync(MovementDto dto)
    {
        var movement = new Movement
        {
            ArticleId = dto.ArticleId,
            ArticleName = dto.ArticleName,
            Type = dto.Type,
            Quantity = dto.Quantity,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
        };

        var response = await _client.From<Movement>().Insert(movement);
        return MapMovement(response.Models.First());
    }

    public async Task<List<MovementDto>> GetMovementsAsync(
        string? articleName = null,
        string? type = null,
        DateTime? from = null,
        DateTime? to = null
    )
    {
        var query = _client
            .From<Movement>()
            .Order("created_at", Supabase.Postgrest.Constants.Ordering.Descending);

        if (!string.IsNullOrWhiteSpace(articleName))
            query = query.Filter(
                "article_name",
                Supabase.Postgrest.Constants.Operator.ILike,
                $"%{articleName}%"
            );

        if (!string.IsNullOrWhiteSpace(type))
            query = query.Filter("type", Supabase.Postgrest.Constants.Operator.Equals, type);

        if (from.HasValue)
            query = query.Filter(
                "created_at",
                Supabase.Postgrest.Constants.Operator.GreaterThanOrEqual,
                from.Value.ToString("O")
            );

        if (to.HasValue)
            query = query.Filter(
                "created_at",
                Supabase.Postgrest.Constants.Operator.LessThanOrEqual,
                to.Value.ToString("O")
            );

        var response = await query.Get();
        return response.Models.Select(MapMovement).ToList();
    }

    public async Task<List<MovementDto>> GetMovementsByArticleIdAsync(
        string articleId,
        int limit = 10
    )
    {
        var response = await _client
            .From<Movement>()
            .Filter("article_id", Supabase.Postgrest.Constants.Operator.Equals, articleId)
            .Order("created_at", Supabase.Postgrest.Constants.Ordering.Descending)
            .Limit(limit)
            .Get();

        return response.Models.Select(MapMovement).ToList();
    }

    // ── Storage ───────────────────────────────────────────────────────────────

    public async Task<string> UploadPhotoAsync(IFormFile file, string articleId)
    {
        const string bucket = "article-photos";
        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{articleId}-{Guid.NewGuid():N}{extension}";

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        var bytes = ms.ToArray();

        await _client
            .Storage.From(bucket)
            .Upload(
                bytes,
                fileName,
                new Supabase.Storage.FileOptions { ContentType = file.ContentType, Upsert = true }
            );

        var publicUrl = _client.Storage.From(bucket).GetPublicUrl(fileName);
        return publicUrl;
    }

    public async Task DeletePhotoAsync(string photoUrl)
    {
        if (string.IsNullOrWhiteSpace(photoUrl)) return;

        const string bucket = "article-photos";
        try
        {
            var uri = new Uri(photoUrl);
            var pathSegments = uri.AbsolutePath.Split('/');
            var fileName = pathSegments.LastOrDefault();

            if (!string.IsNullOrEmpty(fileName))
            {
                await _client.Storage.From(bucket).Remove(new List<string> { fileName });
                _logger.LogInformation($"Deleted photo {fileName} from bucket {bucket}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting photo from url {photoUrl}");
        }
    }

    // ── Mappers ───────────────────────────────────────────────────────────────

    private static ArticleDto MapArticle(Article a) =>
        new()
        {
            Id = a.Id,
            Name = a.Name,
            PhotoUrl = a.PhotoUrl,
            Notes = a.Notes,
            CreatedAt = DateTime.SpecifyKind(a.CreatedAt, DateTimeKind.Utc),
            Stock = new List<ArticleStockDto>() 
        };

    private static ArticleStockDto MapStock(ArticleStock s) =>
        new()
        {
            Id = s.Id,
            ArticleId = s.ArticleId,
            ContainerId = s.ContainerId,
            Quantity = s.Quantity,
        };

    private static MovementDto MapMovement(Movement m) =>
        new()
        {
            Id = m.Id,
            ArticleId = m.ArticleId,
            ArticleName = m.ArticleName,
            Type = m.Type,
            Quantity = m.Quantity,
            Notes = m.Notes,
            CreatedAt = DateTime.SpecifyKind(m.CreatedAt, DateTimeKind.Utc),
        };

    // ── Helpers ───────────────────────────────────────────────────────────────

    private class ArticleIdComparer : IEqualityComparer<Article>
    {
        public bool Equals(Article? x, Article? y) => x?.Id == y?.Id;

        public int GetHashCode(Article obj) => obj.Id.GetHashCode();
    }
}
