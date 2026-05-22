using Microsoft.AspNetCore.Mvc;
using WarehouseApi.DTOs;
using WarehouseApi.Services;

namespace WarehouseApi.Controllers;

[ApiController]
[Route("api/containers")]
public class ContainersController : ControllerBase
{
    private readonly SupabaseService _supabase;

    public ContainersController(SupabaseService supabase)
    {
        _supabase = supabase;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _supabase.GetContainersAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var container = await _supabase.GetContainerByIdAsync(id);
        return container == null ? NotFound() : Ok(container);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ContainerDto dto) => Ok(await _supabase.AddContainerAsync(dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ContainerDto dto)
    {
        var updated = await _supabase.UpdateContainerAsync(id, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _supabase.DeleteContainerAsync(id);
        return NoContent();
    }
}
