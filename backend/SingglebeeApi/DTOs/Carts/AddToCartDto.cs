using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.DTOs.Carts
{
    public class AddToCartDto
    {
        [Required(ErrorMessage = "Product ID is required")]
        public Guid ProductId { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100")]
        public int Quantity { get; set; } = 1;

        // For guest users
        public string? SessionId { get; set; }
    }
}
