using cashly.src.Data;
using cashly.src.Data.Entities;
using cashly.src.DTOs;
using cashly.src.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cashly.src.Services.Implementations;

public class AccountService(AppDbContext context) : IAccountService
{
    public async Task<Account> Create(AccountCreateDto accountDto, int userId)
    {
        Account newAccount = new()
        {
            AccountName = accountDto.AccountName,
            InitialBalance = accountDto.InitialBalance,
            CurrentBalance = accountDto.InitialBalance, // All'inizio, il saldo corrente è quello iniziale
            UserId = userId
        };

        context.Accounts.Add(newAccount);
        await context.SaveChangesAsync();

        return newAccount;
    }

    public async Task<IEnumerable<Account>> GetByUserId(int userId)
    {
        return await context.Accounts
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }

    public async Task<Account?> GetById(int accountId, int userId)
    {
        return await context.Accounts.FirstOrDefaultAsync(a => a.AccountId == accountId && a.UserId == userId);
    }

    public async Task<Account?> Update(int accountId, AccountUpdateDto accountDto, int userId)
    {
        Account? account = await GetById(accountId, userId);

        if (account == null)
            return null; // Conto non trovato o non appartenente all'utente

        if (accountDto.AccountName != null)
            account.AccountName = accountDto.AccountName;

        await context.SaveChangesAsync();
        return account;
    }

    public async Task<bool> Delete(int accountId, int userId)
    {
        Account? account = await GetById(accountId, userId);

        if (account == null)
            return false; // Conto non trovato o non appartenente all'utente

        context.Accounts.Remove(account);
        await context.SaveChangesAsync();

        return true;
    }
}