using SingglebeeApi.DTOs.Auth;
using SingglebeeApi.DTOs.Users;

namespace SingglebeeApi.Services
{
    public interface IUserService
    {
        Task<(bool success, UserDto? user, string? error)> UpdateProfileAsync(Guid userId, UpdateProfileDto updateProfileDto);
        Task<(bool success, UserDto? user, string? error)> GetUserByIdAsync(Guid userId);
    }
}
