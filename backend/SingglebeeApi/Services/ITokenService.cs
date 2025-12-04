namespace SingglebeeApi.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(Guid userId, string email, string role);
        string GenerateRefreshToken();
        string GeneratePasswordResetToken();
        Task<(bool isValid, Guid userId, string email, string role)> ValidateAccessToken(string token);
    }
}
