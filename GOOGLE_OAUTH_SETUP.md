# Google OAuth Setup Guide

## ✅ Step 1: Create Google OAuth Credentials

### 1a. Go to Google Cloud Console
- Visit: https://console.cloud.google.com
- Click "Select a Project" → "New Project"
- Project name: `Finance App`
- Click "Create"

### 1b. Enable Google Sign-In API
1. Go to "APIs & Services" → "Library"
2. Search for: "Google+ API"
3. Click "Enable"
4. Go back to "APIs & Services" → "Credentials"

### 1c. Create OAuth 2.0 Credentials
1. Click "+ Create Credentials" → "OAuth Client ID"
2. If prompted, configure OAuth consent screen first:
   - **User Type**: External
   - **App name**: Finance Manager
   - **User support email**: your-email@gmail.com
   - **Authorized domains**: localhost (for development)
   - Add scopes: `email`, `profile`, `openid`
3. Back to "Create OAuth Client ID" → **Application Type**: Web application
4. Name: `Finance App Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3000/
   https://yourdomain.com (production)
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/
   http://localhost:3000/auth
   http://localhost:3000/dashboard
   https://yourdomain.com (production)
   ```
7. Click "Create"
8. Copy **Client ID** (you'll need it)

---

## ✅ Step 2: Setup Environment Variables

### 2a. Create `.env.local` (Frontend)
In the `frontend/` directory, create or update `.env.local`:

```bash
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

**How to find `GOOGLE_CLIENT_ID`:**
- Go back to Google Cloud Console
- APIs & Services → Credentials
- Find your OAuth 2.0 Client ID
- Copy the "Client ID" value

### 2b. Create/Update `.env` (Backend)
In the `backend/` directory, create or update `.env`:

```bash
# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/finance
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth (Backend)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE

# ML Service
ML_SERVICE_URL=http://localhost:8000
```

### 2c. Create/Update `.env` (ML Service)
In the `ml-service/` directory:

```bash
# Flask/ML Service
PORT=8000
HOST=0.0.0.0
MODEL_PATH=./models
PYTHONUNBUFFERED=1
```

---

## ✅ Step 3: Database Schema Update

Add these fields to the `users` table if they don't exist:

```sql
-- Run these commands in your PostgreSQL database

ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
```

Or run the migration by connecting to PostgreSQL:

```bash
psql -U postgres -d finance -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);"
psql -U postgres -d finance -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;"
psql -U postgres -d finance -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50);"
```

---

## ✅ Step 4: Install Required Packages

### Backend
```bash
cd backend
npm install axios
```

### Frontend
No additional packages needed - Google Sign-In uses their SDK.

### ML Service
```bash
cd ml-service
pip install -r requirements.txt  # Already includes necessary packages
```

---

## ✅ Step 5: Update package.json (if needed)

### Backend - Ensure axios is listed
```json
{
  "dependencies": {
    "express": "^4.x.x",
    "jsonwebtoken": "^9.x.x",
    "bcryptjs": "^2.x.x",
    "axios": "^1.x.x",
    "express-validator": "^7.x.x",
    "dotenv": "^16.x.x",
    ...
  }
}
```

---

## ✅ Step 6: Test Google OAuth

### 1. Start all services
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: ML Service
cd ml-service
python app.py
```

### 2. Test Login
1. Open http://localhost:3000
2. Go to login page
3. You should see:
   - Google Sign-In button at the top
   - Standard email/password form below
4. Click "Sign in with Google"
5. Choose your Google account
6. Should redirect to dashboard

### 3. Test User Creation
- First-time Google sign-in should create user automatically
- Subsequent sign-ins should recognize the user

---

## 🔒 Security Notes

### Development vs Production

**Development (.env):**
- `JWT_SECRET`: Can be simple like `dev-secret-key`
- `GOOGLE_CLIENT_ID`: Use your test OAuth credentials

**Production (.env.production):**
```bash
# NEVER commit these to git!
JWT_SECRET=use-a-very-long-random-string-minimum-32-characters
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-secret
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://prod-user:prod-password@prod-host:5432/finance_prod
```

### Best Practices

1. ✅ Never commit `.env` files to git
2. ✅ Add `.env` to `.gitignore`:
   ```
   .env
   .env.local
   .env.production
   .env.*.local
   ```
3. ✅ Use strong JWT_SECRET in production (random 32+ characters)
4. ✅ Rotate `GOOGLE_CLIENT_SECRET` regularly
5. ✅ Use HTTPS in production
6. ✅ Set secure CORS origins

---

## 🐛 Troubleshooting

### "Google Sign-In button not showing"
**Problem:** Client ID not set
**Solution:**
1. Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `frontend/.env.local`
2. Make sure it's prefixed with `NEXT_PUBLIC_`
3. Restart frontend: `npm run dev`

### "Invalid Google token"
**Problem:** Token verification failed
**Solution:**
1. Check internet connection (needs to reach Google servers)
2. Verify `GOOGLE_CLIENT_ID` is correct
3. Check authorized origins in Google Cloud Console

### "User not created after Google sign-in"
**Problem:** Database schema missing new fields
**Solution:**
```bash
psql -U postgres -d finance -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);"
```

### "CORS error with Google"
**Problem:** Origin not authorized
**Solution:**
1. Go to Google Cloud Console
2. Edit OAuth consent screen → Authorized domains
3. Add your domain (e.g., localhost, yourdomain.com)

### "Token expired errors"
**Problem:** JWT expired
**Solution:**
- Frontend automatically clears localStorage
- User needs to log in again
- Check `JWT_EXPIRES_IN` setting (default 7 days)

---

## 🎯 Environment Variables Checklist

```
Backend (.env):
  ✅ PORT=5000
  ✅ NODE_ENV=development
  ✅ DATABASE_URL=postgresql://...
  ✅ JWT_SECRET=your-secret
  ✅ JWT_EXPIRES_IN=7d
  ✅ GOOGLE_CLIENT_ID=123...
  ✅ GOOGLE_CLIENT_SECRET=abc...
  ✅ CORS_ORIGIN=http://localhost:3000
  ✅ ML_SERVICE_URL=http://localhost:8000

Frontend (.env.local):
  ✅ NEXT_PUBLIC_GOOGLE_CLIENT_ID=123...

ML Service (.env):
  ✅ PORT=8000
  ✅ MODEL_PATH=./models
```

---

## 📱 Authentication Flow

```
User clicks "Sign in with Google"
         ↓
Google Sign-In popup appears
         ↓
User selects Google account
         ↓
Frontend receives idToken
         ↓
Frontend sends: POST /api/auth/google { idToken }
         ↓
Backend verifies idToken with Google
         ↓
Backend checks if user exists
         ├─ YES: Returns existing user
         └─ NO: Creates new user
         ↓
Backend generates JWT token
         ↓
Frontend stores token in localStorage
         ↓
Frontend redirects to /dashboard
         ↓
All API calls use JWT token in header
```

---

## ✨ Next Steps

1. ✅ Complete steps 1-6 above
2. ✅ Test login with Google
3. ✅ Test login with email/password
4. ✅ Verify user appears in database
5. ✅ Check portfolio and features work

Your app now has professional Google OAuth authentication! 🎉

