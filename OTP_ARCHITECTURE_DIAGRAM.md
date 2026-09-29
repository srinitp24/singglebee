# OTP Verification System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            USER INTERFACE                                │
│                                                                          │
│  ┌──────────────────┐         ┌──────────────────┐                     │
│  │   LoginPage      │         │  OtpLoginPage    │                     │
│  │  (Email/Pass)    │────────▶│  (Phone + OTP)   │                     │
│  └──────────────────┘         └──────────────────┘                     │
│         │                              │                                │
│         │                              │ 1. Send OTP Request            │
│         │                              │ 2. Verify OTP + Login          │
└─────────┼──────────────────────────────┼────────────────────────────────┘
          │                              │
          │                              │
          ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API LAYER (Backend)                               │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │              AuthController.cs                                │      │
│  │                                                               │      │
│  │  POST /api/auth/login          ──────────┐                   │      │
│  │  POST /api/auth/send-otp       ──────┐   │                   │      │
│  │  POST /api/auth/verify-otp     ────┐ │   │                   │      │
│  │  POST /api/auth/login-otp      ──┐ │ │   │                   │      │
│  └──────────────────────────────────┼─┼─┼───┼───────────────────┘      │
│                                     │ │ │   │                           │
│                                     │ │ │   │                           │
│  ┌──────────────────────────────────┼─┼─┼───┼───────────────────┐      │
│  │            Service Layer         │ │ │   │                   │      │
│  │                                  ▼ ▼ ▼   ▼                   │      │
│  │  ┌─────────────────┐      ┌──────────────────┐              │      │
│  │  │  AuthService    │      │   OtpService     │              │      │
│  │  │  - Login        │      │   - SendOtp      │              │      │
│  │  │  - OtpLogin     │      │   - VerifyOtp    │              │      │
│  │  │  - Register     │      │   - Cleanup      │              │      │
│  │  └────────┬────────┘      └────────┬─────────┘              │      │
│  │           │                        │                         │      │
│  │           │                        │                         │      │
│  │           │            ┌───────────▼──────────┐              │      │
│  │           │            │   SMS PROVIDER       │              │      │
│  │           │            │   (Strategy Pattern) │              │      │
│  │           │            │                      │              │      │
│  │           │            │  ┌────────────────┐  │              │      │
│  │           │            │  │ ISmsProvider   │  │              │      │
│  │           │            │  │  (Interface)   │  │              │      │
│  │           │            │  └───────┬────────┘  │              │      │
│  │           │            │          │           │              │      │
│  │           │            │  ┌───────┴────────┐  │              │      │
│  │           │            │  │                │  │              │      │
│  │           │            │  ▼                ▼  │              │      │
│  │           │            │ ┌──────────┐ ┌──────────────┐       │      │
│  │           │            │ │  Twilio  │ │   Console    │       │      │
│  │           │            │ │ Provider │ │   Provider   │       │      │
│  │           │            │ └──────────┘ └──────────────┘       │      │
│  │           │            │                                     │      │
│  │           │            │  Future Providers:                 │      │
│  │           │            │  - AWS SNS                         │      │
│  │           │            │  - Nexmo                           │      │
│  │           │            │  - Custom API                      │      │
│  │           │            └────────────────────────────────────┘      │
│  │           │                                                        │
│  └───────────┼────────────────────────────────────────────────────────┘
│              │                                                         │
│              ▼                                                         │
│  ┌──────────────────────────────────────────────────────────┐        │
│  │                 Database Layer                             │        │
│  │                                                            │        │
│  │  ┌──────────────┐    ┌──────────────────┐               │        │
│  │  │    users     │    │ otp_verifications│               │        │
│  │  │              │    │                  │               │        │
│  │  │ - id         │    │ - id             │               │        │
│  │  │ - email      │    │ - user_id        │               │        │
│  │  │ - phone      │◀───│ - phone_number   │               │        │
│  │  │ - verified   │    │ - otp_code       │               │        │
│  │  │ - phone_     │    │ - expires_at     │               │        │
│  │  │   verified   │    │ - is_verified    │               │        │
│  │  └──────────────┘    │ - attempt_count  │               │        │
│  │                      └──────────────────┘               │        │
│  └──────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────┘
```

## OTP Login Flow Sequence

```
User                Frontend            Backend API          OtpService        SMS Provider      Database
 │                     │                     │                   │                   │              │
 │  1. Enter Phone     │                     │                   │                   │              │
 ├────────────────────▶│                     │                   │                   │              │
 │                     │                     │                   │                   │              │
 │  2. Click Send OTP  │                     │                   │                   │              │
 ├────────────────────▶│ POST /send-otp      │                   │                   │              │
 │                     ├────────────────────▶│ SendOtpAsync()    │                   │              │
 │                     │                     ├──────────────────▶│                   │              │
 │                     │                     │                   │ Check Rate Limit  │              │
 │                     │                     │                   ├──────────────────▶│              │
 │                     │                     │                   │                   │              │
 │                     │                     │                   │ Generate OTP Code │              │
 │                     │                     │                   │ (e.g., "123456")  │              │
 │                     │                     │                   │                   │              │
 │                     │                     │                   │ Save OTP          │              │
 │                     │                     │                   ├──────────────────▶│              │
 │                     │                     │                   │                   │              │
 │                     │                     │                   │ SendSmsAsync()    │              │
 │                     │                     │                   ├──────────────────▶│              │
 │                     │                     │                   │                   │ Send SMS     │
 │◀────────────────────────────────────────────────────────────────────────────────┤              │
 │  SMS: "Your code: 123456"                 │                   │                   │              │
 │                     │                     │                   │                   │              │
 │                     │ Success Response    │                   │                   │              │
 │                     │◀────────────────────┤                   │                   │              │
 │  3. Enter OTP Code  │                     │                   │                   │              │
 ├────────────────────▶│                     │                   │                   │              │
 │                     │                     │                   │                   │              │
 │  4. Click Verify    │                     │                   │                   │              │
 ├────────────────────▶│ POST /login-otp     │                   │                   │              │
 │                     ├────────────────────▶│ OtpLoginAsync()   │                   │              │
 │                     │                     ├──────────────────▶│ VerifyOtpAsync()  │              │
 │                     │                     │                   ├──────────────────▶│ Get OTP      │
 │                     │                     │                   │                   │              │
 │                     │                     │                   │ Verify Code       │              │
 │                     │                     │                   │ Check Expiry      │              │
 │                     │                     │                   │ Check Attempts    │              │
 │                     │                     │                   │                   │              │
 │                     │                     │                   │ Mark Verified     │              │
 │                     │                     │                   ├──────────────────▶│              │
 │                     │                     │                   │                   │              │
 │                     │                     │ Generate JWT Token│                   │              │
 │                     │                     │ Mark Phone Verified                   │              │
 │                     │                     ├──────────────────────────────────────▶│              │
 │                     │                     │                   │                   │              │
 │                     │ Login Success       │                   │                   │              │
 │                     │ + JWT Token         │                   │                   │              │
 │  5. Redirected      │◀────────────────────┤                   │                   │              │
 │     to Home         │                     │                   │                   │              │
 │◀────────────────────┤                     │                   │                   │              │
```

## Provider Switching Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  Program.cs Configuration                        │
│                                                                  │
│  Environment-Based Provider Selection:                          │
│                                                                  │
│  if (Development)                    else (Production)          │
│      ↓                                    ↓                     │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │ ConsoleSmsProvider│            │ TwilioSmsProvider│          │
│  │                 │              │                 │          │
│  │ - Logs to console│            │ - Sends real SMS│          │
│  │ - No cost       │              │ - Uses Twilio   │          │
│  │ - Fast testing  │              │ - Production    │          │
│  └─────────────────┘              └─────────────────┘          │
│          │                                 │                    │
│          └─────────────┬───────────────────┘                    │
│                        │                                        │
│                        ▼                                        │
│              ┌──────────────────┐                               │
│              │  ISmsProvider    │                               │
│              │   Interface      │                               │
│              └──────────────────┘                               │
│                        │                                        │
│         Used by OtpService and injected automatically          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

To Switch Providers:
═══════════════════

1. Console Provider (Development/Testing)
   ────────────────────────────────────
   builder.Services.AddScoped<ISmsProvider, ConsoleSmsProvider>();

2. Twilio Provider (Production)
   ────────────────────────────
   builder.Services.AddScoped<ISmsProvider, TwilioSmsProvider>();

3. AWS SNS Provider (Future)
   ─────────────────────────
   builder.Services.AddScoped<ISmsProvider, AwsSnsSmsProvider>();

4. Custom Provider
   ───────────────
   Create class implementing ISmsProvider
   builder.Services.AddScoped<ISmsProvider, YourCustomProvider>();
```

## Security Layers

```
┌──────────────────────────────────────────────────────────────┐
│                    Security Features                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Rate Limiting                                      │
│  ─────────────────────                                       │
│  • 2-minute cooldown between OTP requests                    │
│  • Prevents spam and abuse                                   │
│  • Database timestamp check                                  │
│                                                               │
│  Layer 2: OTP Expiration                                     │
│  ───────────────────────                                     │
│  • OTPs valid for 10 minutes only                            │
│  • Automatic expiration check                                │
│  • Reduces window for brute force                            │
│                                                               │
│  Layer 3: Attempt Limiting                                   │
│  ─────────────────────────                                   │
│  • Maximum 3 verification attempts per OTP                   │
│  • Tracked in database (attempt_count)                       │
│  • Prevents brute force attacks                              │
│                                                               │
│  Layer 4: Phone Verification                                 │
│  ───────────────────────────                                 │
│  • Only account holder can receive OTP                       │
│  • Phone must match user account                             │
│  • Prevents unauthorized access                              │
│                                                               │
│  Layer 5: Audit Trail                                        │
│  ────────────────────                                        │
│  • All OTP operations logged                                 │
│  • Timestamp tracking                                        │
│  • IP address logging (optional)                             │
│  • 7-day retention for investigation                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
┌────────────────────────────────────────────────────────────────┐
│                     Database Schema                             │
└────────────────────────────────────────────────────────────────┘

users table                          otp_verifications table
┌──────────────────────┐            ┌──────────────────────────┐
│ id (PK)              │◀───────────│ user_id (FK)             │
│ name                 │            │ id (PK)                  │
│ email (UNIQUE)       │            │ phone_number             │
│ hashed_password      │            │ otp_code                 │
│ phone                │            │ purpose                  │
│ phone_verified ✨NEW │            │ is_verified              │
│ email_verified       │            │ expires_at               │
│ is_active            │            │ created_at               │
│ created_at           │            │ verified_at              │
│ updated_at           │            │ attempt_count            │
└──────────────────────┘            │ ip_address               │
                                    └──────────────────────────┘

Indexes:
────────
users:
  - email (UNIQUE)
  - phone

otp_verifications:
  - phone_number
  - purpose
  - created_at
  - (phone_number, purpose, is_verified) - Composite

Foreign Keys:
─────────────
otp_verifications.user_id → users.id (CASCADE DELETE)
```
