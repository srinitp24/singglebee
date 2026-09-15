using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SingglebeeApi.Models
{
    public class Product
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Sku { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        [Required]
        public int PriceCents { get; set; } // Price in smallest currency unit (paise)

        [Required]
        [MaxLength(3)]
        public string Currency { get; set; } = "INR";

        public int Stock { get; set; } = 0;

        [MaxLength(100)]
        public string? Category { get; set; }

        [MaxLength(50)]
        public string? AgeGroup { get; set; }

        [MaxLength(50)]
        public string? Language { get; set; }

        [Column(TypeName = "text")]
        public string? ImageUrl { get; set; }

        [Column(TypeName = "decimal(2,1)")]
        public decimal Rating { get; set; } = 0.0m;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
