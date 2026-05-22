using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WarehouseApi.DTOs;
using WarehouseApi.Hubs;
using WarehouseApi.Services;

namespace WarehouseApi.Controllers;

[ApiController]
[Route("api/scan")]
public class ScanController : ControllerBase
{
    private readonly SupabaseService _supabase;
    private readonly IHubContext<WarehouseHub> _hub;

    public ScanController(SupabaseService supabase, IHubContext<WarehouseHub> hub)
    {
        _supabase = supabase;
        _hub = hub;
    }

    // GET /api/scan/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> Lookup(string id)
    {
        var result = await _supabase.LookupAsync(id);
        if (result == null) return NotFound(new { message = "Identificativo non trovato." });
        return Ok(result);
    }

    // POST /api/scan/action
    [HttpPost("action")]
    public async Task<IActionResult> Action([FromBody] ScanActionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.ContainerId))
            return BadRequest(new { message = "containerId is required." });

        if (dto.Type != "LOAD" && dto.Type != "UNLOAD")
            return BadRequest(new { message = "type must be 'LOAD' or 'UNLOAD'." });

        if (dto.Quantity <= 0)
            return BadRequest(new { message = "quantity must be > 0." });

        // 1. Resolve article
        ArticleDto? article = null;
        if (!string.IsNullOrWhiteSpace(dto.ArticleId))
        {
            article = await _supabase.GetArticleByIdAsync(dto.ArticleId);
        }
        else
        {
            // Se ArticleId non è fornito, cerchiamo gli articoli nel contenitore
            var list = await _supabase.GetArticlesByContainerIdAsync(dto.ContainerId);
            if (list.Count == 1)
            {
                article = list[0];
            }
            else if (list.Count > 1)
            {
                return BadRequest(new { message = "Il contenitore contiene più articoli. Specificare articleId." });
            }
        }

        if (article == null)
            return NotFound(new { message = $"Nessun articolo trovato per il contenitore specificato." });

        // 2. Prevent negative stock
        var stockEntry = article.Stock.FirstOrDefault(s => s.ContainerId == dto.ContainerId);
        if (stockEntry == null)
        {
            return NotFound(new { message = $"L'articolo non risulta presente nel contenitore specificato." });
        }

        if (dto.Type == "UNLOAD" && dto.Quantity > stockEntry.Quantity)
        {
            return BadRequest(new { message = $"Quantità insufficiente nel contenitore. Giacenza attuale: {stockEntry.Quantity}." });
        }

        // 3. Compute delta (+/-)
        var delta = dto.Type == "LOAD" ? dto.Quantity : -dto.Quantity;

        // 4. Update quantity
        await _supabase.UpdateQuantityAsync(article.Id!, dto.ContainerId, delta);

        // 5. Fetch updated article
        var updatedArticle = await _supabase.GetArticleByIdAsync(article.Id!);

        // 6. Insert movement record
        var movement = await _supabase.AddMovementAsync(
            new MovementDto
            {
                ArticleId = article.Id!,
                ArticleName = article.Name,
                Type = dto.Type,
                Quantity = dto.Quantity,
                Notes = dto.Notes,
            }
        );

        // 7. Broadcast via SignalR
        await _hub.Clients.All.SendAsync("ArticleQuantityUpdated", updatedArticle);
        await _hub.Clients.All.SendAsync("MovementAdded", movement);

        // 8. Return result
        return Ok(new ScanActionResultDto { Article = updatedArticle!, Movement = movement });
    }
}
