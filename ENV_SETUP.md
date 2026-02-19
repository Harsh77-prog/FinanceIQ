# Environment Variables Setup Guide

## Quick Setup

After cloning the project, you only need to update **URLs** in the `.env` files. All other values are pre-configured and work out of the box.

## Files to Update

### 1. Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and update:

```env
# REQUIRED: Your Neon PostgreSQL connection string
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require

# OPTIONAL: Only if your ML service runs on different URL
ML_SERVICE_URL=http://localhost:8000

# OPTIONAL: Only if your frontend runs on different URL
CORS_ORIGIN=http://localhost:3000
```

**How to get Neon connection string:**
1. Go to https://neon.tech
2. Sign up and create a project
3. Click "Connection Details"
4. Copy the connection string
5. Paste it as `DATABASE_URL` value

### 2. Frontend (`frontend/.env.local`)

Copy `frontend/.env.example` to `frontend/.env.local` and update:

```env
# REQUIRED: Your backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# OPTIONAL: Only if your ML service runs on different URL
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

### 3. ML Service (`ml-service/.env`)

Copy `ml-service/.env.example` to `ml-service/.env`:

```env
# OPTIONAL: Only if your backend runs on different URL
BACKEND_API_URL=http://localhost:5000/api
```

**For local development, you can leave this as-is.**

## Default Values (Work Out of the Box)

- **Backend**: Runs on `http://localhost:5000`
- **Frontend**: Runs on `http://localhost:3000`
- **ML Service**: Runs on `http://localhost:8000`

If you're running everything locally with default ports, you only need to update:
1. `DATABASE_URL` in `backend/.env` (your Neon connection string)

## Production Setup

For production, update all URLs:

**Backend `.env`:**
```env
DATABASE_URL=postgresql://prod_user:password@ep-prod-xxx.region.aws.neon.tech/prod_db?sslmode=require
ML_SERVICE_URL=https://ml-service.yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ML_SERVICE_URL=https://ml.yourdomain.com
```

**ML Service `.env`:**
```env
BACKEND_API_URL=https://api.yourdomain.com/api
```

## Summary

✅ **Minimum required**: Update `DATABASE_URL` in `backend/.env`  
✅ **Everything else**: Works with defaults for local development  
✅ **Production**: Update all URLs to your production domains
