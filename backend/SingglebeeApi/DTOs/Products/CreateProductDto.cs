using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.DTOs.Products
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [StringLength(255, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "SKU is required")]
        [StringLength(100)]
        public string Sku { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, 999999.99, ErrorMessage = "Price must be between 0.01 and 999999.99")]
        public decimal Price { get; set; } // In rupees (will be converted to cents)

        [StringLength(3)]
        public string Currency { get; set; } = "INR";

        [Required(ErrorMessage = "Stock quantity is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }

        [StringLength(100)]
        public string? Category { get; set; }

        [StringLength(50)]
        public string? AgeGroup { get; set; }

        [StringLength(50)]
        public string? Language { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [Range(0.0, 5.0, ErrorMessage = "Rating must be between 0 and 5")]
        public decimal Rating { get; set; } = 0.0m;

        public bool IsActive { get; set; } = true;
    }
}
