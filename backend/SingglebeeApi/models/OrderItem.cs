using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SingglebeeApi.Models
{
    public class OrderItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        [MaxLength(255)]
        public string ProductName { get; set; } = string.Empty; // Snapshot at time of order

        [Required]
        [MaxLength(100)]
        public string ProductSku { get; set; } = string.Empty;

        [Required]
        public int Quantity { get; set; }

        [Required]
        public int PriceCents { get; set; } // Price per item at time of order

        [Required]
        public int SubtotalCents { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}
