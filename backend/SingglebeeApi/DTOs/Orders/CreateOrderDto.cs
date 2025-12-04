using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.DTOs.Orders
{
    public class CreateOrderDto
    {
        [Required(ErrorMessage = "Customer name is required")]
        [StringLength(255, MinimumLength = 2)]
        public string CustomerName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Customer email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(255)]
        public string CustomerEmail { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Invalid phone number")]
        [StringLength(20)]
        public string? CustomerPhone { get; set; }

        [Required(ErrorMessage = "Shipping address is required")]
        [StringLength(500, MinimumLength = 5)]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required(ErrorMessage = "City is required")]
        [StringLength(100)]
        public string ShippingCity { get; set; } = string.Empty;

        [Required(ErrorMessage = "State is required")]
        [StringLength(100)]
        public string ShippingState { get; set; } = string.Empty;

        [Required(ErrorMessage = "Postal code is required")]
        [StringLength(20)]
        public string ShippingPostalCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Country is required")]
        [StringLength(100)]
        public string ShippingCountry { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Notes { get; set; }
    }
}
