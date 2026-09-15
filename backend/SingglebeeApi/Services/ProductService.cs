using Microsoft.EntityFrameworkCore;
using SingglebeeApi.Data;
using SingglebeeApi.DTOs.Products;
using SingglebeeApi.Models;

namespace SingglebeeApi.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductService> _logger;

        public ProductService(ApplicationDbContext context, ILogger<ProductService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<(bool success, List<ProductDto> products, int totalCount, string? error)> GetAllProductsAsync(
            int page = 1,
            int pageSize = 10,
            string? category = null,
            string? ageGroup = null,
            string? language = null,
            string? search = null,
            bool activeOnly = true)
        {
            try
            {
                var query = _context.Products.AsQueryable();

                // Apply filters
                if (activeOnly)
                {
                    query = query.Where(p => p.IsActive);
                }

                if (!string.IsNullOrWhiteSpace(category))
                {
                    query = query.Where(p => p.Category == category);
                }

                if (!string.IsNullOrWhiteSpace(ageGroup))
                {
                    query = query.Where(p => p.AgeGroup == ageGroup);
                }

                if (!string.IsNullOrWhiteSpace(language))
                {
                    query = query.Where(p => p.Language == language);
                }

                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(p => 
                        p.Name.Contains(search) || 
                        (p.Description != null && p.Description.Contains(search)) ||
                        p.Sku.Contains(search));
                }

                var totalCount = await query.CountAsync();

                var products = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Sku = p.Sku,
                        Description = p.Description,
                        Price = p.PriceCents / 100m,
                        PriceCents = p.PriceCents,
                        Currency = p.Currency,
                        Stock = p.Stock,
                        Category = p.Category,
                        AgeGroup = p.AgeGroup,
                        Language = p.Language,
                        ImageUrl = p.ImageUrl,
                        Rating = p.Rating,
                        IsActive = p.IsActive,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt
                    })
                    .ToListAsync();

                return (true, products, totalCount, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching products");
                return (false, new List<ProductDto>(), 0, "An error occurred while fetching products");
            }
        }

        public async Task<(bool success, ProductDto? product, string? error)> GetProductByIdAsync(Guid id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    return (false, null, "Product not found");
                }

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Sku = product.Sku,
                    Description = product.Description,
                    Price = product.PriceCents / 100m,
                    PriceCents = product.PriceCents,
                    Currency = product.Currency,
                    Stock = product.Stock,
                    Category = product.Category,
                    AgeGroup = product.AgeGroup,
                    Language = product.Language,
                    ImageUrl = product.ImageUrl,
                    Rating = product.Rating,
                    IsActive = product.IsActive,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt
                };

                return (true, productDto, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching product by ID: {ProductId}", id);
                return (false, null, "An error occurred while fetching product");
            }
        }

        public async Task<(bool success, ProductDto? product, string? error)> GetProductBySkuAsync(string sku)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Sku == sku);

                if (product == null)
                {
                    return (false, null, "Product not found");
                }

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Sku = product.Sku,
                    Description = product.Description,
                    Price = product.PriceCents / 100m,
                    PriceCents = product.PriceCents,
                    Currency = product.Currency,
                    Stock = product.Stock,
                    Category = product.Category,
                    AgeGroup = product.AgeGroup,
                    Language = product.Language,
                    ImageUrl = product.ImageUrl,
                    Rating = product.Rating,
                    IsActive = product.IsActive,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt
                };

                return (true, productDto, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching product by SKU: {Sku}", sku);
                return (false, null, "An error occurred while fetching product");
            }
        }

        public async Task<(bool success, ProductDto? product, string? error)> CreateProductAsync(CreateProductDto createProductDto)
        {
            try
            {
                // Check if SKU already exists
                var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Sku == createProductDto.Sku);
                if (existingProduct != null)
                {
                    return (false, null, "Product with this SKU already exists");
                }

                var product = new Product
                {
                    Id = Guid.NewGuid(),
                    Name = createProductDto.Name,
                    Sku = createProductDto.Sku,
                    Description = createProductDto.Description,
                    PriceCents = (int)(createProductDto.Price * 100), // Convert to cents
                    Currency = createProductDto.Currency,
                    Stock = createProductDto.Stock,
                    Category = createProductDto.Category,
                    AgeGroup = createProductDto.AgeGroup,
                    Language = createProductDto.Language,
                    ImageUrl = createProductDto.ImageUrl,
                    Rating = createProductDto.Rating,
                    IsActive = createProductDto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Sku = product.Sku,
                    Description = product.Description,
                    Price = product.PriceCents / 100m,
                    PriceCents = product.PriceCents,
                    Currency = product.Currency,
                    Stock = product.Stock,
                    Category = product.Category,
                    AgeGroup = product.AgeGroup,
                    Language = product.Language,
                    ImageUrl = product.ImageUrl,
                    Rating = product.Rating,
                    IsActive = product.IsActive,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt
                };

                _logger.LogInformation("Product created: {ProductSku}", product.Sku);
                return (true, productDto, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return (false, null, "An error occurred while creating product");
            }
        }

        public async Task<(bool success, ProductDto? product, string? error)> UpdateProductAsync(Guid id, UpdateProductDto updateProductDto)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return (false, null, "Product not found");
                }

                // Update only provided fields
                if (!string.IsNullOrWhiteSpace(updateProductDto.Name))
                    product.Name = updateProductDto.Name;

                if (updateProductDto.Description != null)
                    product.Description = updateProductDto.Description;

                if (updateProductDto.Price.HasValue)
                    product.PriceCents = (int)(updateProductDto.Price.Value * 100);

                if (updateProductDto.Stock.HasValue)
                    product.Stock = updateProductDto.Stock.Value;

                if (updateProductDto.Category != null)
                    product.Category = updateProductDto.Category;

                if (updateProductDto.AgeGroup != null)
                    product.AgeGroup = updateProductDto.AgeGroup;

                if (updateProductDto.Language != null)
                    product.Language = updateProductDto.Language;

                if (updateProductDto.ImageUrl != null)
                    product.ImageUrl = updateProductDto.ImageUrl;

                if (updateProductDto.Rating.HasValue)
                    product.Rating = updateProductDto.Rating.Value;

                if (updateProductDto.IsActive.HasValue)
                    product.IsActive = updateProductDto.IsActive.Value;

                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Sku = product.Sku,
                    Description = product.Description,
                    Price = product.PriceCents / 100m,
                    PriceCents = product.PriceCents,
                    Currency = product.Currency,
                    Stock = product.Stock,
                    Category = product.Category,
                    AgeGroup = product.AgeGroup,
                    Language = product.Language,
                    ImageUrl = product.ImageUrl,
                    Rating = product.Rating,
                    IsActive = product.IsActive,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt
                };

                _logger.LogInformation("Product updated: {ProductId}", product.Id);
                return (true, productDto, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product: {ProductId}", id);
                return (false, null, "An error occurred while updating product");
            }
        }

        public async Task<(bool success, string? error)> DeleteProductAsync(Guid id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return (false, "Product not found");
                }

                // Soft delete - just mark as inactive
                product.IsActive = false;
                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Product deleted (soft): {ProductId}", product.Id);
                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product: {ProductId}", id);
                return (false, "An error occurred while deleting product");
            }
        }
    }
}
