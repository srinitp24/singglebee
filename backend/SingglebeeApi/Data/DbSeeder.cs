using Microsoft.EntityFrameworkCore;
using SingglebeeApi.Models;

namespace SingglebeeApi.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Ensure database is created
            await context.Database.MigrateAsync();

            // Check if data already exists
            if (await context.Users.AnyAsync())
            {
                return; // Database already seeded
            }

            // ============================================
            // SEED ADMIN USER
            // ============================================
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Name = "Admin User",
                Email = "admin@singglebee.com",
                // Password: Admin@123 (will be hashed with BCrypt in production)
                HashedPassword = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "admin",
                Phone = "+919876543210",
                IsActive = true,
                EmailVerified = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await context.Users.AddAsync(adminUser);

            // ============================================
            // SEED SAMPLE PRODUCTS
            // ============================================
            var products = new List<Product>
            {
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Butterfly Garden Activity Kit",
                    Sku = "BGAK-001",
                    Description = "Explore the world of butterflies with this hands-on learning kit. Includes activity guide, butterfly lifecycle models, and coloring materials.",
                    PriceCents = 29900, // ₹299.00
                    Currency = "INR",
                    Stock = 50,
                    Category = "activity-kits",
                    AgeGroup = "5-7",
                    Language = "English",
                    ImageUrl = "/images/products/butterfly-garden.jpg",
                    Rating = 4.5m,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Interactive Solar System Model",
                    Sku = "SSM-002",
                    Description = "Learn about planets and space with this interactive 3D model. Features glow-in-the-dark planets and educational booklet.",
                    PriceCents = 49900, // ₹499.00
                    Currency = "INR",
                    Stock = 35,
                    Category = "science-kits",
                    AgeGroup = "8-10",
                    Language = "English",
                    ImageUrl = "/images/products/solar-system.jpg",
                    Rating = 4.8m,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Hindi Alphabet Learning Cards",
                    Sku = "HALC-003",
                    Description = "Colorful flashcards to learn Hindi alphabets (Devanagari script). Includes pronunciation guide and fun activities.",
                    PriceCents = 19900, // ₹199.00
                    Currency = "INR",
                    Stock = 100,
                    Category = "learning-cards",
                    AgeGroup = "3-5",
                    Language = "Hindi",
                    ImageUrl = "/images/products/hindi-cards.jpg",
                    Rating = 4.3m,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Math Adventure Board Game",
                    Sku = "MABG-004",
                    Description = "Make math fun with this adventure-themed board game. Develops problem-solving and arithmetic skills.",
                    PriceCents = 39900, // ₹399.00
                    Currency = "INR",
                    Stock = 25,
                    Category = "board-games",
                    AgeGroup = "8-10",
                    Language = "English",
                    ImageUrl = "/images/products/math-game.jpg",
                    Rating = 4.6m,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "My First Science Experiments",
                    Sku = "FSE-005",
                    Description = "Safe and easy science experiments for young learners. Includes all materials and step-by-step instructions.",
                    PriceCents = 34900, // ₹349.00
                    Currency = "INR",
                    Stock = 40,
                    Category = "science-kits",
                    AgeGroup = "5-7",
                    Language = "English",
                    ImageUrl = "/images/products/first-science.jpg",
                    Rating = 4.4m,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Telugu Stories for Kids - Set of 5",
                    Sku = "TSK-006",
                    Description = "Collection of 5 beautifully illustrated storybooks in Telugu. Perfect for bedtime reading and language learning.",
                    PriceCents = 59900, // ₹599.00
                    Currency = "INR",
                    Stock = 30,
                    Category = "books",
                    AgeGroup = "3-5",
                    Language = "Telugu",
                    ImageUrl = "/images/products/telugu-stories.jpg",
                    Rating = 4.7m,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Creative Art & Craft Mega Box",
                    Sku = "ACM-007",
                    Description = "Complete art supplies box with paints, brushes, colored paper, glue, and project ideas. Sparks creativity!",
                    PriceCents = 69900, // ₹699.00
                    Currency = "INR",
                    Stock = 20,
                    Category = "art-supplies",
                    AgeGroup = "5-7",
                    Language = "English",
                    ImageUrl = "/images/products/art-box.jpg",
                    Rating = 4.9m,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Coding Robot for Beginners",
                    Sku = "CRB-008",
                    Description = "Introduction to coding with this programmable robot. No screen required, uses command cards. Ages 8+.",
                    PriceCents = 79900, // ₹799.00
                    Currency = "INR",
                    Stock = 15,
                    Category = "robotics",
                    AgeGroup = "8-10",
                    Language = "English",
                    ImageUrl = "/images/products/coding-robot.jpg",
                    Rating = 4.8m,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            await context.Products.AddRangeAsync(products);

            // ============================================
            // SAVE ALL CHANGES
            // ============================================
            await context.SaveChangesAsync();

            Console.WriteLine("✅ Database seeded successfully!");
            Console.WriteLine($"✅ Created admin user: {adminUser.Email}");
            Console.WriteLine($"✅ Created {products.Count} sample products");
        }
    }
}
