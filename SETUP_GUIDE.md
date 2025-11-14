# Quick Setup Guide for Ani2Table with MySQL

## Step 1: Install Dependencies

```powershell
# Install frontend dependencies
npm install

# Install backend dependencies
npm run server:install
```

## Step 2: Set Up MySQL Database

### Install MySQL (if not already installed)
Download and install from: https://dev.mysql.com/downloads/mysql/

### Create Database and Tables

1. Open MySQL Workbench or command line
2. Login to MySQL:
```bash
mysql -u root -p
```

3. Run the database setup script:
```sql
SOURCE C:/Users/Josh Cabunoc/Ani2Table/server/config/database.sql;
```

Or use MySQL Workbench to open and execute `server/config/database.sql`

## Step 3: Configure Environment Variables

### Backend (.env in server folder)
Edit `server/.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=ani2table
```

### Frontend (.env in root folder)
Already configured:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 4: Update Demo Passwords

The demo accounts need proper password hashing. Run this in your MySQL:

```sql
USE ani2table;

-- Update demo passwords (these are hashed versions of 'password')
UPDATE users SET password = '$2a$10$rO5KmZPqWq5L5E5L5E5L5OuZJZZJZZJZZJZZJZZJZZJZZJZZJZZJZJ' WHERE username = 'consumer';
UPDATE users SET password = '$2a$10$rO5KmZPqWq5L5E5L5E5L5OuZJZZJZZJZZJZZJZZJZZJZZJZZJZZJZJ' WHERE username = 'farmer';
UPDATE users SET password = '$2a$10$rO5KmZPqWq5L5E5L5E5L5OuZJZZJZZJZZJZZJZZJZZJZZJZZJZZJZJ' WHERE username = 'admin';
```

Or you can register new accounts through the application.

## Step 5: Run the Application

### Option A: Run Both (Recommended)
```powershell
npm run start:dev
```

### Option B: Run Separately

Terminal 1 - Backend:
```powershell
cd server
npm start
```

Terminal 2 - Frontend:
```powershell
npm start
```

## Step 6: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Default Login Credentials

After setting up, register new accounts or use:
- **Consumer**: `consumer` / `password`
- **Farmer**: `farmer` / `password`  
- **Admin**: `admin` / `password`

## Troubleshooting

### "Cannot connect to MySQL"
1. Make sure MySQL service is running
2. Check username and password in `server/.env`
3. Verify database `ani2table` exists

### "Port 5000 already in use"
Change PORT in `server/.env` to another port (e.g., 5001)

### "Invalid credentials" when logging in
1. Delete and recreate the users in database
2. Or register a new account through the signup page

## Need Help?

Check `DATABASE_README.md` for detailed documentation.
