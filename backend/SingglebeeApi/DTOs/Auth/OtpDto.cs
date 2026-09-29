using System.ComponentModel.DataAnnotations;

namespace SingglebeeApi.DTOs.Auth
{
    public class SendOtpDto
    {
        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\+\d{10,15}$", ErrorMessage = "Phone number must be in international format (e.g., +911234567890)")]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Purpose is required")]
        [MaxLength(50)]
        public string Purpose { get; set; } = "login"; // login, registration, phone-verification
    }

    public class VerifyOtpDto
    {
        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\+\d{10,15}$", ErrorMessage = "Phone number must be in international format (e.g., +911234567890)")]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "OTP code is required")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP code must be 6 digits")]
        public string OtpCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Purpose is required")]
        [MaxLength(50)]
        public string Purpose { get; set; } = "login";

        public string? Password { get; set; } // Optional: for login after OTP verification
    }

    public class OtpLoginDto
    {
        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\+\d{10,15}$", ErrorMessage = "Phone number must be in international format (e.g., +911234567890)")]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "OTP code is required")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP code must be 6 digits")]
        public string OtpCode { get; set; } = string.Empty;
    }
}
