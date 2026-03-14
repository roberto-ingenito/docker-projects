using cashly.src.DTOs;
using cashly.src.Extensions;
using cashly.src.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cashly.src.Controllers;

[ApiController]
[AllowAnonymous]
[Route("[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpPost("signup")]
    public async Task<ActionResult<UserLoginResponseDto>> SignUp([FromBody] UserCreateDto dto)
    {
        var newUser = await userService.SignUp(dto);

        UserLoginResponseDto userResponse = new() { User = newUser.ToDto(), Token = userService.GenerateJwtToken(newUser) };

        return StatusCode(201, userResponse);
    }

    [HttpPost("signin")]
    public async Task<ActionResult<UserLoginResponseDto>> SignIn([FromBody] UserLoginDto dto)
    {
        // Chiama il servizio per tentare il login
        var user = await userService.SignIn(dto);

        UserLoginResponseDto userResponse = new() { User = user.ToDto(), Token = userService.GenerateJwtToken(user) };

        return Ok(userResponse); // 200
    }
}
