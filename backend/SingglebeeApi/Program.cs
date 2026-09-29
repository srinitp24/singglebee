using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SingglebeeApi.Data;
using SingglebeeApi.Services;
using SingglebeeApi.Services.Sms;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// DATABASE CONFIGURATION
// ============================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=singglebee_db;User=root;Password=Admin@123;";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// ============================================
// JWT AUTHENTICATION CONFIGURATION
// ============================================
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "SingglebeeApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "SingglebeeClient";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };

        // Read token from cookie if Authorization header is missing
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Try to get token from cookie first
                if (context.Request.Cookies.ContainsKey("auth_token"))
                {
                    context.Token = context.Request.Cookies["auth_token"];
                }
                return Task.CompletedTask;
            }
        };
    });

// ============================================
// COOKIE CONFIGURATION FOR HTTP-ONLY TOKENS
// ============================================
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.MinimumSameSitePolicy = SameSiteMode.Lax; // or Strict for more security
    options.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
    options.Secure = CookieSecurePolicy.Always; // Requires HTTPS in production
});

builder.Services.AddAuthorization();

// ============================================
// SMS PROVIDER CONFIGURATION
// ============================================
// Configure Twilio settings from appsettings.json
builder.Services.Configure<TwilioSettings>(builder.Configuration.GetSection("Twilio"));

// Register HttpClient for Twilio
builder.Services.AddHttpClient<TwilioSmsProvider>();

// Register SMS provider - Switch between providers here
// Use ConsoleSmsProvider for development/testing without sending actual SMS
// Use TwilioSmsProvider for production
if (builder.Environment.IsDevelopment())
{
    // Development: Log SMS to console instead of sending
    builder.Services.AddScoped<ISmsProvider, ConsoleSmsProvider>();
    Console.WriteLine("==> SMS Provider: ConsoleSmsProvider (Development Mode - OTP codes will be logged to console)");
}
else
{
    // Production: Use Twilio to send actual SMS
    builder.Services.AddScoped<ISmsProvider, TwilioSmsProvider>();
    Console.WriteLine("==> SMS Provider: TwilioSmsProvider (Production Mode - SMS will be sent via Twilio API)");
}

// To switch to a different SMS provider in the future:
// 1. Create a new class implementing ISmsProvider (e.g., AwsSnsSmsProvider)
// 2. Update the registration above to use the new provider
// Example: builder.Services.AddScoped<ISmsProvider, AwsSnsSmsProvider>();

// ============================================
// CORS CONFIGURATION
// ============================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ============================================
// CONTROLLERS AND API SERVICES
// ============================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Swagger temporarily disabled due to OpenAPI version conflict
// builder.Services.AddSwaggerGen();

// Register Services
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<IReviewService, ReviewService>();

var app = builder.Build();

// ============================================
// DATABASE SEEDING (Development only)
// ============================================
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await DbSeeder.SeedAsync(context);
}

// ============================================
// MIDDLEWARE PIPELINE
// ============================================
// Swagger temporarily disabled due to OpenAPI version conflict
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
    app.UseHsts();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
