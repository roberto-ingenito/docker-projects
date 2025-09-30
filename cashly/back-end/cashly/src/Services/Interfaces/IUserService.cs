using cashly.src.Data.Entities;
using cashly.src.DTOs;

namespace cashly.src.Services.Interfaces;

public interface IUserService
{

    Task<User> SignUp(UserCreateDto dto);

    Task<User> SignIn(UserLoginDto dto);

    Task Delete(int userId);

    string GenerateJwtToken(User user);

}