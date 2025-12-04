using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.DTOs.Users
{
    public class UpdateProfileDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(255, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }

        [StringLength(20)]
        public string? PostalCode { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }
    }
}
