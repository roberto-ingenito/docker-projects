using cashly.src.DTOs;
using cashly.src.Extensions;
using cashly.src.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cashly.src.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpPost("signup")]
    public async Task<ActionResult<UserLoginResponseDto>> SignUp([FromBody] UserCreateDto dto)
    {
        try
        {
            var newUser = await userService.SignUp(dto);

            UserLoginResponseDto userResponse = new()
            {
                User = newUser.ToDto(),
                Token = userService.GenerateJwtToken(newUser)
            };

            return StatusCode(201, userResponse);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message }); // 409
        }
        catch (Exception ex)
        {
            // Gestisce qualsiasi altro errore inaspettato
            return StatusCode(500, new { message = "Si è verificato un errore interno.", error = ex.Message });
        }
    }

    [HttpPost("signin")]
    public async Task<ActionResult<UserLoginResponseDto>> SignIn([FromBody] UserLoginDto dto)
    {
        try
        {
            // Chiama il servizio per tentare il login
            var user = await userService.SignIn(dto);


            UserLoginResponseDto userResponse = new()
            {
                User = user.ToDto(),
                Token = userService.GenerateJwtToken(user)
            };


            return Ok(userResponse); // 200
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message }); // 409
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Si è verificato un errore interno.", error = ex.Message });
        }
    }
}

