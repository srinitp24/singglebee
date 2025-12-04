using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SingglebeeApi.DTOs.Carts;
using SingglebeeApi.DTOs.Common;
using SingglebeeApi.Services;
using System.Security.Claims;

namespace SingglebeeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        private readonly ILogger<CartController> _logger;

        public CartController(ICartService cartService, ILogger<CartController> logger)
        {
            _cartService = cartService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            var (success, cart, error) = await _cartService.GetOrCreateCartAsync(userId);

            if (!success)
            {
                return BadRequest(ApiResponse<CartDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<CartDto>.SuccessResponse(cart!, "Cart retrieved successfully"));
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto addToCartDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<CartDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            var (success, cart, error) = await _cartService.AddToCartAsync(userId, addToCartDto);

            if (!success)
            {
                return BadRequest(ApiResponse<CartDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<CartDto>.SuccessResponse(cart!, "Item added to cart"));
        }

        [HttpPut("items/{productId}")]
        public async Task<IActionResult> UpdateCartItem(Guid productId, [FromBody] UpdateCartItemDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<CartDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            var (success, cart, error) = await _cartService.UpdateCartItemAsync(userId, productId, updateDto.Quantity);

            if (!success)
            {
                return BadRequest(ApiResponse<CartDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<CartDto>.SuccessResponse(cart!, "Cart updated successfully"));
        }

        [HttpDelete("items/{productId}")]
        public async Task<IActionResult> RemoveFromCart(Guid productId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            var (success, error) = await _cartService.RemoveFromCartAsync(userId, productId);

            if (!success)
            {
                return BadRequest(ApiResponse.ErrorResponse(error!));
            }

            return Ok(ApiResponse.SuccessResponse("Item removed from cart"));
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("Invalid user token"));
            }

            var (success, error) = await _cartService.ClearCartAsync(userId);

            if (!success)
            {
                return BadRequest(ApiResponse.ErrorResponse(error!));
            }

            return Ok(ApiResponse.SuccessResponse("Cart cleared successfully"));
        }
    }
}
