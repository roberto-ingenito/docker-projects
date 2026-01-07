using Microsoft.AspNetCore.Mvc;
using MrWhite.Backend.Services;

namespace MrWhite.Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WordsController(WordService wordService) : ControllerBase
    {
        [HttpGet("categories")]
        public ActionResult<List<string>> GetCategories()
        {
            return Ok(wordService.Categories());
        }
    }
}
