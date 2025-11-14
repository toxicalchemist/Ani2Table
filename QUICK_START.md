# ⚡ Ani2Table - Quick Start Card

Copy this for quick reference!

---

## 🎯 ONE-TIME SETUP (First Run)

```powershell
# Step 1: Install Dependencies
npm install
npm run server:install

# Step 2: Setup Database
mysql -u root -p < server/config/database.sql

# Step 3: Configure
# Edit server/.env - Add your MySQL password

# Step 4: Hash Passwords
cd server
node scripts/hashPassword.js
# Copy the SQL output and run in MySQL

# Step 5: Start Application
cd ..
npm run start:dev
```

---

## 🚀 DAILY USE (Every Day)

```powershell
# Just run this command:
npm run start:dev

# Opens automatically:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## 🔑 LOGIN CREDENTIALS

```
Consumer:  consumer / password
Farmer:    farmer   / password
Admin:     admin    / password
```

---

## 📁 KEY FILES TO EDIT

```
Configuration:
├── server/.env          ← MySQL password here
└── .env                 ← API URL (if changed)

Database:
└── server/config/database.sql

Code:
├── src/pages/           ← Frontend pages
├── src/services/        ← API calls
├── server/controllers/  ← Business logic
└── server/routes/       ← API endpoints
```

---

## 🐛 QUICK FIXES

**"Can't connect to MySQL"**
→ Check server/.env has correct password

**"Port already in use"**
→ Change PORT in server/.env

**"Invalid credentials"**
→ Run hashPassword.js script again

**"CORS error"**
→ Backend not running, start it first

---

## 📚 DOCUMENTATION

```
SETUP_GUIDE.md          ← Start here!
DATABASE_README.md      ← Full details
API_REFERENCE.md        ← API endpoints
ARCHITECTURE.md         ← How it works
SETUP_CHECKLIST.md      ← Step-by-step
COMPLETION_REPORT.md    ← What was built
```

---

## 💻 USEFUL COMMANDS

```powershell
# Install dependencies
npm install
npm run server:install

# Start both (recommended)
npm run start:dev

# Start separately
npm start                 # Frontend only
cd server; npm start      # Backend only

# Test backend
curl http://localhost:5000/health

# Database
mysql -u root -p          # Login to MySQL
USE ani2table;            # Select database
SHOW TABLES;              # List tables
```

---

## 🏗️ PROJECT STRUCTURE

```
Ani2Table/
├── src/                 ← Frontend React
│   ├── components/
│   ├── pages/
│   └── services/        ← API calls
├── server/              ← Backend Node.js
│   ├── config/          ← Database
│   ├── controllers/     ← Logic
│   ├── routes/          ← Endpoints
│   ├── middleware/      ← Auth
│   └── server.js
├── public/              ← Static files
└── *.md                 ← Documentation
```

---

## 🎨 USER INTERFACES

**Consumer:**
- Browse & buy products
- Shopping cart
- Order tracking
- Messages

**Farmer:**
- Add products
- Manage inventory
- View orders
- Update status

**Admin:**
- Analytics dashboard
- User management
- All products/orders
- Transactions

---

## 🔒 SECURITY CHECKLIST

✅ Change JWT_SECRET in production
✅ Use strong MySQL password
✅ Enable HTTPS for production
✅ Never commit .env files
✅ Update demo passwords

---

## 🆘 NEED HELP?

1. Check console for errors
2. Read SETUP_GUIDE.md
3. Review SETUP_CHECKLIST.md
4. Check browser console (F12)
5. Verify MySQL is running

---

## ✅ SYSTEM REQUIREMENTS

- Node.js 14+
- MySQL 5.7+ or 8.0+
- Windows/Mac/Linux
- Modern browser

---

## 📊 PORTS

```
3000  ← React Frontend
5000  ← Express Backend
3306  ← MySQL Database
```

---

## 🎯 TESTING FLOW

1. Register new account
2. Login as consumer
3. Browse products
4. Add to cart
5. Place order
6. Login as farmer
7. View order
8. Update status
9. Login as admin
10. View analytics

---

## 🚀 PRODUCTION READY

Your app includes:
✅ MySQL database (7 tables)
✅ 26 API endpoints
✅ JWT authentication
✅ Role-based access
✅ Transaction safety
✅ Error handling
✅ Security features

---

**⚡ Remember: npm run start:dev to start everything!**

**📖 Full docs in SETUP_GUIDE.md**

**🎉 Happy Coding!**
