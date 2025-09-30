using cashly.src.Data;
using cashly.src.Data.Entities;
using cashly.src.DTOs;
using cashly.src.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cashly.src.Services.Implementations;

public class CategoryService(AppDbContext dbContext) : ICategoryService
{
    public async Task<Category> Create(CategoryCreateDto dto, int userId)
    {
        Category newCategory = new()
        {
            CategoryName = dto.CategoryName,
            IconName = dto.IconName,
            ColorHex = dto.ColorHex,
            UserId = userId,
        };

        dbContext.Categories.Add(newCategory);

        await dbContext.SaveChangesAsync();

        return newCategory;
    }

    public async Task Delete(int categoryId, int userId)
    {
        await dbContext.Categories
            .Where(c => c.CategoryId == categoryId && c.UserId == userId)
            .ExecuteDeleteAsync();
    }

    public async Task<IEnumerable<Category>> GetAll(int userId)
    {
        return await dbContext.Categories.Where(c => c.UserId == userId).ToListAsync();
    }
}