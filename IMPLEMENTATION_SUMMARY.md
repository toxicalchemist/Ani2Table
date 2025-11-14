# Ani2Table MySQL Database Integration

## ✅ What Has Been Implemented

I've successfully integrated a complete MySQL database system into your Ani2Table application. Here's what was created:

### 🗄️ Database Structure
- **Complete MySQL Schema** (`server/config/database.sql`)
  - Users table (consumers, farmers, admins)
  - Products table
  - Orders & Order Items tables
  - Shopping Cart table
  - Transactions table
  - Messages table
  - All with proper indexes and foreign keys

### 🔧 Backend Server (Node.js + Express)
Located in the `server/` folder:
- **Express API Server** with JWT authentication
- **MySQL Connection Pool** with proper error handling
- **RESTful API Endpoints** for:
  - Authentication (register, login, profile)
  - Products (CRUD operations)
  - Shopping Cart
  - Orders & Order Management
  - Messages
  - Admin Analytics & Reports

### 🎨 Frontend Services
Updated all services in `src/services/`:
- `authService.js` - Now uses API instead of localStorage
- `productService.js` - Product management
- `cartService.js` - Shopping cart operations
- `orderService.js` - Order processing
- `messageService.js` - Messaging system
- `adminService.js` - Analytics and admin functions

### 📦 Package Configuration
- Added necessary dependencies (mysql2, express, jwt, bcrypt, cors)
- Created scripts to run both frontend and backend together
- Added environment configuration files

## 🚀 Next Steps to Get Running

### 1. Install Dependencies
```powershell
# Install frontend dependencies
npm install

# Install backend dependencies
npm run server:install
```

### 2. Set Up MySQL Database

#### a) Make sure MySQL is installed and running
```powershell
mysql --version
```

#### b) Create the database and tables
Option 1 - Using MySQL command line:
```powershell
mysql -u root -p < "server/config/database.sql"
```

Option 2 - Using MySQL Workbench:
1. Open MySQL Workbench
2. Open the file `server/config/database.sql`
3. Execute the script

### 3. Configure Database Credentials

Edit `server/.env` with your MySQL password:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=ani2table
```

### 4. Generate Hashed Passwords for Demo Accounts

Run this command:
```powershell
cd server
node scripts/hashPassword.js
```

Copy the SQL statements it outputs and run them in MySQL.

### 5. Start the Application

```powershell
npm run start:dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📋 Demo Accounts

After setting up passwords:
- **Consumer**: username: `consumer`, password: `password`
- **Farmer**: username: `farmer`, password: `password`
- **Admin**: username: `admin`, password: `password`

## 🔍 Testing the API

Health check endpoint:
```
http://localhost:5000/health
```

## 📝 Important Files Created

```
server/
├── config/
│   ├── db.js                    # MySQL connection
│   └── database.sql             # Database schema
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── productController.js     # Product management
│   ├── cartController.js        # Cart operations
│   ├── orderController.js       # Order processing
│   ├── messageController.js     # Messaging
│   └── adminController.js       # Analytics
├── middleware/
│   └── auth.js                  # JWT authentication
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── messageRoutes.js
│   └── adminRoutes.js
├── scripts/
│   └── hashPassword.js          # Password hashing utility
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── package.json
└── server.js                    # Main server file

src/services/                    # Updated frontend services
├── authService.js               # ✅ Updated
├── productService.js            # ✅ New
├── cartService.js               # ✅ New
├── orderService.js              # ✅ New
├── messageService.js            # ✅ New
└── adminService.js              # ✅ New

Root files:
├── .env                         # Frontend env
├── DATABASE_README.md           # Full documentation
└── SETUP_GUIDE.md              # Quick setup guide
```

## 🎯 Key Features

1. **Secure Authentication**: JWT tokens + bcrypt password hashing
2. **Role-Based Access**: Different permissions for consumers, farmers, and admins
3. **Transaction Safety**: Database transactions for order processing
4. **RESTful API**: Clean, organized endpoints
5. **Error Handling**: Comprehensive error handling throughout
6. **CORS Enabled**: Frontend can communicate with backend

## 🛠️ API Endpoints Summary

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/products` - List all products
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/admin/analytics` - Get analytics (admin only)
- And many more...

See `DATABASE_README.md` for complete API documentation.

## ⚠️ Important Notes

1. **Update MySQL Password**: Edit `server/.env` with your actual MySQL password
2. **Generate Demo Passwords**: Run the hashPassword.js script
3. **Port Conflicts**: If port 5000 or 3000 are in use, update in .env files
4. **Never Commit .env**: The .env files are gitignored for security

## 📚 Documentation

- **DATABASE_README.md** - Complete documentation
- **SETUP_GUIDE.md** - Quick setup guide
- **server/config/database.sql** - Database schema with comments

Your application is now ready with a complete MySQL database backend! 🎉
