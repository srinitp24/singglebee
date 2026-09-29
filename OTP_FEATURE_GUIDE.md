# Mobile OTP Verification Feature

## Overview

This document describes the flexible OTP (One-Time Password) verification system implemented for login functionality. The system is designed with the **Strategy Pattern** to allow easy switching between different SMS providers (Twilio, AWS SNS, custom providers, etc.).

## Architecture

### Backend Structure

```
backend/SingglebeeApi/
├── Models/
│   └── OtpVerification.cs           # OTP data model
├── Services/
│   ├── IOtpService.cs                # OTP service interface
│   ├── OtpService.cs                 # OTP verification logic
│   └── Sms/
│       ├── ISmsProvider.cs           # SMS provider abstraction
│       ├── TwilioSmsProvider.cs      # Twilio implementation
│       └── ConsoleSmsProvider.cs     # Console/dev implementation
├── Controllers/
│   └── AuthController.cs             # OTP endpoints
├── DTOs/Auth/
│   └── OtpDto.cs                     # OTP request/response models
└── Data/
    └── ApplicationDbContext.cs       # Database configuration
```

### Frontend Structure

```
frontend/src/
├── pages/
│   └── OtpLoginPage.tsx              # OTP login UI
└── services/
    └── authService.ts                # OTP API methods
```

## Features

### 1. **Flexible SMS Provider Architecture**

The system uses the **Strategy Pattern** with an `ISmsProvider` interface, making it easy to switch between different SMS providers:

```csharp
public interface ISmsProvider
{
    Task<(bool success, string? error)> SendSmsAsync(string phoneNumber, string message);
    string ProviderName { get; }
}
```

**Current Implementations:**
- **TwilioSmsProvider**: Production SMS using Twilio API
- **ConsoleSmsProvider**: Development/testing (logs to console)

### 2. **OTP Security Features**

- **Expiration**: OTPs expire after 10 minutes
- **Rate Limiting**: Minimum 2 minutes between OTP requests
- **Attempt Limiting**: Maximum 3 verification attempts per OTP
- **Auto-cleanup**: Expired OTPs are cleaned up after 7 days
- **Phone Verification**: Marks user's phone as verified on successful login

### 3. **API Endpoints**

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "purpose": "login"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "otpCode": "123456",
  "purpose": "login"
}
```

#### Login with OTP
```http
POST /api/auth/login-otp
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "otpCode": "123456"
}
```

## Configuration

### 1. **Twilio Setup**

Update `appsettings.json`:

```json
{
  "Twilio": {
    "Enabled": true,
    "AccountSid": "YOUR_TWILIO_ACCOUNT_SID",
    "AuthToken": "YOUR_TWILIO_AUTH_TOKEN",
    "FromPhoneNumber": "+1234567890"
  }
}
```

Get your credentials from: https://console.twilio.com/

### 2. **Environment-Based Provider Selection**

In `Program.cs`, the SMS provider is automatically selected:

```csharp
if (builder.Environment.IsDevelopment())
{
    // Development: Log SMS to console
    builder.Services.AddScoped<ISmsProvider, ConsoleSmsProvider>();
}
else
{
    // Production: Use Twilio
    builder.Services.AddScoped<ISmsProvider, TwilioSmsProvider>();
}
```

## Switching to a Different SMS Provider

### Option 1: Use AWS SNS

1. **Create the AWS SNS Provider**:

```csharp
// Services/Sms/AwsSnsSmsProvider.cs
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;

public class AwsSnsSmsProvider : ISmsProvider
{
    private readonly IAmazonSimpleNotificationService _snsClient;
    private readonly ILogger<AwsSnsSmsProvider> _logger;

    public string ProviderName => "AWS SNS";

    public AwsSnsSmsProvider(
        IAmazonSimpleNotificationService snsClient,
        ILogger<AwsSnsSmsProvider> logger)
    {
        _snsClient = snsClient;
        _logger = logger;
    }

    public async Task<(bool success, string? error)> SendSmsAsync(string phoneNumber, string message)
    {
        try
        {
            var request = new PublishRequest
            {
                Message = message,
                PhoneNumber = phoneNumber
            };

            await _snsClient.PublishAsync(request);
            _logger.LogInformation("SMS sent via AWS SNS to {PhoneNumber}", phoneNumber);
            return (true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SMS via AWS SNS");
            return (false, "Failed to send SMS");
        }
    }
}
```

2. **Register in Program.cs**:

```csharp
// Add AWS SNS client
builder.Services.AddAWSService<IAmazonSimpleNotificationService>();

// Register AWS SNS provider
builder.Services.AddScoped<ISmsProvider, AwsSnsSmsProvider>();
```

### Option 2: Use Custom Provider

Create any class implementing `ISmsProvider` and register it in `Program.cs`.

## Database Schema

### OTP Verifications Table

```sql
CREATE TABLE otp_verifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    attempt_count INT DEFAULT 0,
    ip_address VARCHAR(50) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_phone_purpose (phone_number, purpose, is_verified),
    INDEX idx_created_at (created_at)
);
```

### User Table Addition

```sql
ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;
```

## Running the Migration

```bash
cd backend/SingglebeeApi
dotnet ef database update
```

## Frontend Usage

### OTP Login Flow

1. User enters phone number
2. System sends OTP
3. User enters 6-digit code
4. System verifies and logs in user

```typescript
// Send OTP
await authService.sendOtp({
  phoneNumber: '+1234567890',
  purpose: 'login'
})

// Login with OTP
const response = await authService.loginWithOtp({
  phoneNumber: '+1234567890',
  otpCode: '123456'
})
```

### Routing Setup

Add the OTP login route in your router configuration:

```typescript
import OtpLoginPage from './pages/OtpLoginPage'

// In your routes
{
  path: '/login-otp',
  element: <OtpLoginPage />
}
```

## Testing

### Development Testing (Console Provider)

1. Run in Development mode
2. Check console logs for OTP codes
3. No actual SMS is sent

### Production Testing (Twilio)

1. Set up Twilio credentials
2. Use verified phone numbers (during trial)
3. Monitor Twilio console for delivery status

## Security Considerations

1. **Rate Limiting**: 2-minute cooldown between OTP requests
2. **Attempt Limiting**: Max 3 verification attempts per OTP
3. **Expiration**: OTPs valid for 10 minutes only
4. **HTTPS Only**: Use HTTPS in production
5. **Phone Verification**: Users can only login to accounts with their phone number
6. **Audit Trail**: All OTP operations are logged

## Configuration Options

You can customize OTP behavior by modifying constants in `OtpService.cs`:

```csharp
private const int OTP_LENGTH = 6;              // OTP code length
private const int OTP_EXPIRY_MINUTES = 10;     // OTP validity period
private const int MAX_ATTEMPTS = 3;            // Max verification attempts
private const int RATE_LIMIT_MINUTES = 2;      // Cooldown between requests
```

## Future Enhancements

1. **Multi-factor Authentication**: Use OTP as second factor
2. **SMS Templates**: Customizable message templates
3. **Analytics**: Track OTP success/failure rates
4. **International Support**: Country code validation
5. **Voice OTP**: Alternative to SMS for accessibility
6. **Email OTP**: Alternative delivery method

## Troubleshooting

### OTP Not Received

1. Check Twilio credentials in `appsettings.json`
2. Verify phone number format (E.164: +1234567890)
3. Check Twilio console for delivery status
4. Ensure sufficient Twilio credits

### Migration Issues

```bash
# Check pending migrations
dotnet ef migrations list

# Apply migrations
dotnet ef database update

# Rollback if needed
dotnet ef database update PreviousMigrationName
```

### Console Provider Not Working

1. Ensure `ASPNETCORE_ENVIRONMENT=Development`
2. Check application logs for OTP codes
3. Verify `ConsoleSmsProvider` is registered

## Support

For issues or questions:
1. Check application logs
2. Verify SMS provider configuration
3. Test with Console provider first
4. Review Twilio/provider-specific documentation
