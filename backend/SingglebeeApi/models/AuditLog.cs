using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SingglebeeApi.Models
{
    public class AuditLog
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid? UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Action { get; set; } = string.Empty; // CREATE_PRODUCT, UPDATE_ORDER, etc.

        [Required]
        [MaxLength(50)]
        public string EntityType { get; set; } = string.Empty; // product, order, user

        public Guid? EntityId { get; set; }

        [Column(TypeName = "json")]
        public string? OldValues { get; set; }

        [Column(TypeName = "json")]
        public string? NewValues { get; set; }

        [MaxLength(45)]
        public string? IpAddress { get; set; }

        [Column(TypeName = "text")]
        public string? UserAgent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
}
