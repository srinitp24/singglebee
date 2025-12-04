using Microsoft.EntityFrameworkCore;
using SingglebeeApi.Data;
using SingglebeeApi.DTOs.Auth;
using SingglebeeApi.DTOs.Users;

namespace SingglebeeApi.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(ApplicationDbContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<(bool success, UserDto? user, string? error)> GetUserByIdAsync(Guid userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return (false, null, "User not found");
                }

                var userDto = new UserDto
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
                };

                return (true, userDto, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by ID");
                return (false, null, "An error occurred while retrieving user");
            }
        }

        public async Task<(bool success, UserDto? user, string? error)> UpdateProfileAsync(Guid userId, UpdateProfileDto updateProfileDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return (false, null, "User not found");
                }

                // Update user properties
                user.Name = updateProfileDto.Name;
                user.Phone = updateProfileDto.Phone;
                user.Address = updateProfileDto.Address;
                user.City = updateProfileDto.City;
                user.State = updateProfileDto.State;
                user.PostalCode = updateProfileDto.PostalCode;
                user.Country = updateProfileDto.Country;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var userDto = new UserDto
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
                };

                _logger.LogInformation("User profile updated successfully: {UserId}", userId);
                return (true, userDto, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile");
                return (false, null, "An error occurred while updating profile");
            }
        }
    }
}
