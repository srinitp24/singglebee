using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SingglebeeApi.DTOs.Common;
using SingglebeeApi.DTOs.Orders;
using SingglebeeApi.Services;
using System.Security.Claims;

namespace SingglebeeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<OrderDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            var (success, order, error) = await _orderService.CreateOrderAsync(userId, createOrderDto);

            if (!success)
            {
                return BadRequest(ApiResponse<OrderDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<OrderDto>.SuccessResponse(order!, "Order created successfully"));
        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            _logger.LogInformation("GetMyOrders - UserIdClaim: {UserIdClaim}", userIdClaim);
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            _logger.LogInformation("GetMyOrders - UserId: {UserId}", userId);

            var (success, orders, error) = await _orderService.GetUserOrdersAsync(userId);

            if (!success)
            {
                return BadRequest(ApiResponse<List<OrderDto>>.ErrorResponse(error!));
            }

            _logger.LogInformation("GetMyOrders - Retrieved {Count} orders for user {UserId}", orders.Count, userId);

            return Ok(ApiResponse<List<OrderDto>>.SuccessResponse(orders, "Orders retrieved successfully"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            bool isAdmin = roleClaim?.ToLower() == "admin";

            var (success, order, error) = await _orderService.GetOrderByIdAsync(id, userId, isAdmin);

            if (!success)
            {
                return NotFound(ApiResponse<OrderDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<OrderDto>.SuccessResponse(order!, "Order retrieved successfully"));
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var (success, orders, error) = await _orderService.GetAllOrdersAsync();

            if (!success)
            {
                return BadRequest(ApiResponse<List<OrderDto>>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<List<OrderDto>>.SuccessResponse(orders, "All orders retrieved successfully"));
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusDto updateStatusDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<OrderDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, order, error) = await _orderService.UpdateOrderStatusAsync(id, updateStatusDto);

            if (!success)
            {
                return BadRequest(ApiResponse<OrderDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<OrderDto>.SuccessResponse(order!, "Order status updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelOrder(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            bool isAdmin = roleClaim?.ToLower() == "admin";

            var (success, error) = await _orderService.CancelOrderAsync(id, userId, isAdmin);

            if (!success)
            {
                return BadRequest(ApiResponse.ErrorResponse(error!));
            }

            return Ok(ApiResponse.SuccessResponse("Order cancelled successfully"));
        }
    }
}
