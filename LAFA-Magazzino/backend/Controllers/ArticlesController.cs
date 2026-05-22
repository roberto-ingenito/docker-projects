using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WarehouseApi.DTOs;
using WarehouseApi.Hubs;
using WarehouseApi.Services;

namespace WarehouseApi.Controllers;

[ApiController]
[Route("api/articles")]
public class ArticlesController : ControllerBase
{
    private readonly SupabaseService _supabase;
    private readonly IHubContext<WarehouseHub> _hub;

    public ArticlesController(SupabaseService supabase, IHubContext<WarehouseHub> hub)
    {
        _supabase = supabase;
        _hub = hub;
    }

    // GET /api/articles
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var articles = await _supabase.GetArticlesAsync();
        return Ok(articles);
    }

    // GET /api/articles/search?q=
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return await GetAll();

        var results = await _supabase.SearchArticlesAsync(q);
        return Ok(results);
    }

    // GET /api/articles/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var article = await _supabase.GetArticleByIdAsync(id);
        if (article == null)
            return NotFound(new { message = "Article not found." });
        return Ok(article);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ArticleDto dto)
    {
        try
        {
            var created = await _supabase.AddArticleAsync(dto);
            await _hub.Clients.All.SendAsync("ArticleAdded", created);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            var msg = ex.Message.ToLower();
            if (msg.Contains("duplicate key value") || msg.Contains("23505"))
            {
                return BadRequest(new { message = "Conflitto: un record con lo stesso identificativo esiste già." });
            }
            return BadRequest(new { message = "Errore durante il salvataggio: " + ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ArticleDto dto)
    {
        try
        {
            var existing = await _supabase.GetArticleByIdAsync(id);
            if (existing == null)
                return NotFound(new { message = "Article not found." });

            // se la foto viene rimossa o modificata (nuova e vecchia discordano),
            // in realtà in Update del frontend viene modificato dto ma per ora gestiamo se viene rimossa (diventa stringa vuota)
            if (string.IsNullOrWhiteSpace(dto.PhotoUrl) && !string.IsNullOrWhiteSpace(existing.PhotoUrl))
            {
                await _supabase.DeletePhotoAsync(existing.PhotoUrl);
            }

            var updated = await _supabase.UpdateArticleAsync(id, dto);
            if (updated == null)
                return NotFound(new { message = "Article not found." });
            await _hub.Clients.All.SendAsync("ArticleUpdated", updated);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            var msg = ex.Message.ToLower();
            if (msg.Contains("duplicate key value") || msg.Contains("23505"))
            {
                return BadRequest(new { message = "Conflitto: un record con lo stesso identificativo esiste già." });
            }
            return BadRequest(new { message = "Errore durante il aggiornamento: " + ex.Message });
        }
    }

    // DELETE /api/articles/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var existing = await _supabase.GetArticleByIdAsync(id);
        if (existing != null && !string.IsNullOrWhiteSpace(existing.PhotoUrl))
        {
            await _supabase.DeletePhotoAsync(existing.PhotoUrl);
        }

        await _supabase.DeleteArticleAsync(id);
        await _hub.Clients.All.SendAsync("ArticleDeleted", new { id });
        return NoContent();
    }

    // POST /api/articles/{id}/photo
    [HttpPost("{id}/photo")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB
    public async Task<IActionResult> UploadPhoto(string id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        var article = await _supabase.GetArticleByIdAsync(id);
        if (article == null)
            return NotFound(new { message = "Article not found." });

        if (!string.IsNullOrWhiteSpace(article.PhotoUrl))
        {
            await _supabase.DeletePhotoAsync(article.PhotoUrl);
        }

        var photoUrl = await _supabase.UploadPhotoAsync(file, article.Id!);

        article.PhotoUrl = photoUrl;
        var updated = await _supabase.UpdateArticleAsync(id, article);
        if (updated != null)
            await _hub.Clients.All.SendAsync("ArticleUpdated", updated);

        return Ok(new { photoUrl });
    }

    // GET /api/articles/{id}/movements
    [HttpGet("{id}/movements")]
    public async Task<IActionResult> GetMovements(string id)
    {
        var movements = await _supabase.GetMovementsByArticleIdAsync(id, 10);
        return Ok(movements);
    }
}
