using SingglebeeApi.DTOs.Auth;

namespace SingglebeeApi.Services
{
    public interface IOtpService
    {
        Task<(bool success, string? error)> SendOtpAsync(string phoneNumber, string purpose, Guid? userId = null);
        Task<(bool success, Guid? userId, string? error)> VerifyOtpAsync(string phoneNumber, string otpCode, string purpose);
        Task<bool> CleanupExpiredOtpsAsync();
    }
}
