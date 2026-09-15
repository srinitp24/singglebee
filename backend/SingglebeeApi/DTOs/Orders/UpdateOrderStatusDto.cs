using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.DTOs.Orders
{
    public class UpdateOrderStatusDto
    {
        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(created|pending_payment|paid|processing|shipped|delivered|cancelled|refunded)$",
            ErrorMessage = "Invalid status value")]
        public string Status { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Notes { get; set; }
    }
}
