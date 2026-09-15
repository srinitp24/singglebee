using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SingglebeeApi.DTOs.Common;
using SingglebeeApi.DTOs.Products;
using SingglebeeApi.Services;

namespace SingglebeeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? ageGroup = null,
            [FromQuery] string? language = null,
            [FromQuery] string? search = null,
            [FromQuery] bool activeOnly = true)
        {
            var (success, products, totalCount, error) = await _productService.GetAllProductsAsync(
                page, pageSize, category, ageGroup, language, search, activeOnly);

            if (!success)
            {
                return BadRequest(ApiResponse<PaginationDto<ProductDto>>.ErrorResponse(error!));
            }

            var paginationDto = new PaginationDto<ProductDto>
            {
                Items = products,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };

            return Ok(ApiResponse<PaginationDto<ProductDto>>.SuccessResponse(paginationDto, "Products fetched successfully"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var (success, product, error) = await _productService.GetProductByIdAsync(id);

            if (!success)
            {
                return NotFound(ApiResponse<ProductDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<ProductDto>.SuccessResponse(product!, "Product fetched successfully"));
        }

        [HttpGet("sku/{sku}")]
        public async Task<IActionResult> GetProductBySku(string sku)
        {
            var (success, product, error) = await _productService.GetProductBySkuAsync(sku);

            if (!success)
            {
                return NotFound(ApiResponse<ProductDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<ProductDto>.SuccessResponse(product!, "Product fetched successfully"));
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto createProductDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<ProductDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, product, error) = await _productService.CreateProductAsync(createProductDto);

            if (!success)
            {
                return BadRequest(ApiResponse<ProductDto>.ErrorResponse(error!));
            }

            return CreatedAtAction(nameof(GetProductById), new { id = product!.Id },
                ApiResponse<ProductDto>.SuccessResponse(product, "Product created successfully"));
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductDto updateProductDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<ProductDto>.ErrorResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var (success, product, error) = await _productService.UpdateProductAsync(id, updateProductDto);

            if (!success)
            {
                return NotFound(ApiResponse<ProductDto>.ErrorResponse(error!));
            }

            return Ok(ApiResponse<ProductDto>.SuccessResponse(product!, "Product updated successfully"));
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var (success, error) = await _productService.DeleteProductAsync(id);

            if (!success)
            {
                return NotFound(ApiResponse.ErrorResponse(error!));
            }

            return Ok(ApiResponse.SuccessResponse("Product deleted successfully"));
        }
    }
}
