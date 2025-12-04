using SingglebeeApi.DTOs.Orders;

namespace SingglebeeApi.Services
{
    public interface IOrderService
    {
        Task<(bool success, OrderDto? order, string? error)> CreateOrderAsync(Guid userId, CreateOrderDto createOrderDto);
        Task<(bool success, OrderDto? order, string? error)> GetOrderByIdAsync(Guid orderId, Guid userId, bool isAdmin);
        Task<(bool success, List<OrderDto> orders, string? error)> GetUserOrdersAsync(Guid userId);
        Task<(bool success, List<OrderDto> orders, string? error)> GetAllOrdersAsync();
        Task<(bool success, OrderDto? order, string? error)> UpdateOrderStatusAsync(Guid orderId, UpdateOrderStatusDto updateStatusDto);
        Task<(bool success, string? error)> CancelOrderAsync(Guid orderId, Guid userId, bool isAdmin);
    }
}
