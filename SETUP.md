# Setup Guide

Complete setup instructions for the Finance Intelligence System.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/downloads/))
- **PostgreSQL** (Optional - Use Neon PostgreSQL cloud database instead)
- **Git** (optional)

## Step 1: Clone/Download Project

If using Git:
```bash
git clone <repository-url>
cd finance
```

## Step 2: Database Setup

### Option A: Neon PostgreSQL (Recommended - No Local Installation)

1. **Create Neon account:**
   - Go to https://neon.tech and sign up
   - Create a new project

2. **Get connection string:**
   - In Neon dashboard → Connection Details
   - Copy the connection string

3. **Run schema:**
   - Option 1: Use Neon SQL Editor (easiest)
     - Open SQL Editor in Neon dashboard
     - Copy contents of `database/schema.sql`
     - Paste and run
   
   - Option 2: Use psql command line
     ```bash
     psql "your_neon_connection_string" -f database/schema.sql
     ```

4. **Add to backend/.env:**
   ```env
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Option B: Local PostgreSQL

1. **Start PostgreSQL service**

2. **Create database:**
   ```bash
   psql -U postgres
   CREATE DATABASE finance_db;
   \q
   ```

3. **Run schema:**
   ```bash
   cd database
   psql -U postgres -d finance_db -f schema.sql
   cd ..
   ```

4. **Configure backend/.env with individual parameters** (see Step 3)

## Step 3: Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - **For Neon PostgreSQL:** Add `DATABASE_URL` with your Neon connection string
   - **For Local PostgreSQL:** Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - `JWT_SECRET` (use a strong random string)
   - `ML_SERVICE_URL` (default: http://localhost:8000)

4. **Start backend:**
   ```bash
   npm run dev
   ```
   
   Backend runs on http://localhost:5000

## Step 4: ML Service Setup

1. **Navigate to ML service:**
   ```bash
   cd ml-service
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```
   
   **Windows:**
   ```bash
   venv\Scripts\activate
   ```
   
   **Mac/Linux:**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed (defaults are usually fine)

5. **Start ML service:**
   ```bash
   python app.py
   ```
   
   ML service runs on http://localhost:8000

## Step 5: Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` if your backend/ML service URLs differ from defaults

4. **Start frontend:**
   ```bash
   npm run dev
   ```
   
   Frontend runs on http://localhost:3000

## Step 6: Verify Installation

1. Open http://localhost:3000 in your browser
2. Create an account
3. You should see the dashboard

## Troubleshooting

### Database Connection Issues
- **For Neon:** Verify connection string is correct in `backend/.env`
- **For Local:** Verify PostgreSQL is running: `Get-Service postgresql*`
- Check database credentials in `backend/.env`
- Test connection: `psql "your_connection_string"` (Neon) or `psql -U postgres -l` (Local)

### ML Service Not Starting
- Verify Python version: `python --version` (should be 3.9+)
- Check virtual environment is activated
- Install dependencies: `pip install -r requirements.txt`

### Frontend Build Errors
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check Node.js version: `node --version` (should be 18+)

### Port Already in Use
- Change ports in respective `.env` files
- Or stop the service using the port

## Production Deployment

For production:
1. Set `NODE_ENV=production` in backend `.env`
2. Use strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use HTTPS
5. Set up proper database backups
6. Use environment-specific database credentials
