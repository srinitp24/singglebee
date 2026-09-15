using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SingglebeeApi.Models
{
    public class PaymentTransaction
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid? OrderPaymentId { get; set; }

        public Guid? OrderId { get; set; }

        [Required]
        [MaxLength(50)]
        public string TransactionType { get; set; } = string.Empty; // webhook, api_call, reconciliation, refund, chargeback

        [Required]
        [MaxLength(50)]
        public string Psp { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? PspTransactionId { get; set; }

        [MaxLength(100)]
        public string? EventType { get; set; } // payment.success, payment.failed, etc.

        public int? AmountCents { get; set; }

        [MaxLength(3)]
        public string? Currency { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; }

        [Column(TypeName = "json")]
        public string? RequestPayload { get; set; }

        [Column(TypeName = "json")]
        public string? ResponsePayload { get; set; }

        [Column(TypeName = "text")]
        public string? ErrorMessage { get; set; }

        [MaxLength(45)]
        public string? IpAddress { get; set; }

        [Column(TypeName = "text")]
        public string? UserAgent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("OrderPaymentId")]
        public virtual OrderPayment? OrderPayment { get; set; }

        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; }
    }
}
