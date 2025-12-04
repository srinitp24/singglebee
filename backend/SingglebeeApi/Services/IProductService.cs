using SingglebeeApi.DTOs.Products;

namespace SingglebeeApi.Services
{
    public interface IProductService
    {
        Task<(bool success, List<ProductDto> products, int totalCount, string? error)> GetAllProductsAsync(
            int page = 1, 
            int pageSize = 10, 
            string? category = null, 
            string? ageGroup = null, 
            string? language = null,
            string? search = null,
            bool activeOnly = true);
        Task<(bool success, ProductDto? product, string? error)> GetProductByIdAsync(Guid id);
        Task<(bool success, ProductDto? product, string? error)> GetProductBySkuAsync(string sku);
        Task<(bool success, ProductDto? product, string? error)> CreateProductAsync(CreateProductDto createProductDto);
        Task<(bool success, ProductDto? product, string? error)> UpdateProductAsync(Guid id, UpdateProductDto updateProductDto);
        Task<(bool success, string? error)> DeleteProductAsync(Guid id);
    }
}
