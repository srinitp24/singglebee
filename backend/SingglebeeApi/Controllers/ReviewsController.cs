using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SingglebeeApi.DTOs.Reviews;
using SingglebeeApi.Services;
using System.Security.Claims;

namespace SingglebeeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(IReviewService reviewService, ILogger<ReviewsController> logger)
        {
            _reviewService = reviewService;
            _logger = logger;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());
                var review = await _reviewService.CreateReviewAsync(userId, dto);
                return Ok(new { success = true, data = review, message = "Review submitted successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review");
                return StatusCode(500, new { success = false, message = "An error occurred while submitting your review" });
            }
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetProductReviews(Guid productId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var reviews = await _reviewService.GetProductReviewsAsync(productId, page, pageSize);
                return Ok(new { success = true, data = reviews });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product reviews for {ProductId}", productId);
                return StatusCode(500, new { success = false, message = "An error occurred while fetching reviews" });
            }
        }

        [HttpGet("product/{productId}/summary")]
        public async Task<IActionResult> GetProductReviewSummary(Guid productId)
        {
            try
            {
                var summary = await _reviewService.GetProductReviewSummaryAsync(productId);
                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product review summary for {ProductId}", productId);
                return StatusCode(500, new { success = false, message = "An error occurred while fetching review summary" });
            }
        }

        [HttpGet("can-review")]
        [Authorize]
        public async Task<IActionResult> CanReviewProduct([FromQuery] Guid productId, [FromQuery] Guid orderId)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());
                var result = await _reviewService.CanUserReviewProductAsync(userId, productId, orderId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if user can review product");
                return StatusCode(500, new { success = false, message = "An error occurred" });
            }
        }

        [HttpGet("order/{orderId}/reviewable-products")]
        [Authorize]
        public async Task<IActionResult> GetReviewableProducts(Guid orderId)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());
                var productIds = await _reviewService.GetReviewableProductsForOrderAsync(userId, orderId);
                return Ok(new { success = true, data = productIds });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reviewable products for order {OrderId}", orderId);
                return StatusCode(500, new { success = false, message = "An error occurred" });
            }
        }
    }
}
