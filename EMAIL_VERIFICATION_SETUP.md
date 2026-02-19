# Email Verification & Password Reset Setup Guide

## Overview
Your Finance app now has email verification for sign-ups and password reset functionality. This guide explains how to set it up.

## Features Added

### 1. Email Verification on Sign-Up
- After registration, users receive a verification email
- They must verify their email before logging in
- If they don't verify, they can request a new verification email
- Token expires in 24 hours

### 2. Forgot Password
- Click "Forgot password?" on the login page
- Enter email address and receive a password reset link
- Reset token expires in 1 hour

### 3. Password Reset
- Users click the link and create a new password
- After reset, they can login immediately

---

## Backend Setup

### Email Sending Options

#### Option 1: Gmail (Easiest for Development)
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select `Mail` and `Windows Computer` (or your device)
3. Google will generate a 16-character app password
4. Update `.env`:
```bash
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=paste-16-char-password-here
```

#### Option 2: Other Email Services
Add these to `.env`:
```bash
# For SendGrid
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxx...

# For any SMTP server
EMAIL_SERVICE=custom-smtp
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
```

#### Option 3: Test Mode (No Email Sending)
Leave empty to run in test mode:
```bash
EMAIL_USER=
EMAIL_PASSWORD=
```
In test mode, emails are logged to console but not actually sent.

### Environment Variables
```bash
# Backend .env
FRONTEND_URL=http://localhost:3000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Database Setup
Migrations have been automatically created. Verify tables exist:
```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('email_verification_tokens', 'password_reset_tokens', 'users');

-- Check users table has new columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users';
```

Should include: `email_verified`, `is_active`, `google_id`, etc.

---

## API Endpoints

### Register (New Account)
```
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "message": "User created successfully. Please check email...",
  "user": { "id": 1, "email": "...", "name": "..." }
}
```
User receives verification email with link.

### Verify Email
```
POST /api/auth/verify-email
{
  "token": "verification-token-from-email"
}

Response:
{
  "message": "Email verified successfully...",
  "token": "jwt-token-for-instant-login",
  "user": { ... }
}
```

### Resend Verification Email
```
POST /api/auth/resend-verification-email
{
  "email": "user@example.com"
}

Response:
{
  "message": "Verification email sent successfully"
}
```

### Forgot Password
```
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}

Response:
{
  "message": "If email exists, password reset link has been sent"
}
```
User receives password reset email with link.

### Reset Password
```
POST /api/auth/reset-password
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}

Response:
{
  "message": "Password reset successfully...",
  "user": { ... }
}
```

---

## Frontend Pages/Components

### New Pages Created

1. **`/verify-email?token=xxx`**
   - Auto-verifies email when token is provided
   - Redirects to dashboard on success
   - Shows error if token is invalid/expired

2. **`/reset-password?token=xxx`**
   - Allows user to set new password
   - Redirects to login on success
   - Shows error if token is invalid/expired

### Updated Components

1. **LoginForm**
   - Added "Forgot password?" link
   - Shows forgot password modal
   - Better error messages for unverified accounts

2. **RegisterForm**
   - Shows success message after registration
   - Prompts user to check email
   - Clear verification flow

---

## Testing Checklist

### Sign-Up Test
- [ ] Register new account
- [ ] Get verification email (check backend console if in test mode)
- [ ] Click verification link
- [ ] Should redirect to dashboard logged in
- [ ] Or manually visit `/verify-email?token=...`

### Email Not Verified
- [ ] Try to login without verifying email
- [ ] Should see "Please verify your email" error
- [ ] Click "Forgot password?" to test that flow

### Forgot Password Test
- [ ] Click "Forgot password?" on login
- [ ] Enter email
- [ ] Should see "Check your email"
- [ ] Follow link in console (or email)
- [ ] Should reach `/reset-password?token=...`
- [ ] Enter new password and submit
- [ ] Should redirect to login
- [ ] Login with new password

### Resend Verification
- [ ] Register new account
- [ ] Visit `/` and try login without verifying
- [ ] Error message appears
- [ ] User can request new verification email

---

## Production Deployment

### 1. Set Up Email Service
- Use SendGrid, AWS SES, Gmail App Password, etc.
- Update `.env` with credentials
- Test in staging first

### 2. Update Frontend URL
```bash
# .env
FRONTEND_URL=https://yourdomain.com
```

### 3. Email Templates
Customize email templates in `backend/services/email.service.js`:
- Add company logo
- Update styling
- Add support links
- Add unsubscribe option

### 4. Email Rate Limiting
Consider adding rate limiting for:
- Resend verification email (max 3 per hour)
- Forgot password (max 5 per hour)
- Multiple failed login attempts

---

## Troubleshooting

### Emails Not Sending
1. Check backend `.env` has `EMAIL_USER` and `EMAIL_PASSWORD`
2. Check backend console for error messages
3. If using Gmail, ensure App Password is correct (16 chars)
4. If using Gmail, enable "Less secure apps" if needed
5. Check CORS and firewall aren't blocking SMTP port

### Token Errors
- **"Invalid or expired token"** - Token is invalid or expired
- **"Token has expired"** - Users can request new link
- Tokens expire: Verification (24h), Password Reset (1h)

### Email Not Received
1. Check spam/junk folder
2. Check that EmailService is configured in backend
3. In test mode, check backend console output
4. Test mode logs emails instead of sending

### Google OAuth Still Works?
- Yes! Google OAuth users bypass email verification
- Their `email_verified` is set to `true` automatically
- No verification email sent for OAuth users

---

## Next Steps

### Optional Enhancements
1. Add email verification expiry UI (show timer)
2. Add rate limiting on email sending
3. Add email templates with company branding
4. Add 2FA (two-factor authentication)
5. Add login history/suspicious activity alerts

### Security
- ✅ Tokens are hashed (never stored in plain text)
- ✅ Tokens expire (24h verification, 1h reset)
- ✅ Passwords are bcrypted
- ✅ Don't reveal if email exists (for password reset)
- ✅ Rate limiting recommended for production

---

## Files Modified

### Backend
- `backend/services/email.service.js` - Email sending service
- `backend/routes/auth.js` - New auth endpoints
- `backend/.env` - Email configuration
- `database/migrations/002_*.sql` - Database schema

### Frontend
- `frontend/components/auth/LoginForm.tsx` - Forgot password UI
- `frontend/components/auth/RegisterForm.tsx` - Verification message
- `frontend/app/verify-email/page.tsx` - New verification page
- `frontend/app/reset-password/page.tsx` - New reset page

---

## Support

For issues:
1. Check backend console for error messages
2. Check email service configuration
3. Check database migration completed successfully
4. Verify environment variables are set correctly
5. Check browser console for frontend errors
