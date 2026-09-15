# SINGGLEBEE - Full Stack Setup Guide

## 📋 Prerequisites Installation

### 1. Install .NET 8 SDK
**Windows:**
```powershell
# Download and install from Microsoft
# Visit: https://dotnet.microsoft.com/download/dotnet/8.0

# Verify installation
dotnet --version
# Expected output: 8.0.x
```

### 2. Install Node.js & npm
**Windows:**
```powershell
# Download LTS version from: https://nodejs.org/
# Recommended: v20.x LTS

# Verify installation
node --version
# Expected output: v20.x.x

npm --version
# Expected output: 10.x.x
```

### 3. Install MySQL Server
**Windows:**
```powershell
# Download MySQL Community Server 9.5.0 from:
# https://dev.mysql.com/downloads/mysql/

# During installation:
# - Set root password (remember this!) Admin@123
# - Enable MySQL as Windows Service
# - Add MySQL to PATH

# Verify installation
mysql --version
# Expected output: mysql Ver 8.x.x
```

### 4. Install Visual Studio Code
```powershell
# Download from: https://code.visualstudio.com/

# Install these extensions:
# - C# Dev Kit (Microsoft)
# - ES7+ React/Redux/React-Native snippets
# - ESLint
# - Prettier - Code formatter
# - MySQL (by Weijan Chen)
```

### 5. Install Git (if not installed)
```powershell
# Download from: https://git-scm.com/download/win

# Verify
git --version
```

---

## 🗄️ Database Setup (EF Core Code-First Approach)

### Step 1: Start MySQL Service
```powershell
# Check if MySQL is running
Get-Service MySQL95

# Start MySQL service if not running
Start-Service MySQL95
```

### Step 2: Database Creation (Automated by EF Core)
**Note:** With EF Core Code-First approach, you don't need to manually create the database!

The database will be automatically created when you run:
```powershell
dotnet ef database update
```

However, **MySQL Server must be running** and you need proper connection credentials in `appsettings.json`.

**Optional - Create dedicated database user:**
```powershell
# Login to MySQL as root
mysql -u root -p

# Run these SQL commands:
```

```sql
-- Create dedicated user for application
CREATE USER 'singglebee_user'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';

-- Grant privileges (database will be created by EF Core)
GRANT ALL PRIVILEGES ON singglebee_db.* TO 'singglebee_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

Then update your `appsettings.json` to use this user instead of root.

---

## 🔵 Backend Setup (ASP.NET Core Web API)

### Step 1: Create Project Directory
```powershell
# Navigate to your projects folder
cd d:\python_learning\singglebee

# Create new directory for rewrite
mkdir singglebee-rewrite
cd singglebee-rewrite

# Create backend folder
mkdir backend
cd backend
```

### Step 2: Create ASP.NET Core Web API Project
```powershell
# Create new Web API project
dotnet new webapi -n SingglebeeApi

# Navigate to project
cd SingglebeeApi

# Verify project structure
ls
```

### Step 3: Install Required NuGet Packages
```powershell
# Entity Framework Core for MySQL
dotnet add package Pomelo.EntityFrameworkCore.MySql --version 8.0.0

# EF Core Design tools
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.0

# EF Core Tools
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.0

# JWT Authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.0

# Password Hashing
dotnet add package BCrypt.Net-Next --version 4.0.3

# AutoMapper (optional but recommended)
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection --version 12.0.1

# Verify packages
dotnet list package
```

### Step 4: Update Connection String
Edit `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=singglebee_db;User=root;Password=YourMySQLPassword;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyMinimum32CharactersLong!",
    "Issuer": "SingglebeeApi",
    "Audience": "SingglebeeClient",
    "ExpiryInDays": 7
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Step 5: Install EF Core Tools Globally
```powershell
# Install globally for migrations (required for Code-First approach)
dotnet tool install --global dotnet-ef

# Verify installation
dotnet ef --version
# Expected output: Entity Framework Core .NET Command-line Tools 9.x.x

# Note: This tool is essential for:
# - Creating migrations: dotnet ef migrations add MigrationName
# - Applying migrations: dotnet ef database update
# - Managing database schema from C# models
```

### Step 6: Build and Verify
```powershell
# Restore dependencies (should not have any error/warnings)
dotnet restore

# Build project
dotnet build

# Verify packages are installed correctly
dotnet list package
```

Expected output:
```
Project 'SingglebeeApi' has the following package references
   [net9.0]: 
    Top-level Package                                          Requested   Resolved
   > AutoMapper.Extensions.Microsoft.DependencyInjection      12.0.1      12.0.1
   > BCrypt.Net-Next                                          4.0.3       4.0.3
   > Microsoft.AspNetCore.Authentication.JwtBearer            8.0.0       8.0.0
   > Microsoft.AspNetCore.OpenApi                             9.0.11      9.0.11
   > Microsoft.EntityFrameworkCore.Design                     9.0.10      9.0.10
   > Microsoft.EntityFrameworkCore.Tools                      9.0.10      9.0.10
   > Pomelo.EntityFrameworkCore.MySql                         9.0.0       9.0.0
```

**Note:** Don't run the project yet! We need to create models and migrations first.
---

## 🟢 Frontend Setup (React + TypeScript + Chakra UI)

### Step 1: Create Frontend Directory
```powershell
# Navigate back to root
cd d:\python_learning\singglebee\singglebee-rewrite

# Create frontend folder
mkdir frontend
cd frontend
```

### Step 2: Create Vite + React + TypeScript Project
```powershell
# Create project using Vite
npm create vite@latest . -- --template react-ts

# When prompted:
# - Scaffold project in current directory? Yes
# - Select framework: React
# - Select variant: TypeScript
```

### Step 3: Install Core Dependencies
```powershell
# Install base dependencies
npm install

# Install Chakra UI
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

# Install Chakra UI Icons
npm install @chakra-ui/icons

# Install React Router
npm install react-router-dom

# Install TypeScript types for React Router
npm install -D @types/react-router-dom
```

### Step 4: Install Additional Libraries
```powershell
# HTTP Client
npm install axios

# State Management
npm install zustand

# JWT Decoding
npm install jwt-decode

# Form Handling (optional)
npm install react-hook-form

# Data Fetching (optional)
npm install @tanstack/react-query
```

### Step 5: Install Development Dependencies
```powershell
# ESLint and Prettier
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react

# TypeScript types
npm install -D @types/node
```

### Step 6: Verify Installation
```powershell
# Check package.json
cat package.json

# Start development server
npm run dev
# Should start at: http://localhost:5173
```

---

## 📦 Complete Dependency List

### Backend (C# .NET 8)
```xml
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
```

### Frontend (React + TypeScript)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0",
    "@chakra-ui/react": "^2.8.2",
    "@chakra-ui/icons": "^2.1.1",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "framer-motion": "^10.16.16",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.14.2",
    "jwt-decode": "^4.0.0",
    "react-hook-form": "^7.48.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/node": "^20.10.4",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  }
}
```

---

## ✅ Verification Checklist

### 1. Backend Verification
```powershell
cd d:\python_learning\singglebee\singglebee-rewrite\backend\SingglebeeApi

# Check .NET version
dotnet --version

# List installed packages
dotnet list package

# Build project
dotnet build

# Run project
dotnet run
# Access: https://localhost:5001/swagger
```

### 2. Frontend Verification
```powershell
cd d:\python_learning\singglebee\singglebee-rewrite\frontend

# Check Node version
node --version

# Check installed packages
npm list --depth=0

# Start dev server
npm run dev
# Access: http://localhost:5173
```

### 3. Database Verification (After EF Core Migrations)
```powershell
# After running 'dotnet ef database update', verify:

# Check if database was created
mysql -u root -p -e "SHOW DATABASES;"

# Check tables created by EF Core
mysql -u root -p singglebee_db -e "SHOW TABLES;"

# Or use EF Core CLI to check migration status
cd d:\python_learning\singglebee\singglebee-rewrite\backend\SingglebeeApi
dotnet ef migrations list
```

---

## 🚀 Quick Start Commands

### Start Backend
```powershell
cd d:\python_learning\singglebee\singglebee-rewrite\backend\SingglebeeApi
dotnet run
```

### Start Frontend
```powershell
cd d:\python_learning\singglebee\singglebee-rewrite\frontend
npm run dev
```

### Start MySQL
```powershell
Start-Service MySQL95
```

---

## 🔧 Troubleshooting

### Issue: .NET command not found
**Solution:**
```powershell
# Restart PowerShell
# Or add to PATH manually:
$env:Path += ";C:\Program Files\dotnet"
```

### Issue: MySQL connection failed
**Solution:**
```powershell
# Check MySQL service
Get-Service MySQL95

# Restart service
Restart-Service MySQL95

# Verify connection string in appsettings.json
```

### Issue: npm install fails
**Solution:**
```powershell
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Issue: Port already in use
**Solution:**
```powershell
# For backend (usually port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For frontend (usually port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 📁 Final Project Structure

```
singglebee-rewrite/
├── backend/
│   └── SingglebeeApi/
│       ├── Controllers/
│       ├── Models/
│       ├── Data/
│       ├── Services/
│       ├── DTOs/
│       ├── appsettings.json
│       ├── Program.cs
│       └── SingglebeeApi.csproj
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── docs/
    ├── SETUP_GUIDE.md
    └── FEATURES_DATAMODEL.md
```

---

## 📝 Next Steps (EF Core Code-First Workflow)

After completing this setup:
1. ✅ All prerequisites installed
2. ✅ MySQL service running
3. ✅ Backend project created with EF Core dependencies
4. ✅ Frontend project structure ready

**Next: Create Backend with EF Core Code-First**

The workflow will be:
```
1. Create Entity Models (10 classes)
   - User.cs, Product.cs, Cart.cs, CartItem.cs
   - Order.cs, OrderItem.cs, OrderPayment.cs
   - PaymentTransaction.cs, PasswordResetToken.cs, AuditLog.cs

2. Create ApplicationDbContext
   - Configure entity relationships
   - Configure table names and constraints
   - Add seed data

3. Create Initial Migration
   > dotnet ef migrations add InitialCreate

4. Apply Migration (Creates Database Automatically!)
   > dotnet ef database update

5. Create DTOs and Services
6. Create API Controllers
7. Test with Swagger
```

**Key EF Core Migration Commands:**
```powershell
# Create new migration
dotnet ef migrations add MigrationName

# Apply migrations (creates/updates database)
dotnet ef database update

# Rollback to previous migration
dotnet ef database update PreviousMigrationName

# Remove last unapplied migration
dotnet ef migrations remove

# List all migrations
dotnet ef migrations list

# Generate SQL script
dotnet ef migrations script

# Drop database (careful!)
dotnet ef database drop --force
```

---

## 🆘 Support

If you encounter issues:
1. Check versions match this guide
2. Review error messages carefully
3. Ensure all services are running
4. Verify connection strings
5. Check firewall settings

**Common Commands:**
```powershell
# Check all versions
dotnet --version
node --version
npm --version
mysql --version

# Service status
Get-Service MySQL95

# Test database connection
mysql -u root -p -e "SHOW DATABASES;"
```
