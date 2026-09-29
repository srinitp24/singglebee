namespace SingglebeeApi.Services.Sms
{
    /// <summary>
    /// Interface for SMS provider implementations.
    /// This allows easy switching between different SMS providers (Twilio, AWS SNS, etc.)
    /// </summary>
    public interface ISmsProvider
    {
        /// <summary>
        /// Send an SMS message to a phone number
        /// </summary>
        /// <param name="phoneNumber">Recipient phone number in E.164 format (e.g., +1234567890)</param>
        /// <param name="message">Message content to send</param>
        /// <returns>Tuple indicating success and optional error message</returns>
        Task<(bool success, string? error)> SendSmsAsync(string phoneNumber, string message);

        /// <summary>
        /// Get the provider name for logging/debugging purposes
        /// </summary>
        string ProviderName { get; }
    }
}
