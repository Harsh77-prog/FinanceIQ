# Fix Database Connection Error

## Problem
Backend is trying to connect to `localhost:5432` instead of Neon PostgreSQL.

Error: `ECONNREFUSED ::1:5432` or `ECONNREFUSED 127.0.0.1:5432`

## Solution

### Step 1: Create .env File

Make sure you have a `.env` file in the `backend` directory:

```powershell
cd c:\Users\harsh\Documents\finance\backend
copy .env.example .env
```

### Step 2: Get Your Neon Connection String

1. Go to https://console.neon.tech
2. Sign in to your account
3. Select your project
4. Click **"Connection Details"**
5. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Update .env File

Open `backend\.env` file and replace the `DATABASE_URL` line with your actual Neon connection string:

```env
DATABASE_URL=postgresql://your_username:your_password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**Important:** Replace the entire connection string with your actual one from Neon.

### Step 4: Verify .env File

Make sure your `backend\.env` file looks like this:

```env
PORT=5000
NODE_ENV=development

# Your actual Neon connection string (REQUIRED)
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require

JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d

ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
```

### Step 5: Restart Backend

After updating `.env`, restart your backend:

1. Stop the backend (Ctrl+C in the terminal)
2. Start it again:
   ```powershell
   cd c:\Users\harsh\Documents\finance\backend
   npm run dev
   ```

### Step 6: Verify Connection

You should see:
```
🚀 Backend server running on port 5000
📊 Environment: development
```

**No database connection errors!**

## Common Issues

### Issue 1: .env file doesn't exist
**Solution:** Create it by copying `.env.example`:
```powershell
copy .env.example .env
```

### Issue 2: DATABASE_URL is commented out
**Solution:** Make sure `DATABASE_URL` line is NOT commented (no `#` at the start)

### Issue 3: Wrong connection string format
**Solution:** Make sure it starts with `postgresql://` and ends with `?sslmode=require`

### Issue 4: Backend not reading .env
**Solution:** 
- Make sure `.env` file is in `backend` directory (same folder as `server.js`)
- Restart the backend server
- Check that `dotenv` package is installed: `npm list dotenv`

## Quick Check Command

To verify your .env file exists and has DATABASE_URL:

```powershell
cd c:\Users\harsh\Documents\finance\backend
Get-Content .env | Select-String "DATABASE_URL"
```

You should see your Neon connection string.

## Still Having Issues?

1. **Check if .env file exists:**
   ```powershell
   Test-Path backend\.env
   ```
   Should return `True`

2. **Check DATABASE_URL value:**
   ```powershell
   Get-Content backend\.env | Select-String "DATABASE_URL"
   ```
   Should show your Neon connection string

3. **Make sure backend is reading .env:**
   - Check that `require('dotenv').config()` is at the top of `server.js`
   - Restart backend after changing .env
