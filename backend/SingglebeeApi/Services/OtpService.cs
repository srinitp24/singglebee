using Microsoft.EntityFrameworkCore;
using SingglebeeApi.Data;
using SingglebeeApi.Models;
using SingglebeeApi.Services.Sms;

namespace SingglebeeApi.Services
{
    public class OtpService : IOtpService
    {
        private readonly ApplicationDbContext _context;
        private readonly ISmsProvider _smsProvider;
        private readonly ILogger<OtpService> _logger;
        private readonly IConfiguration _configuration;

        // OTP Configuration
        private const int OTP_LENGTH = 6;
        private const int OTP_EXPIRY_MINUTES = 10;
        private const int MAX_ATTEMPTS = 3;
        private const int RATE_LIMIT_MINUTES = 2; // Minimum time between OTP requests

        public OtpService(
            ApplicationDbContext context,
            ISmsProvider smsProvider,
            ILogger<OtpService> logger,
            IConfiguration configuration)
        {
            _context = context;
            _smsProvider = smsProvider;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<(bool success, string? error)> SendOtpAsync(string phoneNumber, string purpose, Guid? userId = null)
        {
            try
            {
                // Validate phone number format (basic validation)
                if (string.IsNullOrWhiteSpace(phoneNumber) || phoneNumber.Length < 10)
                {
                    return (false, "Invalid phone number");
                }

                // Rate limiting: Check if OTP was sent recently
                var recentOtp = await _context.OtpVerifications
                    .Where(o => o.PhoneNumber == phoneNumber && 
                                o.Purpose == purpose &&
                                o.CreatedAt > DateTime.UtcNow.AddMinutes(-RATE_LIMIT_MINUTES))
                    .OrderByDescending(o => o.CreatedAt)
                    .FirstOrDefaultAsync();

                if (recentOtp != null)
                {
                    var waitTime = RATE_LIMIT_MINUTES - (DateTime.UtcNow - recentOtp.CreatedAt).TotalMinutes;
                    return (false, $"Please wait {Math.Ceiling(waitTime)} minute(s) before requesting another OTP");
                }

                // For login purpose, check if user exists
                // Extract digits only for comparison (handles both +911234567890 and 1234567890)
                if (purpose == "login")
                {
                    var phoneDigits = new string(phoneNumber.Where(char.IsDigit).ToArray());
                    
                    // Try exact match first
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Phone == phoneNumber);
                    
                    // If not found, try matching by last 10 digits (handles country code differences)
                    if (user == null && phoneDigits.Length >= 10)
                    {
                        var last10Digits = phoneDigits.Substring(phoneDigits.Length - 10);
                        user = await _context.Users
                            .Where(u => u.Phone != null && u.Phone.Contains(last10Digits))
                            .FirstOrDefaultAsync();
                    }
                    
                    if (user != null)
                    {
                        userId = user.Id;
                    }
                    else
                    {
                        _logger.LogWarning("OTP requested for unregistered phone number: {PhoneNumber}", phoneNumber);
                        userId = Guid.Empty;
                    }
                }

                // If userId is not provided for other purposes, this might be a new registration
                if (!userId.HasValue || userId.Value == Guid.Empty)
                {
                    // For registration or verification without existing user
                    userId = Guid.Empty;
                }

                // Generate OTP
                var otpCode = GenerateOtpCode();
                var expiresAt = DateTime.UtcNow.AddMinutes(OTP_EXPIRY_MINUTES);

                // Save OTP to database
                var otpVerification = new OtpVerification
                {
                    Id = Guid.NewGuid(),
                    UserId = userId.Value,
                    PhoneNumber = phoneNumber,
                    OtpCode = otpCode,
                    Purpose = purpose,
                    ExpiresAt = expiresAt,
                    CreatedAt = DateTime.UtcNow,
                    IsVerified = false,
                    AttemptCount = 0
                };

                _context.OtpVerifications.Add(otpVerification);
                await _context.SaveChangesAsync();

                // Send SMS
                var message = $"Your Singglebee verification code is: {otpCode}. Valid for {OTP_EXPIRY_MINUTES} minutes. Do not share this code.";
                var (smsSuccess, smsError) = await _smsProvider.SendSmsAsync(phoneNumber, message);

                if (!smsSuccess)
                {
                    _logger.LogError("Failed to send OTP SMS to {PhoneNumber}: {Error}", phoneNumber, smsError);
                    // Delete the OTP record since SMS failed
                    _context.OtpVerifications.Remove(otpVerification);
                    await _context.SaveChangesAsync();
                    return (false, smsError ?? "Failed to send OTP");
                }

                _logger.LogInformation("OTP sent successfully to {PhoneNumber} for purpose: {Purpose}", 
                    phoneNumber, purpose);
                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending OTP to {PhoneNumber}", phoneNumber);
                return (false, "An error occurred while sending OTP");
            }
        }

        public async Task<(bool success, Guid? userId, string? error)> VerifyOtpAsync(string phoneNumber, string otpCode, string purpose)
        {
            try
            {
                // Find the most recent OTP for this phone and purpose
                var otpRecord = await _context.OtpVerifications
                    .Where(o => o.PhoneNumber == phoneNumber && 
                                o.Purpose == purpose &&
                                !o.IsVerified)
                    .OrderByDescending(o => o.CreatedAt)
                    .FirstOrDefaultAsync();

                if (otpRecord == null)
                {
                    return (false, null, "No OTP found. Please request a new one.");
                }

                // Check if OTP has expired
                if (otpRecord.ExpiresAt < DateTime.UtcNow)
                {
                    return (false, null, "OTP has expired. Please request a new one.");
                }

                // Check max attempts
                if (otpRecord.AttemptCount >= MAX_ATTEMPTS)
                {
                    return (false, null, "Maximum verification attempts exceeded. Please request a new OTP.");
                }

                // Increment attempt count
                otpRecord.AttemptCount++;
                await _context.SaveChangesAsync();

                // Verify OTP code
                if (otpRecord.OtpCode != otpCode)
                {
                    var remainingAttempts = MAX_ATTEMPTS - otpRecord.AttemptCount;
                    if (remainingAttempts > 0)
                    {
                        return (false, null, $"Invalid OTP code. {remainingAttempts} attempt(s) remaining.");
                    }
                    else
                    {
                        return (false, null, "Invalid OTP code. Maximum attempts exceeded.");
                    }
                }

                // OTP is valid - mark as verified
                otpRecord.IsVerified = true;
                otpRecord.VerifiedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation("OTP verified successfully for {PhoneNumber}, purpose: {Purpose}", 
                    phoneNumber, purpose);
                
                return (true, otpRecord.UserId, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying OTP for {PhoneNumber}", phoneNumber);
                return (false, null, "An error occurred during OTP verification");
            }
        }

        public async Task<bool> CleanupExpiredOtpsAsync()
        {
            try
            {
                var expiredDate = DateTime.UtcNow.AddDays(-7); // Keep records for 7 days
                var expiredOtps = await _context.OtpVerifications
                    .Where(o => o.CreatedAt < expiredDate)
                    .ToListAsync();

                if (expiredOtps.Any())
                {
                    _context.OtpVerifications.RemoveRange(expiredOtps);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Cleaned up {Count} expired OTP records", expiredOtps.Count);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up expired OTPs");
                return false;
            }
        }

        private string GenerateOtpCode()
        {
            var random = new Random();
            var otp = random.Next(0, (int)Math.Pow(10, OTP_LENGTH)).ToString($"D{OTP_LENGTH}");
            return otp;
        }
    }
}
