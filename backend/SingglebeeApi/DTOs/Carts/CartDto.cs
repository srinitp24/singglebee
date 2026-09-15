namespace SingglebeeApi.DTOs.Carts
{
    public class CartDto
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public string? SessionId { get; set; }
        public List<CartItemDto> Items { get; set; } = new();
        public decimal TotalPrice { get; set; } // Calculated from items
        public int TotalPriceCents { get; set; }
        public int ItemCount { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CartItemDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductSku { get; set; } = string.Empty;
        public string? ProductImageUrl { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; } // Price per unit in rupees
        public int PriceCents { get; set; }
        public decimal Subtotal { get; set; } // Quantity * Price
        public int SubtotalCents { get; set; }
        public int AvailableStock { get; set; }
    }
}
