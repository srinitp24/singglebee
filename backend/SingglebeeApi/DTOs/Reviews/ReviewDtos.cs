using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.DTOs.Reviews
{
    public class CreateReviewDto
    {
        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [MaxLength(2000, ErrorMessage = "Review text cannot exceed 2000 characters")]
        public string? ReviewText { get; set; }
    }

    public class ReviewResponseDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public int Rating { get; set; }
        public string? ReviewText { get; set; }
        public bool IsVerifiedPurchase { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ReviewerName { get; set; } = "Anonymous"; // Always anonymous
    }

    public class ProductReviewSummaryDto
    {
        public Guid ProductId { get; set; }
        public decimal AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public Dictionary<int, int> RatingDistribution { get; set; } = new();
    }

    public class CanReviewProductDto
    {
        public Guid ProductId { get; set; }
        public Guid OrderId { get; set; }
        public bool CanReview { get; set; }
        public string? Reason { get; set; }
    }
}
