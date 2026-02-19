# 🔧 Quick Fix: Database Connection Error

## Problem Found
The `.env` file doesn't exist in the `backend` directory, so the backend is trying to connect to localhost PostgreSQL instead of Neon.

## ✅ Solution (2 Steps)

### Step 1: Create .env File

I've created the `.env` file for you. Now you need to:

### Step 2: Add Your Neon Connection String

1. **Get your Neon connection string:**
   - Go to https://console.neon.tech
   - Open your project
   - Click "Connection Details"
   - Copy the connection string

2. **Update `backend\.env` file:**
   - Open `backend\.env` in your editor
   - Find this line:
     ```env
     DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
     ```
   - Replace it with your actual Neon connection string

3. **Restart your backend:**
   - Stop the backend (Ctrl+C)
   - Start it again:
     ```powershell
     cd backend
     npm run dev
     ```

## Example

Your `backend\.env` should look like:

```env
DATABASE_URL=postgresql://myuser:mypassword123@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Important:** Replace with YOUR actual connection string from Neon!

## Verify It Works

After restarting, you should see:
```
🚀 Backend server running on port 5000
📊 Environment: development
```

**No more connection errors!**

## Still Getting Errors?

1. Make sure `.env` file exists: `backend\.env`
2. Make sure `DATABASE_URL` line is NOT commented (no `#` at start)
3. Make sure connection string starts with `postgresql://`
4. Restart backend after changing `.env`
