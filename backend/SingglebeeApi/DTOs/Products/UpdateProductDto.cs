using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.DTOs.Products
{
    public class UpdateProductDto
    {
        [StringLength(255, MinimumLength = 2)]
        public string? Name { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [Range(0.01, 999999.99, ErrorMessage = "Price must be between 0.01 and 999999.99")]
        public decimal? Price { get; set; } // In rupees

        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int? Stock { get; set; }

        [StringLength(100)]
        public string? Category { get; set; }

        [StringLength(50)]
        public string? AgeGroup { get; set; }

        [StringLength(50)]
        public string? Language { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [Range(0.0, 5.0, ErrorMessage = "Rating must be between 0 and 5")]
        public decimal? Rating { get; set; }

        public bool? IsActive { get; set; }
    }
}
