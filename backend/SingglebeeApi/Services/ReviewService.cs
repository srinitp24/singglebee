using Microsoft.EntityFrameworkCore;
using SingglebeeApi.Data;
using SingglebeeApi.DTOs.Reviews;
using SingglebeeApi.Models;

namespace SingglebeeApi.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReviewService> _logger;

        public ReviewService(ApplicationDbContext context, ILogger<ReviewService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ReviewResponseDto> CreateReviewAsync(Guid userId, CreateReviewDto dto)
        {
            try
            {
                // Validate that the order exists and belongs to the user
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == dto.OrderId && o.UserId == userId);

                if (order == null)
                {
                    throw new InvalidOperationException("Order not found or does not belong to user");
                }

                // Check if order status is delivered
                if (order.Status.ToLower() != "delivered")
                {
                    throw new InvalidOperationException("Reviews can only be submitted for delivered orders");
                }

                // Validate that the product is in the order
                var orderItem = order.OrderItems.FirstOrDefault(oi => oi.ProductId == dto.ProductId);
                if (orderItem == null)
                {
                    throw new InvalidOperationException("Product not found in the order");
                }

                // Check if user has already reviewed this product for this order
                var existingReview = await _context.ProductReviews
                    .FirstOrDefaultAsync(r => r.OrderId == dto.OrderId && r.ProductId == dto.ProductId);

                if (existingReview != null)
                {
                    throw new InvalidOperationException("You have already reviewed this product for this order");
                }

                // Create the review
                var review = new ProductReview
                {
                    ProductId = dto.ProductId,
                    OrderId = dto.OrderId,
                    UserId = userId,
                    Rating = dto.Rating,
                    ReviewText = dto.ReviewText,
                    IsAnonymous = true,
                    IsVerifiedPurchase = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ProductReviews.Add(review);

                // Update product average rating
                await UpdateProductAverageRatingAsync(dto.ProductId);

                await _context.SaveChangesAsync();

                _logger.LogInformation("Review created successfully for Product {ProductId} by User {UserId}", dto.ProductId, userId);

                return new ReviewResponseDto
                {
                    Id = review.Id,
                    ProductId = review.ProductId,
                    Rating = review.Rating,
                    ReviewText = review.ReviewText,
                    IsVerifiedPurchase = review.IsVerifiedPurchase,
                    CreatedAt = review.CreatedAt,
                    ReviewerName = "Anonymous"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review for Product {ProductId}", dto.ProductId);
                throw;
            }
        }

        public async Task<List<ReviewResponseDto>> GetProductReviewsAsync(Guid productId, int page = 1, int pageSize = 10)
        {
            var skip = (page - 1) * pageSize;

            var reviews = await _context.ProductReviews
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(r => new ReviewResponseDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    Rating = r.Rating,
                    ReviewText = r.ReviewText,
                    IsVerifiedPurchase = r.IsVerifiedPurchase,
                    CreatedAt = r.CreatedAt,
                    ReviewerName = "Anonymous"
                })
                .ToListAsync();

            return reviews;
        }

        public async Task<ProductReviewSummaryDto> GetProductReviewSummaryAsync(Guid productId)
        {
            var reviews = await _context.ProductReviews
                .Where(r => r.ProductId == productId)
                .ToListAsync();

            var totalReviews = reviews.Count;
            var averageRating = totalReviews > 0 ? (decimal)reviews.Average(r => r.Rating) : 0;

            var ratingDistribution = new Dictionary<int, int>
            {
                { 5, reviews.Count(r => r.Rating == 5) },
                { 4, reviews.Count(r => r.Rating == 4) },
                { 3, reviews.Count(r => r.Rating == 3) },
                { 2, reviews.Count(r => r.Rating == 2) },
                { 1, reviews.Count(r => r.Rating == 1) }
            };

            return new ProductReviewSummaryDto
            {
                ProductId = productId,
                AverageRating = Math.Round(averageRating, 1),
                TotalReviews = totalReviews,
                RatingDistribution = ratingDistribution
            };
        }

        public async Task<CanReviewProductDto> CanUserReviewProductAsync(Guid userId, Guid productId, Guid orderId)
        {
            var result = new CanReviewProductDto
            {
                ProductId = productId,
                OrderId = orderId,
                CanReview = false
            };

            // Check if order exists and belongs to user
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
            {
                result.Reason = "Order not found or does not belong to you";
                return result;
            }

            // Check if order is delivered
            if (order.Status.ToLower() != "delivered")
            {
                result.Reason = "Order must be delivered before you can leave a review";
                return result;
            }

            // Check if product is in the order
            var orderItem = order.OrderItems.FirstOrDefault(oi => oi.ProductId == productId);
            if (orderItem == null)
            {
                result.Reason = "Product not found in this order";
                return result;
            }

            // Check if user has already reviewed this product for this order
            var existingReview = await _context.ProductReviews
                .FirstOrDefaultAsync(r => r.OrderId == orderId && r.ProductId == productId);

            if (existingReview != null)
            {
                result.Reason = "You have already reviewed this product for this order";
                return result;
            }

            result.CanReview = true;
            result.Reason = "You can review this product";
            return result;
        }

        public async Task<List<Guid>> GetReviewableProductsForOrderAsync(Guid userId, Guid orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null || order.Status.ToLower() != "delivered")
            {
                return new List<Guid>();
            }

            var productIds = order.OrderItems.Select(oi => oi.ProductId).ToList();

            // Get products that haven't been reviewed yet for this order
            var reviewedProductIds = await _context.ProductReviews
                .Where(r => r.OrderId == orderId)
                .Select(r => r.ProductId)
                .ToListAsync();

            return productIds.Except(reviewedProductIds).ToList();
        }

        private async Task UpdateProductAverageRatingAsync(Guid productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return;

            var reviews = await _context.ProductReviews
                .Where(r => r.ProductId == productId)
                .ToListAsync();

            if (reviews.Any())
            {
                var averageRating = (decimal)reviews.Average(r => r.Rating);
                product.Rating = Math.Round(averageRating, 1);
            }
            else
            {
                product.Rating = 0;
            }

            product.UpdatedAt = DateTime.UtcNow;
        }
    }
}
