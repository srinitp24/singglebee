namespace SingglebeeApi.DTOs.Orders
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string? CustomerPhone { get; set; }
        public string? ShippingAddress { get; set; }
        public decimal TotalPrice { get; set; }
        public int TotalPriceCents { get; set; }
        public string Currency { get; set; } = "INR";
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
        public List<OrderPaymentDto>? Payments { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class OrderItemDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductSku { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int PriceCents { get; set; }
        public decimal Subtotal { get; set; }
        public int SubtotalCents { get; set; }
    }

    public class OrderPaymentDto
    {
        public Guid Id { get; set; }
        public string Psp { get; set; } = string.Empty;
        public string? PspPaymentId { get; set; }
        public string? PspOrderId { get; set; }
        public decimal Amount { get; set; }
        public int AmountCents { get; set; }
        public string Currency { get; set; } = "INR";
        public string Status { get; set; } = string.Empty;
        public string? PaymentMethod { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
