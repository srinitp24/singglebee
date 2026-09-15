using SingglebeeApi.DTOs.Auth;

namespace SingglebeeApi.Services
{
    public interface IAuthService
    {
        Task<(bool success, AuthResponseDto? response, string? error)> RegisterAsync(RegisterDto registerDto);
        Task<(bool success, AuthResponseDto? response, string? error)> LoginAsync(LoginDto loginDto);
        Task<(bool success, string? error)> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task<(bool success, string? error)> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    }
}
