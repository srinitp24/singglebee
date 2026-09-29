using SingglebeeApi.DTOs.Reviews;

namespace SingglebeeApi.Services
{
    public interface IReviewService
    {
        Task<ReviewResponseDto> CreateReviewAsync(Guid userId, CreateReviewDto dto);
        Task<List<ReviewResponseDto>> GetProductReviewsAsync(Guid productId, int page = 1, int pageSize = 10);
        Task<ProductReviewSummaryDto> GetProductReviewSummaryAsync(Guid productId);
        Task<CanReviewProductDto> CanUserReviewProductAsync(Guid userId, Guid productId, Guid orderId);
        Task<List<Guid>> GetReviewableProductsForOrderAsync(Guid userId, Guid orderId);
    }
}
