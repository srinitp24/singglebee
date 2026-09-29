namespace SingglebeeApi.Services.Sms
{
    /// <summary>
    /// Console SMS provider for development/testing.
    /// Logs SMS messages to console instead of actually sending them.
    /// Useful for local development without incurring SMS costs.
    /// </summary>
    public class ConsoleSmsProvider : ISmsProvider
    {
        private readonly ILogger<ConsoleSmsProvider> _logger;

        public string ProviderName => "Console (Development)";

        public ConsoleSmsProvider(ILogger<ConsoleSmsProvider> logger)
        {
            _logger = logger;
        }

        public Task<(bool success, string? error)> SendSmsAsync(string phoneNumber, string message)
        {
            _logger.LogInformation(
                "========== SMS SIMULATION ==========\n" +
                "To: {PhoneNumber}\n" +
                "Message: {Message}\n" +
                "====================================",
                phoneNumber, message);

            // Simulate successful send
            return Task.FromResult<(bool success, string? error)>((true, null));
        }
    }
}
