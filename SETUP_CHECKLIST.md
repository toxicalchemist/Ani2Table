# Ani2Table Setup Checklist

Use this checklist to ensure you've completed all setup steps correctly.

## ☑️ Prerequisites

- [ ] Node.js installed (v14 or higher)
  - Check: `node --version`
- [ ] npm installed
  - Check: `npm --version`
- [ ] MySQL Server installed (v5.7 or higher)
  - Check: `mysql --version`
- [ ] MySQL service is running

## ☑️ Installation Steps

- [ ] Cloned the repository
- [ ] Installed frontend dependencies
  - Run: `npm install`
- [ ] Installed backend dependencies
  - Run: `npm run server:install`
  - Or: `cd server && npm install`

## ☑️ Database Setup

- [ ] MySQL is running on port 3306 (or your configured port)
- [ ] Created database and tables
  - Option 1: `mysql -u root -p < server/config/database.sql`
  - Option 2: Execute `server/config/database.sql` in MySQL Workbench
- [ ] Verified database `ani2table` exists
  - Check: `SHOW DATABASES;` in MySQL
- [ ] Verified all tables exist
  - Check: `USE ani2table; SHOW TABLES;`

## ☑️ Configuration

### Backend Configuration (server/.env)
- [ ] Created `server/.env` file (copy from `server/.env.example`)
- [ ] Set `DB_HOST` (usually `localhost`)
- [ ] Set `DB_USER` (usually `root`)
- [ ] Set `DB_PASSWORD` (your MySQL password)
- [ ] Set `DB_NAME` (should be `ani2table`)
- [ ] Set `DB_PORT` (usually `3306`)
- [ ] Set `JWT_SECRET` (change from default)
- [ ] Set `PORT` (5000 or different if port conflict)

### Frontend Configuration (root/.env)
- [ ] Created `.env` file in root folder
- [ ] Set `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] If backend port changed, update URL accordingly

## ☑️ Demo Accounts Setup

- [ ] Generated hashed passwords
  - Run: `cd server && node scripts/hashPassword.js`
- [ ] Copied SQL UPDATE statements
- [ ] Executed SQL statements in MySQL to update user passwords
- [ ] Alternatively, created new accounts via signup

## ☑️ Testing Connection

- [ ] Started backend server
  - Run: `cd server && npm start`
  - Should see: "✓ MySQL Database connected successfully"
  - Should see: "🚀 Ani2Table Server is running"
- [ ] Tested health endpoint
  - Visit: http://localhost:5000/health
  - Should return: `{"status":"OK","message":"Ani2Table API is running"}`
- [ ] Stopped backend server (Ctrl+C)

## ☑️ Running the Application

- [ ] Started both frontend and backend
  - Run: `npm run start:dev`
- [ ] Frontend opened automatically at http://localhost:3000
- [ ] Backend running at http://localhost:5000
- [ ] No errors in terminal

## ☑️ Login Test

- [ ] Navigated to http://localhost:3000
- [ ] Clicked "Login" or "Sign Up"
- [ ] Successfully logged in with demo account or new account
  - Consumer: `consumer` / `password`
  - Farmer: `farmer` / `password`
  - Admin: `admin` / `password`
- [ ] Redirected to appropriate dashboard
- [ ] Dashboard loads without errors

## ☑️ Functionality Tests

### Consumer Tests
- [ ] Can view products page
- [ ] Can add product to cart
- [ ] Can view cart
- [ ] Can update cart quantity
- [ ] Can place order
- [ ] Can view orders
- [ ] Can send message

### Farmer Tests
- [ ] Can create new product
- [ ] Can view own products
- [ ] Can edit product
- [ ] Can delete product
- [ ] Can view orders
- [ ] Can update order status

### Admin Tests
- [ ] Can view analytics dashboard
- [ ] Can see all products
- [ ] Can see all orders
- [ ] Can view transactions
- [ ] Can see all users

## ☑️ Troubleshooting Checks

If something doesn't work, verify:

### Database Issues
- [ ] MySQL service is running
- [ ] Database credentials are correct in `server/.env`
- [ ] Database `ani2table` exists
- [ ] All tables are created
- [ ] Demo user passwords are hashed (not plain text)

### Connection Issues
- [ ] Backend server is running
- [ ] No port conflicts (5000, 3000)
- [ ] CORS is enabled in backend
- [ ] Frontend .env has correct API URL
- [ ] Firewall not blocking connections

### Authentication Issues
- [ ] JWT_SECRET is set in `server/.env`
- [ ] Passwords are properly hashed
- [ ] Token is being sent with requests
- [ ] Token hasn't expired

### Network Errors
- [ ] Backend is accessible at http://localhost:5000/health
- [ ] Frontend can reach backend (check browser console)
- [ ] No CORS errors in browser console

## 📝 Notes

- Default frontend port: 3000
- Default backend port: 5000
- Database port: 3306
- JWT tokens expire in 7 days by default

## 🆘 Getting Help

If you encounter issues:

1. Check the console/terminal for error messages
2. Review `DATABASE_README.md` for detailed documentation
3. Check `SETUP_GUIDE.md` for setup instructions
4. Verify all checklist items are completed
5. Check browser console for frontend errors
6. Check terminal for backend errors

## ✅ Setup Complete!

Once all items are checked:
- [ ] Application is fully functional
- [ ] Can log in as different user types
- [ ] All features work as expected
- [ ] Ready for development or demonstration

🎉 Congratulations! Your Ani2Table application is set up and running!

---

**Next Steps:**
- Explore the application features
- Review the code structure
- Check API documentation in `API_REFERENCE.md`
- Start developing new features or customizations
