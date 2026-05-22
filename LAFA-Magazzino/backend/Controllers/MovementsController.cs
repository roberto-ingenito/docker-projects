using Microsoft.AspNetCore.Mvc;
using WarehouseApi.Services;

namespace WarehouseApi.Controllers;

[ApiController]
[Route("api/movements")]
public class MovementsController : ControllerBase
{
    private readonly SupabaseService _supabase;

    public MovementsController(SupabaseService supabase)
    {
        _supabase = supabase;
    }

    // GET /api/movements?articleName=&type=&from=&to=
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? articleName,
        [FromQuery] string? type,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to
    )
    {
        var movements = await _supabase.GetMovementsAsync(articleName, type, from, to);
        return Ok(movements);
    }
}
