# How to Generate JWT_SECRET

## What is JWT_SECRET?

`JWT_SECRET` is **NOT a URL** - it's a secret key used to sign and verify JWT authentication tokens. You need to generate a random, secure string.

## Quick Methods to Generate JWT_SECRET

### Method 1: Using Node.js (Recommended)

Open PowerShell/Terminal and run:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will output a random 64-character hex string like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4
```

Copy this and use it as your `JWT_SECRET`.

### Method 2: Online Generator

1. Go to: https://randomkeygen.com
2. Scroll to "CodeIgniter Encryption Keys"
3. Copy any of the generated keys
4. Use it as your `JWT_SECRET`

### Method 3: Simple Random String

You can use any random string, for example:
```
mySecretKey123!@#FinanceApp2024
```

**Note:** For production, use Method 1 or 2 for better security.

## How to Use

1. Generate your secret key using one of the methods above
2. Open `backend/.env` file
3. Replace `your_super_secret_jwt_key_change_this_in_production` with your generated key:

```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4
```

## JWT_EXPIRES_IN

This is also **NOT a URL**. It's the token expiration time.

- **Format**: `number` + `unit`
- **Units**: `s` (seconds), `m` (minutes), `h` (hours), `d` (days)
- **Default**: `7d` (7 days)

**Examples:**
- `1h` = 1 hour
- `7d` = 7 days (default - no change needed)
- `30d` = 30 days
- `1y` = 1 year

For local development, you can leave it as `7d` - no changes needed.

## Summary

✅ **JWT_SECRET**: Generate a random string (use Method 1 or 2)  
✅ **JWT_EXPIRES_IN**: Leave as `7d` (no changes needed for local dev)

**These are NOT URLs - they're configuration values!**
