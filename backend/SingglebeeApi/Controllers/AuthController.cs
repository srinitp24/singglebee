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
        private readonly IOtpService _otpService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthService authService, 
            IOtpService otpService,
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _otpService = otpService;
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

            // ✅ SET HTTP-ONLY COOKIE
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                Path = "/"
            };
            
            Response.Cookies.Append("auth_token", response!.Token, cookieOptions);

            // Remove token from response
            var safeResponse = new AuthResponseDto
            {
                User = response.User,
                Token = string.Empty,
                RefreshToken = string.Empty,
                ExpiresAt = response.ExpiresAt
            };

            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(safeResponse, "User registered successfully"));
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
            // ✅ SET HTTP-ONLY COOKIE with the JWT token
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,                    // Cannot be accessed by JavaScript
                Secure = true,                      // Only sent over HTTPS
                SameSite = SameSiteMode.Lax,       // CSRF protection
                Expires = DateTimeOffset.UtcNow.AddDays(7), // Match token expiry
                Path = "/"
            };
            
            Response.Cookies.Append("auth_token", response!.Token, cookieOptions);

            // ✅ REMOVE token from response body for security
            var safeResponse = new AuthResponseDto
            {
                User = response.User,
                Token = string.Empty, // Don't send token in response
                RefreshToken = string.Empty,
                ExpiresAt = response.ExpiresAt
            };

            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(safeResponse, "Login successful"));
        }

        // Logout method for cookie-based auth
        [HttpPost("logout")]
        [Authorize] // Requires authentication
        public IActionResult Logout()
        {
            // ✅ Clear the HTTP-only cookie
            Response.Cookies.Delete("auth_token", new CookieOptions
            {
                Path = "/",
                SameSite = SameSiteMode.Lax,
                Secure = true
            });

            return Ok(ApiResponse.SuccessResponse("Logged out successfully"));
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

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpDto sendOtpDto)
        {
            _logger.LogInformation("Received send-otp request for phone number: {PhoneNumber}", sendOtpDto.PhoneNumber);
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, error) = await _otpService.SendOtpAsync(
                sendOtpDto.PhoneNumber, 
                sendOtpDto.Purpose);

            if (!success)
            {
                return BadRequest(ApiResponse.ErrorResponse(error!));
            }

            return Ok(ApiResponse.SuccessResponse("OTP sent successfully to your phone"));
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto verifyOtpDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, userId, error) = await _otpService.VerifyOtpAsync(
                verifyOtpDto.PhoneNumber, 
                verifyOtpDto.OtpCode, 
                verifyOtpDto.Purpose);

            if (!success)
            {
                return BadRequest(ApiResponse.ErrorResponse(error!));
            }

            return Ok(ApiResponse.SuccessResponse("OTP verified successfully"));
        }

        [HttpPost("login-otp")]
        public async Task<IActionResult> LoginWithOtp([FromBody] OtpLoginDto otpLoginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, response, error) = await _authService.OtpLoginAsync(otpLoginDto);

            if (!success)
            {
                return Unauthorized(ApiResponse<AuthResponseDto>.ErrorResponse(error!));
            }
            // ✅ SET HTTP-ONLY COOKIE
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                Path = "/"
            };
            
            Response.Cookies.Append("auth_token", response!.Token, cookieOptions);

            // Remove token from response
            var safeResponse = new AuthResponseDto
            {
                User = response.User,
                Token = string.Empty,
                RefreshToken = string.Empty,
                ExpiresAt = response.ExpiresAt
            };
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(safeResponse, "OTP verified and logged in successfully"));
        }
    }
}
