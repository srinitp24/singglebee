using Microsoft.EntityFrameworkCore;
using SingglebeeApi.Data;
using SingglebeeApi.DTOs.Orders;
using SingglebeeApi.Models;

namespace SingglebeeApi.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OrderService> _logger;

        public OrderService(ApplicationDbContext context, ILogger<OrderService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<(bool success, OrderDto? order, string? error)> CreateOrderAsync(Guid userId, CreateOrderDto createOrderDto)
        {
            try
            {
                _logger.LogInformation("CreateOrderAsync - Creating order for UserId: {UserId}", userId);
                
                // Get user's cart
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null || !cart.CartItems.Any())
                {
                    return (false, null, "Cart is empty");
                }

                // Validate stock availability
                foreach (var cartItem in cart.CartItems)
                {
                    if (cartItem.Product.Stock < cartItem.Quantity)
                    {
                        return (false, null, $"Insufficient stock for product: {cartItem.Product.Name}");
                    }
                }

                // Create order
                var order = new Order
                {
                    UserId = userId,
                    OrderNumber = GenerateOrderNumber(),
                    CustomerName = createOrderDto.CustomerName,
                    CustomerEmail = createOrderDto.CustomerEmail,
                    CustomerPhone = createOrderDto.CustomerPhone,
                    ShippingAddress = createOrderDto.ShippingAddress,
                    ShippingCity = createOrderDto.ShippingCity,
                    ShippingState = createOrderDto.ShippingState,
                    ShippingPostalCode = createOrderDto.ShippingPostalCode,
                    ShippingCountry = createOrderDto.ShippingCountry,
                    Currency = "INR",
                    Status = "pending",
                    PaymentStatus = "unpaid",
                    Notes = createOrderDto.Notes
                };
                
                _logger.LogInformation("CreateOrderAsync - Order created with OrderNumber: {OrderNumber} for UserId: {UserId}", 
                    order.OrderNumber, userId);

                // Create order items and calculate total
                int totalCents = 0;
                foreach (var cartItem in cart.CartItems)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = cartItem.ProductId,
                        ProductName = cartItem.Product.Name,
                        ProductSku = cartItem.Product.Sku,
                        Quantity = cartItem.Quantity,
                        PriceCents = cartItem.Product.PriceCents,
                        SubtotalCents = cartItem.Product.PriceCents * cartItem.Quantity
                    };

                    totalCents += orderItem.SubtotalCents;
                    order.OrderItems.Add(orderItem);

                    // Reduce stock
                    cartItem.Product.Stock -= cartItem.Quantity;
                    cartItem.Product.UpdatedAt = DateTime.UtcNow;
                }

                order.TotalCents = totalCents;

                // Save order
                _context.Orders.Add(order);

                // Clear cart
                _context.CartItems.RemoveRange(cart.CartItems);

                await _context.SaveChangesAsync();

                _logger.LogInformation("Order created successfully: {OrderId}", order.Id);

                return (true, MapToOrderDto(order), null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return (false, null, "An error occurred while creating the order");
            }
        }

        public async Task<(bool success, OrderDto? order, string? error)> GetOrderByIdAsync(Guid orderId, Guid userId, bool isAdmin)
        {
            try
            {
                var query = _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .Include(o => o.OrderPayments)
                    .AsQueryable();

                // Users can only see their own orders, admins can see all
                if (!isAdmin)
                {
                    query = query.Where(o => o.UserId == userId);
                }

                var order = await query.FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    return (false, null, "Order not found");
                }

                return (true, MapToOrderDto(order), null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order by ID");
                return (false, null, "An error occurred while retrieving the order");
            }
        }

        public async Task<(bool success, List<OrderDto> orders, string? error)> GetUserOrdersAsync(Guid userId)
        {
            try
            {
                _logger.LogInformation("GetUserOrdersAsync - Fetching orders for UserId: {UserId}", userId);
                
                var orders = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .Include(o => o.OrderPayments)
                    .Where(o => o.UserId == userId)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                _logger.LogInformation("GetUserOrdersAsync - Found {Count} orders for UserId: {UserId}", orders.Count, userId);
                
                foreach (var order in orders)
                {
                    _logger.LogInformation("Order {OrderId} - UserId: {UserId}, OrderNumber: {OrderNumber}", 
                        order.Id, order.UserId, order.OrderNumber);
                }

                var orderDtos = orders.Select(MapToOrderDto).ToList();

                return (true, orderDtos, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user orders");
                return (false, new List<OrderDto>(), "An error occurred while retrieving orders");
            }
        }

        public async Task<(bool success, List<OrderDto> orders, string? error)> GetAllOrdersAsync()
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .Include(o => o.OrderPayments)
                    .Include(o => o.User)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var orderDtos = orders.Select(MapToOrderDto).ToList();

                return (true, orderDtos, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all orders");
                return (false, new List<OrderDto>(), "An error occurred while retrieving orders");
            }
        }

        public async Task<(bool success, OrderDto? order, string? error)> UpdateOrderStatusAsync(Guid orderId, UpdateOrderStatusDto updateStatusDto)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .Include(o => o.OrderPayments)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    return (false, null, "Order not found");
                }

                order.Status = updateStatusDto.Status;
                if (!string.IsNullOrWhiteSpace(updateStatusDto.Notes))
                {
                    order.Notes = updateStatusDto.Notes;
                }
                order.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Order status updated: {OrderId} - {Status}", orderId, updateStatusDto.Status);

                return (true, MapToOrderDto(order), null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status");
                return (false, null, "An error occurred while updating the order");
            }
        }

        public async Task<(bool success, string? error)> CancelOrderAsync(Guid orderId, Guid userId, bool isAdmin)
        {
            try
            {
                var query = _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .AsQueryable();

                // Users can only cancel their own orders
                if (!isAdmin)
                {
                    query = query.Where(o => o.UserId == userId);
                }

                var order = await query.FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    return (false, "Order not found");
                }

                if (order.Status == "cancelled")
                {
                    return (false, "Order is already cancelled");
                }

                if (order.Status == "delivered")
                {
                    return (false, "Cannot cancel a delivered order");
                }

                // Restore stock
                foreach (var orderItem in order.OrderItems)
                {
                    orderItem.Product.Stock += orderItem.Quantity;
                    orderItem.Product.UpdatedAt = DateTime.UtcNow;
                }

                order.Status = "cancelled";
                order.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Order cancelled: {OrderId}", orderId);

                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling order");
                return (false, "An error occurred while cancelling the order");
            }
        }

        private string GenerateOrderNumber()
        {
            return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
        }

        private OrderDto MapToOrderDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                UserId = order.UserId,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                CustomerPhone = order.CustomerPhone,
                ShippingAddress = $"{order.ShippingAddress}, {order.ShippingCity}, {order.ShippingState} {order.ShippingPostalCode}, {order.ShippingCountry}",
                TotalPrice = order.TotalCents / 100m,
                TotalPriceCents = order.TotalCents,
                Currency = order.Currency,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                Notes = order.Notes,
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ProductSku = oi.ProductSku,
                    Quantity = oi.Quantity,
                    Price = oi.PriceCents / 100m,
                    PriceCents = oi.PriceCents,
                    Subtotal = oi.SubtotalCents / 100m,
                    SubtotalCents = oi.SubtotalCents
                }).ToList(),
                Payments = order.OrderPayments?.Select(op => new OrderPaymentDto
                {
                    Id = op.Id,
                    Psp = op.Psp,
                    PspPaymentId = op.PspPaymentId,
                    PspOrderId = op.PspOrderId,
                    Amount = op.AmountCents / 100m,
                    AmountCents = op.AmountCents,
                    Currency = op.Currency,
                    Status = op.Status,
                    PaymentMethod = op.PaymentMethod,
                    CreatedAt = op.CreatedAt,
                    UpdatedAt = op.UpdatedAt
                }).ToList(),
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt
            };
        }
    }
}
