# OTP Feature Setup Checklist

## Backend Setup

### 1. Database Migration
```bash
cd backend/SingglebeeApi
dotnet ef database update
```

This will:
- Create the `otp_verifications` table
- Add `phone_verified` column to `users` table

### 2. Configure Twilio (Production)

Edit `backend/SingglebeeApi/appsettings.json`:

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

**Get Twilio Credentials:**
1. Sign up at https://www.twilio.com/
2. Go to Console Dashboard
3. Copy Account SID and Auth Token
4. Get a phone number from Twilio

**Note:** For development, the system automatically uses `ConsoleSmsProvider` which logs OTPs to console instead of sending actual SMS.

### 3. Build and Run Backend
```bash
cd backend/SingglebeeApi
dotnet build
dotnet run
```

Expected output:
- Server running on http://localhost:5000 (or https://localhost:5001)
- Database migrations applied
- SMS provider registered (Console for Development, Twilio for Production)

## Frontend Setup

### 1. Install Dependencies (if needed)
```bash
cd frontend
npm install
```

### 2. Run Frontend
```bash
npm run dev
```

Expected output:
- Frontend running on http://localhost:5173

## Testing the Feature

### Development Testing (Console Provider)

1. **Navigate to OTP Login**
   - Go to http://localhost:5173/login-otp
   - Or click "Login with OTP" from the regular login page

2. **Enter Phone Number**
   - Use any phone number format (e.g., +1234567890 or 1234567890)
   - Click "Send OTP"

3. **Check Backend Console**
   - Look for log output like:
   ```
   ========== SMS SIMULATION ==========
   To: +1234567890
   Message: Your Singglebee verification code is: 123456. Valid for 10 minutes. Do not share this code.
   ====================================
   ```

4. **Enter OTP Code**
   - Copy the 6-digit code from console
   - Enter it in the OTP input fields
   - Click "Verify & Login"

5. **Verify Login**
   - You should be redirected to homepage
   - User should be logged in

### Production Testing (Twilio)

1. **Update appsettings.json with Twilio credentials**

2. **Set Production Environment**
   ```bash
   # PowerShell
   $env:ASPNETCORE_ENVIRONMENT="Production"
   dotnet run
   ```

3. **Test with Real Phone Number**
   - Use a phone number you have access to
   - You should receive an actual SMS with OTP
   - Enter the OTP to complete login

## API Endpoints Available

```
POST /api/auth/send-otp          - Send OTP to phone number
POST /api/auth/verify-otp        - Verify OTP code
POST /api/auth/login-otp         - Login with phone + OTP
```

## Routes Added

- `/login-otp` - OTP login page

## Common Issues and Solutions

### Issue: Migration Failed
```bash
# Solution: Check connection string in appsettings.json
# Ensure MySQL is running
# Run migration again with verbose logging
dotnet ef database update --verbose
```

### Issue: OTP Not Received (Production)
- Check Twilio credentials
- Verify phone number format (E.164: +1234567890)
- Check Twilio account balance
- Review Twilio console logs

### Issue: "OTP Service Not Configured"
- Ensure `IOtpService` and `ISmsProvider` are registered in Program.cs
- Check if migration was applied
- Restart the backend

### Issue: Frontend Route Not Working
- Ensure `OtpLoginPage` is imported in App.tsx
- Check browser console for errors
- Clear browser cache

## Switching SMS Providers

### To Use Console Provider in Production (for testing):
In `Program.cs`, change:
```csharp
// Force console provider
builder.Services.AddScoped<ISmsProvider, ConsoleSmsProvider>();
```

### To Use Twilio in Development:
In `Program.cs`, change:
```csharp
// Force Twilio provider
builder.Services.AddScoped<ISmsProvider, TwilioSmsProvider>();
```

### To Add Custom Provider:
1. Create class implementing `ISmsProvider`
2. Register in Program.cs:
```csharp
builder.Services.AddScoped<ISmsProvider, YourCustomProvider>();
```

## Security Notes

- ✅ OTPs expire after 10 minutes
- ✅ Rate limiting: 2 minutes between requests
- ✅ Max 3 verification attempts per OTP
- ✅ Phone number must match user account
- ✅ All OTP operations are logged
- ✅ HTTPS recommended for production

## Next Steps

1. ✅ Apply database migration
2. ✅ Configure Twilio (or use Console provider for testing)
3. ✅ Test OTP login flow
4. Consider adding:
   - OTP for registration
   - OTP for phone verification
   - Two-factor authentication
   - SMS notification for orders

## Support

For detailed documentation, see: `OTP_FEATURE_GUIDE.md`
