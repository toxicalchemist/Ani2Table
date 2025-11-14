# Ani2Table

A full-stack platform connecting farmers directly with consumers, featuring a complete MySQL database backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL Server (v5.7+)
- npm or yarn

### Setup

1. **Install dependencies:**
```bash
npm install
npm run server:install
```

2. **Set up database:**
```bash
mysql -u root -p < server/config/database.sql
```

3. **Configure environment:**
Edit `server/.env` with your MySQL credentials

4. **Generate demo passwords:**
```bash
cd server
node scripts/hashPassword.js
```

5. **Start the application:**
```bash
npm run start:dev
```

**For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Quick setup instructions
- **[DATABASE_README.md](DATABASE_README.md)** - Complete database documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was implemented
- **[API_REFERENCE.md](API_REFERENCE.md)** - API endpoints reference

## ✨ Features

### For Consumers
- Browse and search products from local farmers
- Shopping cart with real-time updates
- Order tracking from placement to delivery
- Direct messaging with farmers
- User profile management

### For Farmers
- Product listing and inventory management
- Order management and fulfillment
- Sales analytics and insights
- Direct communication with customers
- Profile customization

### For Admins
- Comprehensive analytics dashboard
- User management (consumers, farmers)
- Product and order oversight
- Transaction monitoring
- Platform-wide reports

## 🛠️ Technologies

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Recharts (analytics)

### Backend
- Node.js + Express
- MySQL Database
- JWT Authentication
- bcryptjs (password hashing)
- CORS enabled

## 📦 Project Structure

```
Ani2Table/
├── src/                    # Frontend React application
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin dashboard
│   │   ├── consumer/      # Consumer pages
│   │   └── farmer/        # Farmer pages
│   └── services/          # API service functions
├── server/                # Backend Node.js server
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic
│   ├── middleware/       # Custom middleware
│   ├── routes/          # API routes
│   └── scripts/         # Utility scripts
└── public/              # Static assets
```

## 🔐 Demo Accounts

After setup:
- **Consumer**: `consumer` / `password`
- **Farmer**: `farmer` / `password`
- **Admin**: `admin` / `password`

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📖 Available Scripts

### Frontend + Backend
```bash
npm run start:dev        # Run both concurrently
```

### Frontend Only
```bash
npm start               # Development server
npm run build          # Production build
npm test               # Run tests
```

### Backend Only
```bash
cd server
npm start              # Start API server
npm run dev            # Start with nodemon
```

## 🔧 Configuration

### Backend (.env in server/)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ani2table
JWT_SECRET=your_secret_key
```

### Frontend (.env in root)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚨 Troubleshooting

### Database Connection Failed
- Verify MySQL is running
- Check credentials in `server/.env`
- Ensure `ani2table` database exists

### Port Already in Use
- Change `PORT` in `server/.env` (backend)
- Change port in React scripts (frontend)

### Invalid Credentials
- Run `server/scripts/hashPassword.js`
- Update passwords in database
- Or register new accounts

## 📄 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For issues, please check the documentation or open an issue in the repository.
