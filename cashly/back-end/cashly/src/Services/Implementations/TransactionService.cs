using cashly.src.Data;
using cashly.src.Data.Entities;
using cashly.src.DTOs;
using cashly.src.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cashly.src.Services.Implementations;

public class TransactionService(AppDbContext context) : ITransactionService
{
    public async Task<Transaction> CreateTransactionAsync(TransactionCreateDto transactionDto, int userId)
    {
        // 1. Ottieni la strategia di esecuzione dal DbContext
        var strategy = context.Database.CreateExecutionStrategy();

        // 2. Esegui il tuo codice all'interno della strategia
        return await strategy.ExecuteAsync(async () =>
        {
            // Iniziamo una transazione di database. O va tutto a buon fine, o non viene salvato nulla.
            await using var dbTransaction = await context.Database.BeginTransactionAsync();

            try
            {
                // 1. Controlla l'utente esista all'utente
                User? user = await context.Users.Where(u => u.UserId == userId).SingleOrDefaultAsync() ?? throw new InvalidOperationException("user-not-found");

                if (transactionDto.CategoryId is not null && !await context.Categories.AnyAsync(c => c.CategoryId == transactionDto.CategoryId && c.UserId == userId))
                    throw new InvalidOperationException("category-not-found");

                // 2. Crea la nuova entità Transaction
                Transaction newTransaction = new()
                {
                    Amount = transactionDto.Amount,
                    Type = transactionDto.Type,
                    TransactionDate = transactionDto.TransactionDate.ToUniversalTime(),
                    Description = transactionDto.Description,
                    CategoryId = transactionDto.CategoryId,
                    UserId = userId,
                };

                // 3. Aggiorna il saldo
                switch (newTransaction.Type)
                {
                    case TransactionType.income:
                        user.CurrentBalance += newTransaction.Amount;
                        break;
                    case TransactionType.expense:
                        user.CurrentBalance -= newTransaction.Amount;
                        break;
                }

                // 4. Aggiungi la transazione e salva tutte le modifiche (sia alla transazione che al saldo)
                context.Transactions.Add(newTransaction);
                await context.SaveChangesAsync();

                // 5. Se tutto è andato bene, conferma la transazione di database
                await dbTransaction.CommitAsync();

                return newTransaction;
            }
            catch (Exception)
            {
                // Se qualcosa va storto, annulla tutte le modifiche
                await dbTransaction.RollbackAsync();
                throw; // Rilancia l'eccezione per essere gestita a un livello superiore
            }
        });
    }

    public async Task<IEnumerable<Transaction>> GetTransactionsByUserIdAsync(int userId)
    {
        return await context.Transactions
            .Include(t => t.Category) // Includi i dati della categoria
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.TransactionDate)
            .ToListAsync();
    }
}

