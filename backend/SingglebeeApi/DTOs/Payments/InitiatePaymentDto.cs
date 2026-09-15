using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.DTOs.Payments
{
    public class InitiatePaymentDto
    {
        [Required(ErrorMessage = "Order ID is required")]
        public Guid OrderId { get; set; }

        [Required(ErrorMessage = "Payment service provider is required")]
        [RegularExpression("^(razorpay|stripe)$", ErrorMessage = "PSP must be either 'razorpay' or 'stripe'")]
        public string Psp { get; set; } = "razorpay";

        public Dictionary<string, string>? Metadata { get; set; }
    }
}
