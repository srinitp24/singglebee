using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.Models
{
    public class Cart
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid? UserId { get; set; } // Nullable for guest carts

        [MaxLength(255)]
        public string? SessionId { get; set; } // For guest users

        [Required]
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(7);

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
