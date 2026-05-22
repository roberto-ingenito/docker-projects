using Microsoft.AspNetCore.Mvc;
using WarehouseApi.DTOs;
using WarehouseApi.Services;

namespace WarehouseApi.Controllers;

[ApiController]
[Route("api/shelves")]
public class ShelvesController : ControllerBase
{
    private readonly SupabaseService _supabase;

    public ShelvesController(SupabaseService supabase)
    {
        _supabase = supabase;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _supabase.GetShelvesAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var shelf = await _supabase.GetShelfByIdAsync(id);
        return shelf == null ? NotFound() : Ok(shelf);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ShelfDto dto) => Ok(await _supabase.AddShelfAsync(dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ShelfDto dto)
    {
        var updated = await _supabase.UpdateShelfAsync(id, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _supabase.DeleteShelfAsync(id);
        return NoContent();
    }
}
