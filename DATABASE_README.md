# Ani2Table - Farm to Table Marketplace

A full-stack web application connecting farmers directly with consumers, built with React and Node.js with MySQL database.

## Features

- **User Roles**: Admin, Farmer, and Consumer with role-based access control
- **Product Management**: Farmers can list and manage their products
- **Shopping Cart**: Consumers can add products to cart and place orders
- **Order Management**: Track orders from placement to delivery
- **Messaging System**: Direct communication between users
- **Analytics Dashboard**: Admin insights into sales, products, and users
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing

## Tech Stack

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Recharts (for analytics)

### Backend
- Node.js with Express
- MySQL Database
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Ani2Table
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
npm run server:install
```

### 4. Set up MySQL Database

#### Option A: Using MySQL Workbench or Command Line
1. Open MySQL Workbench or command line
2. Run the SQL script located at `server/config/database.sql`

```bash
mysql -u root -p < server/config/database.sql
```

#### Option B: Manual Setup
1. Create a database:
```sql
CREATE DATABASE ani2table;
```

2. Import the schema from `server/config/database.sql`

### 5. Configure Environment Variables

#### Backend Configuration
Navigate to `server` folder and edit `.env` file:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ani2table
DB_PORT=3306

JWT_SECRET=change_this_to_a_secure_random_string
JWT_EXPIRE=7d
```

#### Frontend Configuration
Create/edit `.env` in the root folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Initialize Demo Accounts

The database.sql file includes demo accounts:
- **Consumer**: username: `consumer`, password: `password`
- **Farmer**: username: `farmer`, password: `password`
- **Admin**: username: `admin`, password: `password`

> **Note**: These passwords are hashed. You'll need to update them in the database or register new accounts.

## Running the Application

### Development Mode (Recommended)

Run both frontend and backend concurrently:
```bash
npm run start:dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Run Separately

#### Start Backend Only
```bash
cd server
npm start
```

#### Start Frontend Only
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (farmer/admin)
- `PUT /api/products/:id` - Update product (farmer/admin)
- `DELETE /api/products/:id` - Delete product (farmer/admin)

### Cart
- `GET /api/cart` - Get cart items (consumer)
- `POST /api/cart` - Add to cart (consumer)
- `PUT /api/cart/:id` - Update cart item (consumer)
- `DELETE /api/cart/:id` - Remove from cart (consumer)

### Orders
- `POST /api/orders` - Create order (consumer)
- `GET /api/orders` - Get all orders (role-based)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (farmer/admin)
- `PUT /api/orders/:id/payment` - Update payment status (admin)

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read
- `DELETE /api/messages/:id` - Delete message

### Admin
- `GET /api/admin/analytics` - Get analytics data (admin)
- `GET /api/admin/transactions` - Get all transactions (admin)
- `GET /api/admin/users` - Get all users (admin)

## Database Schema

### Tables
- **users** - User accounts (consumers, farmers, admins)
- **products** - Product listings from farmers
- **orders** - Customer orders
- **order_items** - Individual items in orders
- **cart** - Shopping cart items
- **transactions** - Payment transactions
- **messages** - User-to-user messaging

## Project Structure

```
Ani2Table/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin dashboard pages
│   │   ├── consumer/   # Consumer pages
│   │   └── farmer/     # Farmer pages
│   ├── services/       # API service functions
│   └── App.js          # Main app component
├── server/
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── routes/         # API routes
│   └── server.js       # Express server
└── package.json

```

## Troubleshooting

### Database Connection Issues
1. Verify MySQL is running: `mysql --version`
2. Check database credentials in `server/.env`
3. Ensure database `ani2table` exists
4. Check if port 3306 is available

### Port Already in Use
- Frontend (3000): Change in React or kill the process
- Backend (5000): Change PORT in `server/.env`

### CORS Errors
- Ensure backend is running
- Check API_URL in frontend `.env`
- Verify CORS is enabled in `server/server.js`

## Security Notes

- Change JWT_SECRET in production
- Use strong passwords for MySQL
- Enable HTTPS in production
- Never commit `.env` files to version control
- Update demo account passwords

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue in the repository.
