using cashly.src.DTOs;
using cashly.src.Extensions;
using cashly.src.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cashly.src.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class AccountsController(IAccountService accountService) : ControllerBase
{

    // POST /api/accounts
    [HttpPost]
    public async Task<ActionResult<AccountResponseDto>> CreateAccount([FromBody] AccountCreateDto createAccountDto)
    {
        var userId = User.GetUserId();
        var newAccount = await accountService.Create(createAccountDto, userId);

        return StatusCode(201, newAccount.ToDto());
    }

    // GET /api/accounts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AccountResponseDto>>> GetAccounts()
    {
        var userId = User.GetUserId();
        var accounts = await accountService.GetByUserId(userId);

        var accountsResponse = accounts.Select(a => a.ToDto());

        return Ok(accountsResponse); // 200
    }

    // GET /api/accounts/{accountId}
    [HttpGet("{accountId}")]
    public async Task<ActionResult<AccountResponseDto>> GetAccountById(int accountId)
    {
        var userId = User.GetUserId();
        var account = await accountService.GetById(accountId, userId);

        if (account == null)
        {
            return NotFound(); // 404 
        }

        return Ok(account.ToDto()); // 200
    }

    // PUT /api/accounts/{accountId}
    [HttpPut("{accountId}")]
    public async Task<IActionResult> UpdateAccount(int accountId, [FromBody] AccountUpdateDto updateAccountDto)
    {
        var userId = User.GetUserId();
        var updatedAccount = await accountService.Update(accountId, updateAccountDto, userId);

        if (updatedAccount == null)
        {
            return NotFound(); // 404
        }

        return NoContent(); // 204
    }

    // DELETE /api/accounts/{accountId}
    [HttpDelete("{accountId}")]
    public async Task<IActionResult> DeleteAccount(int accountId)
    {
        var userId = User.GetUserId();
        var success = await accountService.Delete(accountId, userId);

        if (!success)
        {
            return NotFound(); // 404
        }

        return NoContent(); // 204
    }
}