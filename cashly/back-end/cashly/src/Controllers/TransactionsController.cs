using cashly.src.Data.Entities;
using cashly.src.DTOs;
using cashly.src.Extensions;
using cashly.src.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cashly.src.Controllers;

[ApiController]
[Authorize]
[Route("Accounts/{accountId}/[controller]")] // <-- Rotta annidata
public class TransactionsController(ITransactionService transactionService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<Transaction>> CreateTransaction(int accountId, [FromBody] TransactionCreateDto createTransactionDto)
    {
        var userId = User.GetUserId();
        Transaction newTransaction;

        try
        {
            newTransaction = await transactionService.CreateTransactionAsync(accountId, createTransactionDto, userId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        return Ok(newTransaction.ToDto());
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetTransactions(int accountId)
    {
        var userId = User.GetUserId();

        IEnumerable<Transaction> transactions;

        try
        {
            transactions = await transactionService.GetTransactionsByAccountIdAsync(accountId, userId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        var transactionResponse = transactions.Select(t => t.ToDto());

        return Ok(transactionResponse);
    }
}