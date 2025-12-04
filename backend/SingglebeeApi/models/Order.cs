using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SingglebeeApi.Models
{
    public class Order
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string CustomerEmail { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? CustomerPhone { get; set; }

        // Shipping Information
        [Required]
        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string ShippingCity { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string ShippingState { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ShippingPostalCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string ShippingCountry { get; set; } = string.Empty;

        [Required]
        public int TotalCents { get; set; }

        [Required]
        [MaxLength(3)]
        public string Currency { get; set; } = "INR";

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "created"; // created, pending_payment, paid, processing, shipped, delivered, cancelled, refunded

        [Required]
        [MaxLength(50)]
        public string PaymentStatus { get; set; } = "unpaid"; // unpaid, pending, paid, failed, refunded

        [Column(TypeName = "text")]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<OrderPayment> OrderPayments { get; set; } = new List<OrderPayment>();
    }
}
