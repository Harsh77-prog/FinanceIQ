# 🚀 Neon PostgreSQL Setup Guide

This guide will help you set up Neon PostgreSQL for the Finance Intelligence System.

## What is Neon?

Neon is a serverless PostgreSQL database that:
- ✅ No local installation needed
- ✅ Free tier available
- ✅ Auto-scaling
- ✅ Built-in backups
- ✅ Easy to use

## Step 1: Create Neon Account

1. Go to **https://neon.tech**
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

## Step 2: Create a Project

1. After logging in, click **"Create Project"**
2. Choose a project name (e.g., "finance-intelligence")
3. Select a region (choose closest to you)
4. Select PostgreSQL version (14+ recommended)
5. Click **"Create Project"**

## Step 3: Get Connection String

1. In your project dashboard, click **"Connection Details"**
2. You'll see a connection string like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **Copy this connection string** (you'll need it in Step 5)

## Step 4: Run Database Schema

You have two options:

### Option A: Using Neon SQL Editor (Easiest)

1. In Neon dashboard, click **"SQL Editor"**
2. Click **"New Query"**
3. Open `database/schema.sql` file from this project
4. Copy all the SQL code
5. Paste into Neon SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`
7. You should see "Success" message

### Option B: Using psql Command Line

```powershell
# Replace with your actual connection string
psql "postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require" -f database\schema.sql
```

## Step 5: Configure Backend

1. Go to `backend` folder
2. Copy `.env.example` to `.env`:
   ```powershell
   cd backend
   copy .env.example .env
   ```

3. Open `backend\.env` file and add your Neon connection string:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=your_random_secret_key_here
   ```

4. Save the file

## Step 6: Verify Connection

1. Start your backend:
   ```powershell
   cd backend
   npm run dev
   ```

2. If you see `🚀 Backend server running on port 5000` without errors, you're connected!

## Troubleshooting

### Connection String Issues
- Make sure you copied the **entire** connection string
- Check that `?sslmode=require` is included
- Verify username and password are correct

### Schema Not Running
- Make sure you're running the schema in the correct database
- Check for SQL syntax errors in Neon SQL Editor
- Verify all tables were created: Use `\dt` command in SQL Editor

### Connection Timeout
- Check your internet connection
- Verify Neon project is active (not paused)
- Try regenerating connection string in Neon dashboard

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use different databases** for development and production
3. **Rotate passwords** regularly
4. **Use connection pooling** (already configured in the code)

## Need Help?

- Neon Documentation: https://neon.tech/docs
- Neon Discord: https://discord.gg/neondatabase
- Check [SETUP.md](./SETUP.md) for general setup help

## Example Connection String Format

```
postgresql://[username]:[password]@[hostname]/[database]?sslmode=require
```

Example:
```
postgresql://myuser:mypassword123@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```
