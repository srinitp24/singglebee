using Microsoft.EntityFrameworkCore;
using SingglebeeApi.Data;
using SingglebeeApi.DTOs.Carts;
using SingglebeeApi.Models;

namespace SingglebeeApi.Services
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CartService> _logger;

        public CartService(ApplicationDbContext context, ILogger<CartService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<(bool success, CartDto? cart, string? error)> GetOrCreateCartAsync(Guid userId)
        {
            try
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    // Create new cart for user
                    cart = new Cart
                    {
                        UserId = userId,
                        ExpiresAt = DateTime.UtcNow.AddDays(30)
                    };

                    _context.Carts.Add(cart);
                    await _context.SaveChangesAsync();
                }

                return (true, MapToCartDto(cart), null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting or creating cart");
                return (false, null, "An error occurred while accessing the cart");
            }
        }

        public async Task<(bool success, CartDto? cart, string? error)> AddToCartAsync(Guid userId, AddToCartDto addToCartDto)
        {
            try
            {
                _logger.LogInformation("Adding to cart - UserId: {UserId}, ProductId: {ProductId}, Quantity: {Quantity}", 
                    userId, addToCartDto.ProductId, addToCartDto.Quantity);

                // Get product first to validate
                var product = await _context.Products.FindAsync(addToCartDto.ProductId);
                if (product == null)
                {
                    _logger.LogWarning("Product not found: {ProductId}", addToCartDto.ProductId);
                    return (false, null, "Product not found");
                }

                if (!product.IsActive)
                {
                    return (false, null, "Product is not available");
                }

                // Check stock
                if (addToCartDto.Quantity > product.Stock)
                {
                    return (false, null, $"Insufficient stock. Only {product.Stock} items available");
                }

                // Get or create cart
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    _logger.LogInformation("Creating new cart for user: {UserId}", userId);
                    cart = new Cart
                    {
                        UserId = userId,
                        ExpiresAt = DateTime.UtcNow.AddDays(30)
                    };
                    _context.Carts.Add(cart);
                    await _context.SaveChangesAsync(); // Save to get cart ID
                }

                // Check if product already in cart (without loading products to avoid tracking issues)
                var existingCartItem = await _context.CartItems
                    .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == addToCartDto.ProductId);

                if (existingCartItem != null)
                {
                    // Update quantity
                    var newQuantity = existingCartItem.Quantity + addToCartDto.Quantity;
                    
                    if (newQuantity > product.Stock)
                    {
                        return (false, null, $"Insufficient stock. Only {product.Stock} items available");
                    }

                    existingCartItem.Quantity = newQuantity;
                    existingCartItem.PriceCents = product.PriceCents;
                    existingCartItem.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    // Add new cart item
                    var cartItem = new CartItem
                    {
                        CartId = cart.Id,
                        ProductId = addToCartDto.ProductId,
                        Quantity = addToCartDto.Quantity,
                        PriceCents = product.PriceCents
                    };

                    _context.CartItems.Add(cartItem);
                }

                cart.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Reload cart with full details for response
                var cartDto = await GetOrCreateCartAsync(userId);
                return cartDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding to cart - UserId: {UserId}, ProductId: {ProductId}", 
                    userId, addToCartDto.ProductId);
                return (false, null, $"An error occurred while adding to cart: {ex.Message}");
            }
        }

        public async Task<(bool success, CartDto? cart, string? error)> UpdateCartItemAsync(Guid userId, Guid productId, int quantity)
        {
            try
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    return (false, null, "Cart not found");
                }

                var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
                if (cartItem == null)
                {
                    return (false, null, "Product not in cart");
                }

                if (quantity <= 0)
                {
                    return await RemoveFromCartAsync(userId, productId) switch
                    {
                        (true, _) => await GetOrCreateCartAsync(userId),
                        var error => (false, null, error.error)
                    };
                }

                // Check stock
                if (quantity > cartItem.Product.Stock)
                {
                    return (false, null, $"Insufficient stock. Only {cartItem.Product.Stock} items available");
                }

                cartItem.Quantity = quantity;
                cartItem.UpdatedAt = DateTime.UtcNow;
                cart.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Reload cart
                cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.Id == cart.Id);

                return (true, MapToCartDto(cart!), null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating cart item");
                return (false, null, "An error occurred while updating cart");
            }
        }

        public async Task<(bool success, string? error)> RemoveFromCartAsync(Guid userId, Guid productId)
        {
            try
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    return (false, "Cart not found");
                }

                var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
                if (cartItem == null)
                {
                    return (false, "Product not in cart");
                }

                _context.CartItems.Remove(cartItem);
                cart.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing from cart");
                return (false, "An error occurred while removing from cart");
            }
        }

        public async Task<(bool success, string? error)> ClearCartAsync(Guid userId)
        {
            try
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    return (true, null); // No cart to clear
                }

                _context.CartItems.RemoveRange(cart.CartItems);
                await _context.SaveChangesAsync();

                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cart");
                return (false, "An error occurred while clearing cart");
            }
        }

        private CartDto MapToCartDto(Cart cart)
        {
            var items = cart.CartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product.Name,
                ProductSku = ci.Product.Sku,
                ProductImageUrl = ci.Product.ImageUrl,
                Quantity = ci.Quantity,
                Price = ci.Product.PriceCents / 100m,
                PriceCents = ci.Product.PriceCents,
                Subtotal = (ci.Product.PriceCents * ci.Quantity) / 100m,
                SubtotalCents = ci.Product.PriceCents * ci.Quantity,
                AvailableStock = ci.Product.Stock
            }).ToList();

            var totalCents = items.Sum(i => i.SubtotalCents);

            return new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                SessionId = cart.SessionId,
                Items = items,
                TotalPrice = totalCents / 100m,
                TotalPriceCents = totalCents,
                ItemCount = items.Sum(i => i.Quantity),
                ExpiresAt = cart.ExpiresAt,
                CreatedAt = cart.CreatedAt,
                UpdatedAt = cart.UpdatedAt
            };
        }
    }
}
