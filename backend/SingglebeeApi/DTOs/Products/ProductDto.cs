namespace SingglebeeApi.DTOs.Products
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; } // In rupees (converted from cents)
        public int PriceCents { get; set; } // Raw cents value
        public string Currency { get; set; } = "INR";
        public int Stock { get; set; }
        public string? Category { get; set; }
        public string? AgeGroup { get; set; }
        public string? Language { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Rating { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
