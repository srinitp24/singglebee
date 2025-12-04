namespace SingglebeeApi.DTOs.Payments
{
    public class PaymentResponseDto
    {
        public Guid PaymentId { get; set; }
        public Guid OrderId { get; set; }
        public string Psp { get; set; } = string.Empty;
        public string? PspOrderId { get; set; }
        public string? PspPaymentId { get; set; }
        public int AmountCents { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "INR";
        public string Status { get; set; } = string.Empty;
        public Dictionary<string, object>? PspData { get; set; } // For frontend integration
        public DateTime CreatedAt { get; set; }
    }
}
