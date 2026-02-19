# 🚀 How to Run the Project

Follow these steps in order:

## Prerequisites Check

First, make sure you have:
- ✅ Node.js installed (`node --version` should show 18+)
- ✅ Python installed (`python --version` should show 3.9+)
- ✅ Neon PostgreSQL account (recommended) OR Local PostgreSQL installed

## Step-by-Step Instructions

### 1️⃣ Set Up Database (One-time setup)

#### Option A: Neon PostgreSQL (Recommended)

1. **Create Neon account:**
   - Go to https://neon.tech
   - Sign up and create a project

2. **Get connection string:**
   - In Neon dashboard → Connection Details
   - Copy the connection string

3. **Run schema:**
   - **Easiest:** Use Neon SQL Editor
     - Open SQL Editor in Neon dashboard
     - Copy contents of `database\schema.sql`
     - Paste and execute
   
   - **Or use psql:**
     ```powershell
     psql "your_neon_connection_string" -f database\schema.sql
     ```

#### Option B: Local PostgreSQL

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database (inside psql prompt)
CREATE DATABASE finance_db;
\q

# Run schema
psql -U postgres -d finance_db -f database\schema.sql
```

**Note:** If you get a password prompt, enter your PostgreSQL password.

### 2️⃣ Install Dependencies

Open PowerShell in the project root (`c:\Users\harsh\Documents\finance`) and run:

```powershell
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install Python dependencies
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 3️⃣ Configure Environment Variables

**Backend:**
```powershell
cd backend
copy .env.example .env
```

Edit `backend\.env` file:

**For Neon PostgreSQL:**
- `DATABASE_URL` = your Neon connection string (from Neon dashboard)
- `JWT_SECRET` = any random string (e.g., `mySecretKey123!`)

**For Local PostgreSQL:**
- `DB_HOST` = localhost
- `DB_PORT` = 5432
- `DB_NAME` = finance_db
- `DB_USER` = postgres
- `DB_PASSWORD` = your PostgreSQL password
- `JWT_SECRET` = any random string (e.g., `mySecretKey123!`)

**ML Service:**
```powershell
cd ml-service
copy .env.example .env
```
(Default values should work)

**Frontend:**
```powershell
cd frontend
copy .env.example .env.local
```
(Default values should work)

### 4️⃣ Start All Services

You need **3 separate PowerShell windows**:

#### Window 1 - Backend:
```powershell
cd c:\Users\harsh\Documents\finance\backend
npm run dev
```
Wait for: `🚀 Backend server running on port 5000`

#### Window 2 - ML Service:
```powershell
cd c:\Users\harsh\Documents\finance\ml-service
venv\Scripts\activate
python app.py
```
Wait for: `Application startup complete` and `Uvicorn running on http://0.0.0.0:8000`

#### Window 3 - Frontend:
```powershell
cd c:\Users\harsh\Documents\finance\frontend
npm run dev
```
Wait for: `Ready on http://localhost:3000`

### 5️⃣ Open the Application

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the landing page
4. Click "Sign Up" tab
5. Create an account (any email/password)
6. You'll be redirected to the dashboard!

## ✅ Success Indicators

- ✅ Backend: Shows "Backend server running on port 5000"
- ✅ ML Service: Shows "Uvicorn running on http://0.0.0.0:8000"
- ✅ Frontend: Shows "Ready on http://localhost:3000"
- ✅ Browser: Landing page loads without errors

## 🐛 Common Issues & Fixes

### "psql: command not found"
- PostgreSQL is not in PATH or not installed
- Solution: Add PostgreSQL bin folder to PATH or use full path

### "Database connection error"
- **For Neon:** Verify `DATABASE_URL` in `backend\.env` is correct
- **For Local:** Check PostgreSQL is running: `Get-Service postgresql*`
- Verify credentials in `backend\.env` match your database

### "Port 5000/8000/3000 already in use"
- Another application is using the port
- Solution: Stop that application or change ports in `.env` files

### "Module not found" errors
- Dependencies not installed
- Solution: Run `npm install` or `pip install -r requirements.txt` again

### "Cannot find module" in Python
- Virtual environment not activated
- Solution: Make sure you see `(venv)` in your PowerShell prompt

## 📝 Quick Commands Reference

```powershell
# Check if services are running
netstat -ano | findstr "3000 5000 8000"

# Stop a service
# Press Ctrl+C in the terminal running that service

# Restart a service
# Stop it (Ctrl+C), then run the start command again
```

## Need More Help?

See [SETUP.md](./SETUP.md) for detailed troubleshooting.
