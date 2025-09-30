using cashly.src.Data.Entities;
using cashly.src.DTOs;

namespace cashly.src.Services.Interfaces;

public interface IAccountService
{
    Task<Account> Create(AccountCreateDto accountDto, int userId);
    Task<IEnumerable<Account>> GetByUserId(int userId);
    Task<Account?> GetById(int accountId, int userId);
    Task<Account?> Update(int accountId, AccountUpdateDto accountDto, int userId);
    Task<bool> Delete(int accountId, int userId);
}