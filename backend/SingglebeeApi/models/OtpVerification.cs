using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SingglebeeApi.Models
{
    public class OtpVerification
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string OtpCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Purpose { get; set; } = string.Empty; // login, registration, phone-verification

        public bool IsVerified { get; set; } = false;

        public DateTime ExpiresAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? VerifiedAt { get; set; }

        public int AttemptCount { get; set; } = 0;

        [MaxLength(50)]
        public string? IpAddress { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
}
