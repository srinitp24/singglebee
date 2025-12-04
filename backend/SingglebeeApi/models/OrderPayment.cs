using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SingglebeeApi.Models
{
    public class OrderPayment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Psp { get; set; } = string.Empty; // razorpay, stripe, etc.

        [MaxLength(255)]
        public string? PspPaymentId { get; set; }

        [MaxLength(255)]
        public string? PspOrderId { get; set; }

        [Required]
        public int AmountCents { get; set; }

        [Required]
        [MaxLength(3)]
        public string Currency { get; set; } = "INR";

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "created"; // created, pending, authorized, captured, failed, cancelled, refunded

        [MaxLength(50)]
        public string? PaymentMethod { get; set; } // card, upi, netbanking, wallet

        [Column(TypeName = "json")]
        public string? Metadata { get; set; } // JSON string

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;
        public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();
    }
}
