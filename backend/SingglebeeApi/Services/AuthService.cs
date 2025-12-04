using Microsoft.EntityFrameworkCore;
using SingglebeeApi.Data;
using SingglebeeApi.DTOs.Auth;
using SingglebeeApi.Models;

namespace SingglebeeApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ApplicationDbContext context,
            ITokenService tokenService,
            ILogger<AuthService> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _logger = logger;
        }

        public async Task<(bool success, AuthResponseDto? response, string? error)> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == registerDto.Email.ToLower());

                if (existingUser != null)
                {
                    return (false, null, "User with this email already exists");
                }

                // Hash password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                // Create new user
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Name = registerDto.Name,
                    Email = registerDto.Email.ToLower(),
                    HashedPassword = hashedPassword,
                    Role = "customer",
                    Phone = registerDto.Phone,
                    IsActive = true,
                    EmailVerified = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Generate tokens
                var accessToken = _tokenService.GenerateAccessToken(user.Id, user.Email, user.Role);
                var refreshToken = _tokenService.GenerateRefreshToken();

                var response = new AuthResponseDto
                {
                    Token = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                    User = new UserDto
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Role = user.Role,
                        Phone = user.Phone,
                        Address = user.Address,
                        City = user.City,
                        State = user.State,
                        PostalCode = user.PostalCode,
                        Country = user.Country,
                        EmailVerified = user.EmailVerified
                    }
                };

                _logger.LogInformation("User registered successfully: {Email}", user.Email);
                return (true, response, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return (false, null, "An error occurred during registration");
            }
        }

        public async Task<(bool success, AuthResponseDto? response, string? error)> LoginAsync(LoginDto loginDto)
        {
            try
            {
                // Find user by email
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == loginDto.Email.ToLower());

                if (user == null)
                {
                    return (false, null, "Invalid email or password");
                }

                // Check if user is active
                if (!user.IsActive)
                {
                    return (false, null, "Account is deactivated. Please contact support.");
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.HashedPassword))
                {
                    return (false, null, "Invalid email or password");
                }

                // Generate tokens
                var accessToken = _tokenService.GenerateAccessToken(user.Id, user.Email, user.Role);
                var refreshToken = _tokenService.GenerateRefreshToken();

                var response = new AuthResponseDto
                {
                    Token = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                    User = new UserDto
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Role = user.Role,
                        Phone = user.Phone,
                        EmailVerified = user.EmailVerified
                    }
                };

                _logger.LogInformation("User logged in successfully: {Email}", user.Email);
                return (true, response, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login");
                return (false, null, "An error occurred during login");
            }
        }

        public async Task<(bool success, string? error)> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == forgotPasswordDto.Email.ToLower());

                if (user == null)
                {
                    // Don't reveal if user exists - security best practice
                    _logger.LogInformation("Password reset requested for non-existent email: {Email}", forgotPasswordDto.Email);
                    return (true, null);
                }

                if (!user.IsActive)
                {
                    return (false, "Account is deactivated. Please contact support.");
                }

                // Generate reset token
                var resetToken = _tokenService.GeneratePasswordResetToken();
                var expiresAt = DateTime.UtcNow.AddHours(1);

                // Save token to database
                var passwordResetToken = new PasswordResetToken
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    Token = resetToken,
                    ExpiresAt = expiresAt,
                    Used = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.PasswordResetTokens.Add(passwordResetToken);

                // Also update user record for backward compatibility
                user.ResetToken = resetToken;
                user.ResetTokenExpires = expiresAt;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // TODO: Send email with reset link
                // Email content: https://yourdomain.com/reset-password?token={resetToken}&email={user.Email}
                _logger.LogInformation("Password reset token generated for user: {Email}", user.Email);
                
                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during forgot password");
                return (false, "An error occurred while processing your request");
            }
        }

        public async Task<(bool success, string? error)> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == resetPasswordDto.Email.ToLower());

                if (user == null)
                {
                    return (false, "Invalid reset request");
                }

                // Check token in password_reset_tokens table
                var tokenRecord = await _context.PasswordResetTokens
                    .FirstOrDefaultAsync(t => 
                        t.UserId == user.Id && 
                        t.Token == resetPasswordDto.Token &&
                        !t.Used);

                if (tokenRecord == null)
                {
                    return (false, "Invalid or expired reset token");
                }

                if (tokenRecord.ExpiresAt < DateTime.UtcNow)
                {
                    return (false, "Reset token has expired");
                }

                // Hash new password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);

                // Update user password
                user.HashedPassword = hashedPassword;
                user.ResetToken = null;
                user.ResetTokenExpires = null;
                user.UpdatedAt = DateTime.UtcNow;

                // Mark token as used
                tokenRecord.Used = true;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Password reset successfully for user: {Email}", user.Email);
                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset");
                return (false, "An error occurred while resetting password");
            }
        }
    }
}
