using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SingglebeeApi.DTOs.Auth;
using SingglebeeApi.DTOs.Common;
using SingglebeeApi.DTOs.Users;
using SingglebeeApi.Services;
using System.Security.Claims;

namespace SingglebeeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            var (success, user, error) = await _userService.GetUserByIdAsync(userId);

            if (!success)
            {
                return NotFound(ApiResponse<UserDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<UserDto>.SuccessResponse(user!, "User retrieved successfully"));
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<UserDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            var (success, user, error) = await _userService.UpdateProfileAsync(userId, updateProfileDto);

            if (!success)
            {
                return BadRequest(ApiResponse<UserDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<UserDto>.SuccessResponse(user!, "Profile updated successfully"));
        }
    }
}
