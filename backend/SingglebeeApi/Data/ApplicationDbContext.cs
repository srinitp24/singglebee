using Microsoft.EntityFrameworkCore;
using SingglebeeApi.Models;

namespace SingglebeeApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderPayment> OrderPayments { get; set; }
        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ============================================
            // USER CONFIGURATION
            // ============================================
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Role);
                entity.HasIndex(e => e.ResetToken);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.HashedPassword).HasColumnName("hashed_password");
                entity.Property(e => e.Role).HasColumnName("role");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.IsActive).HasColumnName("is_active");
                entity.Property(e => e.EmailVerified).HasColumnName("email_verified");
                entity.Property(e => e.ResetToken).HasColumnName("reset_token");
                entity.Property(e => e.ResetTokenExpires).HasColumnName("reset_token_expires");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                // Configure relationships
                entity.HasMany(e => e.Orders)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.Carts)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.PasswordResetTokens)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.AuditLogs)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ============================================
            // PRODUCT CONFIGURATION
            // ============================================
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("products");

                entity.HasIndex(e => e.Sku).IsUnique();
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.AgeGroup);
                entity.HasIndex(e => e.Language);
                entity.HasIndex(e => e.IsActive);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Sku).HasColumnName("sku");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.PriceCents).HasColumnName("price_cents");
                entity.Property(e => e.Currency).HasColumnName("currency");
                entity.Property(e => e.Stock).HasColumnName("stock");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.AgeGroup).HasColumnName("age_group");
                entity.Property(e => e.Language).HasColumnName("language");
                entity.Property(e => e.ImageUrl).HasColumnName("image_url");
                entity.Property(e => e.Rating).HasColumnName("rating");
                entity.Property(e => e.IsActive).HasColumnName("is_active");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                // Configure relationships
                entity.HasMany(e => e.CartItems)
                    .WithOne(e => e.Product)
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.OrderItems)
                    .WithOne(e => e.Product)
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ============================================
            // CART CONFIGURATION
            // ============================================
            modelBuilder.Entity<Cart>(entity =>
            {
                entity.ToTable("carts");

                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.SessionId);
                entity.HasIndex(e => e.ExpiresAt);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.SessionId).HasColumnName("session_id");
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                // Configure relationships
                entity.HasMany(e => e.CartItems)
                    .WithOne(e => e.Cart)
                    .HasForeignKey(e => e.CartId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ============================================
            // CART ITEM CONFIGURATION
            // ============================================
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.ToTable("cart_items");

                entity.HasIndex(e => e.CartId);
                entity.HasIndex(e => e.ProductId);
                entity.HasIndex(e => new { e.CartId, e.ProductId }).IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.CartId).HasColumnName("cart_id");
                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.Quantity).HasColumnName("quantity");
                entity.Property(e => e.PriceCents).HasColumnName("price_cents");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            });

            // ============================================
            // ORDER CONFIGURATION
            // ============================================
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("orders");

                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.OrderNumber).IsUnique();
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.PaymentStatus);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => new { e.UserId, e.Status });

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.OrderNumber).HasColumnName("order_number");
                entity.Property(e => e.CustomerName).HasColumnName("customer_name");
                entity.Property(e => e.CustomerEmail).HasColumnName("customer_email");
                entity.Property(e => e.CustomerPhone).HasColumnName("customer_phone");
                entity.Property(e => e.ShippingAddress).HasColumnName("shipping_address");
                entity.Property(e => e.TotalCents).HasColumnName("total_cents");
                entity.Property(e => e.Currency).HasColumnName("currency");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.PaymentStatus).HasColumnName("payment_status");
                entity.Property(e => e.Notes).HasColumnName("notes");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                // Configure relationships
                entity.HasMany(e => e.OrderItems)
                    .WithOne(e => e.Order)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.OrderPayments)
                    .WithOne(e => e.Order)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ============================================
            // ORDER ITEM CONFIGURATION
            // ============================================
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("order_items");

                entity.HasIndex(e => e.OrderId);
                entity.HasIndex(e => e.ProductId);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.OrderId).HasColumnName("order_id");
                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.ProductName).HasColumnName("product_name");
                entity.Property(e => e.ProductSku).HasColumnName("product_sku");
                entity.Property(e => e.Quantity).HasColumnName("quantity");
                entity.Property(e => e.PriceCents).HasColumnName("price_cents");
                entity.Property(e => e.SubtotalCents).HasColumnName("subtotal_cents");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            // ============================================
            // ORDER PAYMENT CONFIGURATION
            // ============================================
            modelBuilder.Entity<OrderPayment>(entity =>
            {
                entity.ToTable("order_payments");

                entity.HasIndex(e => e.OrderId);
                entity.HasIndex(e => e.PspPaymentId);
                entity.HasIndex(e => e.Status);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.OrderId).HasColumnName("order_id");
                entity.Property(e => e.Psp).HasColumnName("psp");
                entity.Property(e => e.PspPaymentId).HasColumnName("psp_payment_id");
                entity.Property(e => e.PspOrderId).HasColumnName("psp_order_id");
                entity.Property(e => e.AmountCents).HasColumnName("amount_cents");
                entity.Property(e => e.Currency).HasColumnName("currency");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.PaymentMethod).HasColumnName("payment_method");
                entity.Property(e => e.Metadata).HasColumnName("metadata");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                // Configure relationships
                entity.HasMany(e => e.PaymentTransactions)
                    .WithOne(e => e.OrderPayment)
                    .HasForeignKey(e => e.OrderPaymentId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ============================================
            // PAYMENT TRANSACTION CONFIGURATION
            // ============================================
            modelBuilder.Entity<PaymentTransaction>(entity =>
            {
                entity.ToTable("payment_transactions");

                entity.HasIndex(e => e.OrderPaymentId);
                entity.HasIndex(e => e.OrderId);
                entity.HasIndex(e => e.PspTransactionId);
                entity.HasIndex(e => e.TransactionType);
                entity.HasIndex(e => e.CreatedAt);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.OrderPaymentId).HasColumnName("order_payment_id");
                entity.Property(e => e.OrderId).HasColumnName("order_id");
                entity.Property(e => e.TransactionType).HasColumnName("transaction_type");
                entity.Property(e => e.Psp).HasColumnName("psp");
                entity.Property(e => e.PspTransactionId).HasColumnName("psp_transaction_id");
                entity.Property(e => e.EventType).HasColumnName("event_type");
                entity.Property(e => e.AmountCents).HasColumnName("amount_cents");
                entity.Property(e => e.Currency).HasColumnName("currency");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.RequestPayload).HasColumnName("request_payload");
                entity.Property(e => e.ResponsePayload).HasColumnName("response_payload");
                entity.Property(e => e.ErrorMessage).HasColumnName("error_message");
                entity.Property(e => e.IpAddress).HasColumnName("ip_address");
                entity.Property(e => e.UserAgent).HasColumnName("user_agent");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            // ============================================
            // PASSWORD RESET TOKEN CONFIGURATION
            // ============================================
            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.ToTable("password_reset_tokens");

                entity.HasIndex(e => e.Token);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.ExpiresAt);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Token).HasColumnName("token");
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at");
                entity.Property(e => e.Used).HasColumnName("used");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            // ============================================
            // AUDIT LOG CONFIGURATION
            // ============================================
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.ToTable("audit_logs");

                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.EntityType);
                entity.HasIndex(e => e.EntityId);
                entity.HasIndex(e => e.CreatedAt);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("char(36)");

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Action).HasColumnName("action");
                entity.Property(e => e.EntityType).HasColumnName("entity_type");
                entity.Property(e => e.EntityId).HasColumnName("entity_id");
                entity.Property(e => e.OldValues).HasColumnName("old_values");
                entity.Property(e => e.NewValues).HasColumnName("new_values");
                entity.Property(e => e.IpAddress).HasColumnName("ip_address");
                entity.Property(e => e.UserAgent).HasColumnName("user_agent");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });
        }
    }
}
