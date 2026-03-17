using cashly.src.DTOs;
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
        var response = await userService.GenerateTokens(newUser);
        return StatusCode(201, response);
    }

    [HttpPost("signin")]
    public async Task<ActionResult<UserLoginResponseDto>> SignIn([FromBody] UserLoginDto dto)
    {
        var user = await userService.SignIn(dto);
        var response = await userService.GenerateTokens(user);
        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<UserLoginResponseDto>> Refresh([FromBody] RefreshTokenRequestDto dto)
    {
        try
        {
            var response = await userService.RefreshToken(dto.RefreshToken);
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "invalid-refresh-token" });
        }
    }
}
