using cashly.src.Data.Entities;
using cashly.src.DTOs;

namespace cashly.src.Services.Interfaces;

public interface ITransactionService
{
    Task<Transaction> CreateTransactionAsync(int accountId, TransactionCreateDto transactionDto, int userId);
    Task<IEnumerable<Transaction>> GetTransactionsByAccountIdAsync(int accountId, int userId);
}