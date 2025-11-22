using cashly.src.Data.Entities;
using cashly.src.DTOs;
using cashly.src.Extensions;
using cashly.src.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cashly.src.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class TransactionsController(ITransactionService transactionService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> CreateTransaction([FromBody] TransactionCreateDto createTransactionDto)
    {
        var userId = User.GetUserId();
        Transaction newTransaction;

        try
        {
            newTransaction = await transactionService.CreateTransactionAsync(createTransactionDto, userId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        return Ok(newTransaction.ToDto());
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetTransactions()
    {
        var userId = User.GetUserId();

        IEnumerable<Transaction> transactions;

        try
        {
            transactions = await transactionService.GetTransactionsByUserIdAsync(userId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        var transactionResponse = transactions.Select(t => t.ToDto());

        return Ok(transactionResponse);
    }

    [HttpPut("{transactionId}")]
    public async Task<ActionResult<TransactionResponseDto>> UpdateTransaction(int transactionId, [FromBody] TransactionUpdateDto updateTransactionDto)
    {
        var userId = User.GetUserId();

        try
        {
            var updatedTransaction = await transactionService.UpdateTransactionAsync(transactionId, updateTransactionDto, userId);
            return Ok(updatedTransaction.ToDto()); // 200
        }
        catch (InvalidOperationException ex)
        {
            if (ex.Message == "transaction-not-found")
            {
                return NotFound(new { message = "Transazione non trovata" }); // 404
            }
            if (ex.Message == "category-not-found")
            {
                return BadRequest(new { message = "Categoria non valida" }); // 400
            }
            return BadRequest(new { message = ex.Message }); // 400
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Si è verificato un errore interno" });
        }
    }

    [HttpDelete("{transactionId}")]
    public async Task<IActionResult> DeleteTransactions(int transactionId)
    {
        var userId = User.GetUserId();

        try
        {
            await transactionService.DeleteTransaction(transactionId, userId);

            return NoContent(); // 204 - Eliminazione avvenuta con successo
        }
        catch (InvalidOperationException ex)
        {
            if (ex.Message == "transaction-not-found")
            {
                return NotFound(new { message = "Transazione non trovata" }); // 404
            }
            return BadRequest(new { message = ex.Message }); // 400
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Si è verificato un errore interno" });
        }
    }
}
