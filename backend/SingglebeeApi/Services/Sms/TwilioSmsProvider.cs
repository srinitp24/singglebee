using Microsoft.Extensions.Options;

namespace SingglebeeApi.Services.Sms
{
    /// <summary>
    /// Twilio SMS provider implementation
    /// </summary>
    public class TwilioSmsProvider : ISmsProvider
    {
        private readonly TwilioSettings _settings;
        private readonly ILogger<TwilioSmsProvider> _logger;
        private readonly HttpClient _httpClient;

        public string ProviderName => "Twilio";

        public TwilioSmsProvider(
            IOptions<TwilioSettings> settings,
            ILogger<TwilioSmsProvider> logger,
            HttpClient httpClient)
        {
            _settings = settings.Value;
            _logger = logger;
            _httpClient = httpClient;
        }

        public async Task<(bool success, string? error)> SendSmsAsync(string phoneNumber, string message)
        {
            try
            {
                if (!_settings.Enabled)
                {
                    _logger.LogWarning("Twilio SMS is disabled. Message would be sent to {PhoneNumber}: {Message}", 
                        phoneNumber, message);
                    return (true, null); // Return success in disabled mode for testing
                }

                if (string.IsNullOrEmpty(_settings.AccountSid) || 
                    string.IsNullOrEmpty(_settings.AuthToken) || 
                    string.IsNullOrEmpty(_settings.FromPhoneNumber))
                {
                    _logger.LogError("Twilio credentials are not configured properly");
                    return (false, "SMS service is not configured");
                }

                // Create request to Twilio API
                var requestUri = $"https://api.twilio.com/2010-04-01/Accounts/{_settings.AccountSid}/Messages.json";
                
                var formData = new Dictionary<string, string>
                {
                    { "To", phoneNumber },
                    { "From", _settings.FromPhoneNumber },
                    { "Body", message }
                };

                var request = new HttpRequestMessage(HttpMethod.Post, requestUri)
                {
                    Content = new FormUrlEncodedContent(formData)
                };

                // Add Basic Authentication header
                var credentials = Convert.ToBase64String(
                    System.Text.Encoding.ASCII.GetBytes($"{_settings.AccountSid}:{_settings.AuthToken}"));
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", credentials);

                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("SMS sent successfully to {PhoneNumber} via Twilio", phoneNumber);
                    return (true, null);
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Failed to send SMS via Twilio. Status: {StatusCode}, Error: {Error}", 
                        response.StatusCode, errorContent);
                    return (false, "Failed to send SMS");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred while sending SMS via Twilio to {PhoneNumber}", phoneNumber);
                return (false, "An error occurred while sending SMS");
            }
        }
    }

    /// <summary>
    /// Twilio configuration settings
    /// </summary>
    public class TwilioSettings
    {
        public bool Enabled { get; set; } = true;
        public string AccountSid { get; set; } = string.Empty;
        public string AuthToken { get; set; } = string.Empty;
        public string FromPhoneNumber { get; set; } = string.Empty;
    }
}
