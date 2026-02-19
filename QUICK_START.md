# 🚀 Quick Start Guide

Follow these steps to run the Finance Intelligence System.

## Step 1: Install Prerequisites

Make sure you have installed:
- ✅ **Node.js** 18+ (Download: https://nodejs.org/)
- ✅ **Python** 3.9+ (Download: https://www.python.org/downloads/)
- ✅ **PostgreSQL** 14+ (Download: https://www.postgresql.org/download/)

Verify installations:
```powershell
node --version
python --version
psql --version
```

## Step 2: Set Up Database

1. **Start PostgreSQL service** (if not running)

2. **Open PowerShell/Terminal** and run:
```powershell
psql -U postgres
```

3. **Create database:**
```sql
CREATE DATABASE finance_db;
\q
```

4. **Run schema:**
```powershell
psql -U postgres -d finance_db -f database\schema.sql
```

## Step 3: Install Dependencies

### Install Node.js dependencies:
```powershell
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### Install Python dependencies:
```powershell
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt

cd ..
```

## Step 4: Configure Environment Variables

### Backend Configuration:
```powershell
cd backend
copy .env.example .env
```

Edit `backend\.env` and update:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
JWT_SECRET=your_random_secret_key_here
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
```

### ML Service Configuration:
```powershell
cd ml-service
copy .env.example .env
```

The default `.env` should work, but you can edit if needed.

### Frontend Configuration:
```powershell
cd frontend
copy .env.example .env.local
```

The default `.env.local` should work for local development.

## Step 5: Start All Services

You need **3 separate terminal windows**:

### Terminal 1 - Backend:
```powershell
cd backend
npm run dev
```
✅ Backend should start on http://localhost:5000

### Terminal 2 - ML Service:
```powershell
cd ml-service
venv\Scripts\activate
python app.py
```
✅ ML Service should start on http://localhost:8000

### Terminal 3 - Frontend:
```powershell
cd frontend
npm run dev
```
✅ Frontend should start on http://localhost:3000

## Step 6: Access the Application

1. Open your browser and go to: **http://localhost:3000**
2. You should see the landing page
3. Click "Sign Up" to create an account
4. After registration, you'll be redirected to the dashboard

## ✅ Verification Checklist

- [ ] PostgreSQL is running
- [ ] Database `finance_db` is created
- [ ] Schema is loaded (tables exist)
- [ ] Backend is running on port 5000
- [ ] ML Service is running on port 8000
- [ ] Frontend is running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can register a new account
- [ ] Can login and see dashboard

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `Get-Service postgresql*`
- Verify credentials in `backend\.env`
- Test connection: `psql -U postgres -d finance_db`

### Port Already in Use
- Change ports in `.env` files
- Or stop the service using the port

### Python Module Not Found
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt` again

### Frontend Build Errors
- Delete `node_modules` and `.next` folder
- Run `npm install` again

### ML Service Not Starting
- Check Python version: `python --version` (should be 3.9+)
- Verify virtual environment is activated
- Check all packages installed: `pip list`

## 📞 Need Help?

Check the detailed [SETUP.md](./SETUP.md) file for more information.
