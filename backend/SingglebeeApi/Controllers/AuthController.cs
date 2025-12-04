using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SingglebeeApi.DTOs.Auth;
using SingglebeeApi.DTOs.Common;
using SingglebeeApi.Services;

namespace SingglebeeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, response, error) = await _authService.RegisterAsync(registerDto);

            if (!success)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(response!, "User registered successfully"));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, response, error) = await _authService.LoginAsync(loginDto);

            if (!success)
            {
                return Unauthorized(ApiResponse<AuthResponseDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(response!, "Login successful"));
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, error) = await _authService.ForgotPasswordAsync(forgotPasswordDto);

            if (!success)
            {
                return BadRequest(ApiResponse.ErrorResponse(error!));
            }

            return Ok(ApiResponse.SuccessResponse("Password reset instructions sent to your email"));
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, error) = await _authService.ResetPasswordAsync(resetPasswordDto);

            if (!success)
            {
                return BadRequest(ApiResponse.ErrorResponse(error!));
            }

            return Ok(ApiResponse.SuccessResponse("Password reset successful"));
        }
    }
}
