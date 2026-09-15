using SingglebeeApi.DTOs.Carts;

namespace SingglebeeApi.Services
{
    public interface ICartService
    {
        Task<(bool success, CartDto? cart, string? error)> GetOrCreateCartAsync(Guid userId);
        Task<(bool success, CartDto? cart, string? error)> AddToCartAsync(Guid userId, AddToCartDto addToCartDto);
        Task<(bool success, CartDto? cart, string? error)> UpdateCartItemAsync(Guid userId, Guid productId, int quantity);
        Task<(bool success, string? error)> RemoveFromCartAsync(Guid userId, Guid productId);
        Task<(bool success, string? error)> ClearCartAsync(Guid userId);
    }
}
