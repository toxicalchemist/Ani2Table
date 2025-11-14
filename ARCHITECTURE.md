# Ani2Table System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                           │
│                     http://localhost:3000                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ REST API Calls
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      REACT FRONTEND                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Landing    │  │     Auth     │  │   Consumer   │          │
│  │     Page     │  │   Pages      │  │  Dashboard   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Farmer    │  │    Admin     │  │  Components  │          │
│  │  Dashboard   │  │  Dashboard   │  │   (Shared)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   SERVICES LAYER                         │   │
│  │  authService | productService | cartService | etc.      │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ JWT Token in Headers
                            │ Authorization: Bearer <token>
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                  EXPRESS.JS BACKEND SERVER                       │
│                     http://localhost:5000                        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE                            │   │
│  │  CORS | Body Parser | JWT Auth | Error Handler          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      ROUTES                              │   │
│  │  /api/auth | /api/products | /api/cart | /api/orders    │   │
│  │  /api/messages | /api/admin                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   CONTROLLERS                            │   │
│  │  authController | productController | cartController    │   │
│  │  orderController | messageController | adminController  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 DATABASE CONNECTION                      │   │
│  │               MySQL Connection Pool                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ SQL Queries
                            │ Connection Pool
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                       MYSQL DATABASE                             │
│                      ani2table (Database)                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    users     │  │   products   │  │     cart     │          │
│  │──────────────│  │──────────────│  │──────────────│          │
│  │ id           │  │ id           │  │ id           │          │
│  │ username     │  │ farmer_id    │  │ consumer_id  │          │
│  │ password     │  │ name         │  │ product_id   │          │
│  │ email        │  │ price        │  │ quantity     │          │
│  │ user_type    │  │ quantity     │  └──────────────┘          │
│  └──────────────┘  └──────────────┘                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   orders     │  │ order_items  │  │ transactions │          │
│  │──────────────│  │──────────────│  │──────────────│          │
│  │ id           │  │ id           │  │ id           │          │
│  │ consumer_id  │  │ order_id     │  │ order_id     │          │
│  │ total_amount │  │ product_id   │  │ amount       │          │
│  │ status       │  │ quantity     │  │ status       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   messages   │                                               │
│  │──────────────│                                               │
│  │ id           │                                               │
│  │ sender_id    │                                               │
│  │ receiver_id  │                                               │
│  │ message      │                                               │
│  └──────────────┘                                               │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
1. User enters credentials
2. Frontend sends POST to /api/auth/login
3. Backend validates credentials with bcrypt
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Token sent with all subsequent requests
```

### Product Purchase Flow
```
1. Consumer browses products (/api/products)
2. Adds to cart (POST /api/cart)
3. Views cart (GET /api/cart)
4. Creates order (POST /api/orders)
   - Backend starts transaction
   - Creates order record
   - Creates order_items records
   - Updates product quantities
   - Clears cart
   - Commits transaction
5. Farmer sees order (GET /api/orders)
6. Updates status (PUT /api/orders/:id/status)
7. Consumer sees updated status
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│           Security Features                  │
├─────────────────────────────────────────────┤
│ 1. Password Hashing (bcrypt)                │
│ 2. JWT Token Authentication                 │
│ 3. Role-Based Authorization                 │
│ 4. SQL Injection Prevention (parameterized) │
│ 5. CORS Protection                          │
│ 6. Environment Variables (.env)             │
└─────────────────────────────────────────────┘
```

## User Roles & Permissions

```
┌─────────────┬──────────┬────────┬─────────┐
│  Feature    │ Consumer │ Farmer │  Admin  │
├─────────────┼──────────┼────────┼─────────┤
│ View Products│    ✓     │   ✓    │    ✓    │
│ Add to Cart  │    ✓     │   ✗    │    ✗    │
│ Place Order  │    ✓     │   ✗    │    ✗    │
│ Add Products │    ✗     │   ✓    │    ✓    │
│ Update Status│    ✗     │   ✓    │    ✓    │
│ View Analytics│   ✗     │   ✗    │    ✓    │
│ Manage Users │    ✗     │   ✗    │    ✓    │
│ Transactions │    ✗     │   ✗    │    ✓    │
└─────────────┴──────────┴────────┴─────────┘
```

## Technology Stack Details

```
Frontend Stack:
├── React 18.2.0
├── React Router 6.20.0
├── TailwindCSS 3.3.6
└── Recharts 2.10.0

Backend Stack:
├── Node.js
├── Express 4.18.2
├── MySQL2 3.6.5
├── JWT 9.0.2
├── bcryptjs 2.4.3
└── CORS 2.8.5

Database:
└── MySQL 5.7+ / 8.0+
```

## Directory Structure Map

```
Ani2Table/
│
├── Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   ├── ProductCard.js
│   │   │   └── Toast.js
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── AdminAnalytics.js
│   │   │   │   └── AdminProducts.js
│   │   │   ├── farmer/
│   │   │   │   ├── FarmerDashboard.js
│   │   │   │   └── FarmerProducts.js
│   │   │   └── consumer/
│   │   │       ├── ConsumerDashboard.js
│   │   │       └── ConsumerCart.js
│   │   │
│   │   └── services/
│   │       ├── authService.js
│   │       ├── productService.js
│   │       ├── cartService.js
│   │       ├── orderService.js
│   │       ├── messageService.js
│   │       └── adminService.js
│   │
│   └── public/
│       └── index.html
│
└── Backend (Express + MySQL)
    ├── server/
    │   ├── config/
    │   │   ├── db.js
    │   │   └── database.sql
    │   │
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── productController.js
    │   │   ├── cartController.js
    │   │   ├── orderController.js
    │   │   ├── messageController.js
    │   │   └── adminController.js
    │   │
    │   ├── middleware/
    │   │   └── auth.js
    │   │
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── productRoutes.js
    │   │   ├── cartRoutes.js
    │   │   ├── orderRoutes.js
    │   │   ├── messageRoutes.js
    │   │   └── adminRoutes.js
    │   │
    │   ├── scripts/
    │   │   └── hashPassword.js
    │   │
    │   ├── .env
    │   └── server.js
    │
    └── MySQL Database
        └── ani2table
            ├── users
            ├── products
            ├── cart
            ├── orders
            ├── order_items
            ├── transactions
            └── messages
```

## API Request Flow Example

```
GET /api/products Request:
────────────────────────────

Client (Browser)
    │
    ├─ GET http://localhost:5000/api/products
    │  Headers: { Authorization: Bearer <token> }
    │
    ▼
Express Server (server.js)
    │
    ├─ Route: productRoutes.js
    │  GET /products → getAllProducts
    │
    ▼
Controller (productController.js)
    │
    ├─ Business Logic
    │  - Parse query parameters
    │  - Build SQL query
    │
    ▼
Database (MySQL)
    │
    ├─ Execute Query:
    │  SELECT * FROM products WHERE status = 'available'
    │
    ▼
Response
    │
    ├─ Format data as JSON
    │  { success: true, products: [...] }
    │
    ▼
Client Receives Response
    │
    └─ Update UI with product list
```

## Environment Configuration

```
Development:
├── Frontend: http://localhost:3000
├── Backend:  http://localhost:5000
└── Database: localhost:3306

Production (recommended):
├── Frontend: https://yourdomain.com
├── Backend:  https://api.yourdomain.com
└── Database: Cloud MySQL instance
```

## Deployment Considerations

```
Frontend Deployment:
├── Build: npm run build
├── Deploy: build/ folder to hosting
└── Popular: Vercel, Netlify, AWS S3

Backend Deployment:
├── Platform: Heroku, AWS, DigitalOcean
├── Database: AWS RDS, Google Cloud SQL
└── Environment: Set all .env variables

Database:
├── Cloud MySQL (AWS RDS, Google Cloud SQL)
├── Or: Dedicated MySQL server
└── Configure: Backups, security groups
```
