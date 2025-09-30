using cashly.src.Data;
using cashly.src.Data.Entities;
using cashly.src.DTOs;
using cashly.src.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cashly.src.Services.Implementations;

public class TransactionService(AppDbContext context) : ITransactionService
{
    public async Task<Transaction> CreateTransactionAsync(int accountId, TransactionCreateDto transactionDto, int userId)
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
                // 1. Controlla che il conto esista e appartenga all'utente
                Account? account = await context.Accounts.Where(a => a.AccountId == accountId).SingleOrDefaultAsync();
                if (account == null)
                {
                    throw new InvalidOperationException("account-not-found");
                }
                else if (account.UserId != userId)
                {
                    throw new InvalidOperationException("not-account-owner");
                }

                // 2. Crea la nuova entità Transaction
                Transaction newTransaction = new()
                {
                    Amount = transactionDto.Amount,
                    Type = transactionDto.Type,
                    TransactionDate = transactionDto.TransactionDate.ToUniversalTime(),
                    Description = transactionDto.Description,
                    AccountId = accountId,
                    CategoryId = transactionDto.CategoryId
                };

                // 3. Aggiorna il saldo del conto in base al tipo di transazione
                switch (newTransaction.Type)
                {
                    case TransactionType.income:
                        account.CurrentBalance += newTransaction.Amount;
                        break;
                    case TransactionType.expense:
                        account.CurrentBalance -= newTransaction.Amount;
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

    public async Task<IEnumerable<Transaction>> GetTransactionsByAccountIdAsync(int accountId, int userId)
    {
        // Verifica che l'utente abbia accesso al conto prima di restituire le transazioni
        Account? account = await context.Accounts.Where(a => a.AccountId == accountId).SingleOrDefaultAsync();
        if (account == null)
        {
            throw new InvalidOperationException("account-not-found");
        }
        else if (account.UserId != userId)
        {
            throw new InvalidOperationException("not-account-owner");
        }

        return await context.Transactions
            .Include(t => t.Category) // Includi i dati della categoria
            .Where(t => t.AccountId == accountId)
            .OrderByDescending(t => t.TransactionDate)
            .ToListAsync();
    }
}

