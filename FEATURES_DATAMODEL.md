# SINGGLEBEE - Enhanced Features & Data Model

## 🎯 New Features Overview

### 1. **Admin Interface**
- ✅ Full CRUD operations for products
- ✅ Product inventory management
- ✅ Order management and status updates
- ✅ User management
- ✅ Sales analytics and reports
- ✅ Audit logging for all admin actions

### 2. **Password Reset System**
- ✅ Email-based password reset
- ✅ Secure token generation with expiry
- ✅ Token validation and single-use enforcement
- ✅ Password strength validation

### 3. **Guest User Shopping**
- ✅ Browse products without login
- ✅ Add items to cart (session-based)
- ✅ Mandatory login at checkout
- ✅ Cart persistence after login
- ✅ Cart expiration after 7 days

### 4. **Enhanced Payment System**
- ✅ Multi-PSP support (Razorpay, Stripe, etc.)
- ✅ Payment webhook handling
- ✅ Transaction logging and reconciliation
- ✅ Refund management
- ✅ Payment status tracking

---

## 📊 Enhanced Data Model

### **Key Improvements:**

#### **1. Price Storage in Cents**
```
Old: price (decimal) → ₹299.00
New: price_cents (int) → 29900 (₹299.00)
```
**Benefits:**
- Eliminates floating-point precision errors
- Easier calculations
- Better database performance
- Standard practice for financial data

#### **2. UUIDs for Primary Keys**
```
Old: id (INT AUTO_INCREMENT)
New: id (UUID/CHAR(36))
```
**Benefits:**
- Globally unique identifiers
- No collision in distributed systems
- Better security (non-sequential)
- Easier data migration

#### **3. Normalized Cart System**
```
Old: cart stored in localStorage only
New: carts + cart_items tables
```
**Benefits:**
- Server-side cart persistence
- Guest cart support with session_id
- Cart recovery after login
- Analytics on abandoned carts

#### **4. Comprehensive Order System**
```
orders → order_items → order_payments → payment_transactions
```
**Benefits:**
- Full order lifecycle tracking
- Multiple payment attempts per order
- Detailed transaction logs
- Better reconciliation

---

## 🗂️ Complete Database Schema

### **Tables Overview:**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **users** | User accounts | email, hashed_password, role, reset_token |
| **products** | Product catalog | sku, price_cents, stock, is_active |
| **carts** | Shopping carts | user_id (nullable), session_id, expires_at |
| **cart_items** | Cart contents | cart_id, product_id, quantity |
| **orders** | Customer orders | order_number, total_cents, status, payment_status |
| **order_items** | Order line items | order_id, product_id, quantity, price_cents |
| **order_payments** | Payment records | psp, psp_payment_id, status, metadata |
| **payment_transactions** | Payment logs | transaction_type, request/response payloads |
| **password_reset_tokens** | Password resets | token, expires_at, used |
| **audit_logs** | Admin actions | action, entity_type, old/new values |

---

## 🔐 Security Features

### **1. Password Reset Flow**
```
1. User requests reset → Email sent with token
2. Token valid for 1 hour
3. User clicks link → Validates token
4. New password set → Token marked as used
5. Old sessions invalidated
```

### **2. Guest Cart Security**
```
1. Generate secure session_id
2. Store in cookies (HttpOnly, Secure)
3. Link to cart on server
4. Merge with user cart on login
5. Clean expired carts automatically
```

### **3. Payment Security**
```
1. All amounts in cents (integer)
2. Webhook signature verification
3. Transaction logging
4. Idempotency for webhook retries
5. Status validation before capture
```

---

## 🛒 Guest User Shopping Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    GUEST USER JOURNEY                        │
└─────────────────────────────────────────────────────────────┘

1. Visit Website
   ↓
2. Browse Products (No Login Required)
   - View product catalog
   - Search & filter
   - View product details
   ↓
3. Add to Cart
   - Server creates cart with session_id
   - session_id stored in cookie
   - Cart expires in 7 days
   ↓
4. Continue Shopping or Checkout
   ↓
5. Click Checkout
   ↓
6. LOGIN REQUIRED ← Mandatory
   - Redirect to login/register page
   - Show "Please login to complete checkout"
   ↓
7a. Login (Existing User)          7b. Register (New User)
   - Merge guest cart with user        - Create account
   - Preserve cart items               - Link cart to new user
   ↓                                    ↓
8. Complete Checkout
   - Enter shipping details
   - Select payment method
   - Place order
   ↓
9. Payment
   - Redirect to payment gateway
   - Handle payment callback
   ↓
10. Order Confirmation
```

---

## 🔧 Admin Interface Features

### **Product Management**
```typescript
interface AdminProductActions {
  create: {
    name: string;
    sku: string;
    description: string;
    price_cents: number;
    stock: number;
    category: string;
    age_group: string;
    language: string;
    image_url: string;
  };
  
  update: {
    id: string;
    // Same fields as create
  };
  
  delete: {
    id: string;
    soft_delete: boolean; // Set is_active = false
  };
  
  updateStock: {
    id: string;
    stock_adjustment: number; // +/- quantity
  };
  
  bulkUpload: {
    file: File; // CSV/Excel
    validate: boolean;
  };
}
```

### **Order Management**
```typescript
interface AdminOrderActions {
  listOrders: {
    status?: OrderStatus;
    payment_status?: PaymentStatus;
    date_from?: Date;
    date_to?: Date;
  };
  
  viewOrder: {
    id: string;
    include_items: boolean;
    include_payments: boolean;
  };
  
  updateStatus: {
    id: string;
    new_status: OrderStatus;
    notes?: string;
  };
  
  processRefund: {
    order_id: string;
    amount_cents: number;
    reason: string;
  };
}
```

### **Analytics Dashboard**
```typescript
interface AdminAnalytics {
  salesOverview: {
    total_revenue: number;
    total_orders: number;
    average_order_value: number;
    period: 'day' | 'week' | 'month' | 'year';
  };
  
  topProducts: {
    product_id: string;
    name: string;
    units_sold: number;
    revenue: number;
  }[];
  
  inventoryAlerts: {
    low_stock_products: Product[];
    out_of_stock_products: Product[];
  };
  
  recentOrders: Order[];
}
```

---

## 💳 Payment Integration

### **Supported PSPs**
- Razorpay (Primary for India)
- Stripe (International)
- PayPal (Optional)
- UPI (Direct integration)

### **Payment Flow**
```
1. Create Order
   POST /api/orders
   Response: { order_id, amount_cents }

2. Initiate Payment
   POST /api/payments/initiate
   Request: { order_id, psp: 'razorpay' }
   Response: { payment_id, redirect_url }

3. Redirect to PSP
   User completes payment on Razorpay/Stripe

4. Webhook Callback
   POST /api/webhooks/payment/{psp}
   - Verify signature
   - Update payment status
   - Update order status
   - Log transaction

5. Redirect User
   GET /orders/{order_id}/success
   - Show confirmation page
   - Send email notification
```

### **Webhook Handling**
```typescript
interface WebhookPayload {
  psp: string;
  event_type: string;
  payment_id: string;
  order_id: string;
  status: string;
  amount_cents: number;
  signature: string;
  raw_payload: any;
}

async function handleWebhook(payload: WebhookPayload) {
  // 1. Verify signature
  if (!verifySignature(payload)) {
    throw new Error('Invalid signature');
  }
  
  // 2. Check idempotency
  const existing = await checkExistingTransaction(payload.payment_id);
  if (existing) return { status: 'already_processed' };
  
  // 3. Log transaction
  await logPaymentTransaction(payload);
  
  // 4. Update payment and order
  await updatePaymentStatus(payload);
  
  // 5. Trigger notifications
  await sendNotifications(payload.order_id);
  
  return { status: 'success' };
}
```

---

## 📧 Email Notifications

### **Email Templates Required**

1. **Password Reset**
   - Subject: Reset Your SINGGLEBEE Password
   - Content: Reset link with token
   - Expiry: 1 hour

2. **Order Confirmation**
   - Subject: Order Confirmed - #{order_number}
   - Content: Order details, items, total
   - CTA: Track Order

3. **Payment Success**
   - Subject: Payment Received - #{order_number}
   - Content: Payment details, receipt
   - CTA: Download Invoice

4. **Order Shipped**
   - Subject: Your Order is On The Way!
   - Content: Tracking number, expected delivery
   - CTA: Track Shipment

5. **Welcome Email**
   - Subject: Welcome to SINGGLEBEE!
   - Content: Getting started guide
   - CTA: Browse Products

---

## 🔄 Data Migration from Old Schema

### **Migration Steps**

```sql
-- 1. Migrate Users (no changes needed for basic fields)
INSERT INTO singglebee_db.users (id, name, email, hashed_password, role, created_at)
SELECT 
    UUID() as id,
    name,
    email,
    password_hash,
    role,
    created_at
FROM old_db.users;

-- 2. Migrate Products
INSERT INTO singglebee_db.products (
    id, name, sku, description, price_cents, currency, stock,
    category, age_group, language, image_url, rating, is_active
)
SELECT 
    UUID() as id,
    name,
    CONCAT('BOOK-', UPPER(SUBSTRING(category, 1, 3)), '-', LPAD(id, 3, '0')) as sku,
    description,
    ROUND(price * 100) as price_cents, -- Convert ₹299.00 to 29900
    'INR' as currency,
    COALESCE(inventory_count, 0) as stock,
    category,
    age_group,
    language,
    image_url,
    rating,
    TRUE as is_active
FROM old_db.products;

-- 3. Migrate Orders (requires mapping user_ids)
-- Create temporary mapping table
CREATE TEMPORARY TABLE user_mapping AS
SELECT old.id as old_id, new.id as new_id
FROM old_db.users old
JOIN singglebee_db.users new ON old.email = new.email;

INSERT INTO singglebee_db.orders (
    id, user_id, order_number, customer_name, customer_email,
    total_cents, currency, status, created_at
)
SELECT 
    UUID() as id,
    um.new_id as user_id,
    CONCAT('ORD-', LPAD(o.id, 8, '0')) as order_number,
    o.customer_name,
    o.customer_email,
    ROUND(o.total_amount * 100) as total_cents,
    'INR' as currency,
    CASE o.status
        WHEN 'pending' THEN 'created'
        WHEN 'confirmed' THEN 'paid'
        ELSE o.status
    END as status,
    o.created_at
FROM old_db.orders o
JOIN user_mapping um ON o.user_id = um.old_id;
```

---

## 🧪 Testing Checklist

### **Backend API Tests**
- [ ] User registration
- [ ] User login
- [ ] Password reset flow
- [ ] Product CRUD (admin)
- [ ] Product listing (public)
- [ ] Cart creation (guest)
- [ ] Cart merge on login
- [ ] Order creation
- [ ] Payment initiation
- [ ] Webhook handling
- [ ] Order status updates

### **Frontend Tests**
- [ ] Guest browsing
- [ ] Product search/filter
- [ ] Add to cart (guest)
- [ ] Login redirect at checkout
- [ ] Cart persistence
- [ ] Checkout flow
- [ ] Payment integration
- [ ] Order confirmation
- [ ] Admin product management
- [ ] Admin order management

### **Security Tests**
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] JWT validation
- [ ] Password strength
- [ ] Reset token expiry
- [ ] Webhook signature verification

---

## 📱 API Endpoints Reference

### **Public Endpoints**
```
GET    /api/products              - List products
GET    /api/products/:id          - Get product details
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
POST   /api/auth/forgot-password  - Request password reset
POST   /api/auth/reset-password   - Reset password
```

### **Authenticated Endpoints**
```
GET    /api/cart                  - Get user cart
POST   /api/cart/items            - Add item to cart
PUT    /api/cart/items/:id        - Update cart item
DELETE /api/cart/items/:id        - Remove cart item
POST   /api/orders                - Create order
GET    /api/orders                - Get user orders
GET    /api/orders/:id            - Get order details
POST   /api/payments/initiate     - Initiate payment
```

### **Admin Endpoints**
```
GET    /api/admin/products        - List all products
POST   /api/admin/products        - Create product
PUT    /api/admin/products/:id    - Update product
DELETE /api/admin/products/:id    - Delete product
GET    /api/admin/orders          - List all orders
PUT    /api/admin/orders/:id      - Update order status
POST   /api/admin/orders/:id/refund - Process refund
GET    /api/admin/analytics       - Get analytics data
GET    /api/admin/audit-logs      - Get audit logs
```

### **Webhook Endpoints**
```
POST   /api/webhooks/razorpay     - Razorpay webhook
POST   /api/webhooks/stripe       - Stripe webhook
```

---

## 🚀 Next Implementation Steps

1. ✅ **Database Schema Created** - `database/schema.sql`
2. ⏳ **Backend Models** - Create C# entity models
3. ⏳ **Backend Services** - Implement business logic
4. ⏳ **Backend Controllers** - Create API endpoints
5. ⏳ **Frontend Components** - Build React UI with Chakra
6. ⏳ **Admin Dashboard** - Create admin interface
7. ⏳ **Payment Integration** - Implement Razorpay/Stripe
8. ⏳ **Email Service** - Setup email notifications
9. ⏳ **Testing** - Write unit and integration tests
10. ⏳ **Deployment** - Deploy to production

---

## 📝 Configuration Files Needed

### **Backend (appsettings.json)**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=singglebee_db;User=root;Password=Admin@123;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyMinimum32CharactersLong!",
    "Issuer": "SingglebeeApi",
    "Audience": "SingglebeeClient",
    "ExpiryInDays": 7
  },
  "Razorpay": {
    "KeyId": "rzp_test_xxxxx",
    "KeySecret": "xxxxx",
    "WebhookSecret": "xxxxx"
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "Username": "noreply@singglebee.com",
    "Password": "xxxxx",
    "FromEmail": "noreply@singglebee.com",
    "FromName": "SINGGLEBEE"
  },
  "Cart": {
    "GuestCartExpiryDays": 7,
    "CleanupIntervalHours": 24
  }
}
```

### **Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_ENABLE_ANALYTICS=true
VITE_SESSION_TIMEOUT_MINUTES=30
```

---

## 🎨 UI/UX Enhancements

### **Guest User Experience**
- Clear "Login to Checkout" messaging
- Cart icon shows item count without login
- Smooth transition from guest to logged-in state
- Cart preservation across sessions

### **Admin Interface**
- Dashboard with key metrics
- Quick actions for common tasks
- Bulk operations for products
- Real-time order notifications
- Export functionality for reports

### **Password Reset**
- Clear instructions
- Password strength indicator
- Success confirmation
- Auto-login after reset

---

Ready to proceed with implementation? Which part would you like to start with:
1. **Backend Models & DbContext**
2. **API Controllers**
3. **Frontend Components**
4. **Admin Dashboard**
