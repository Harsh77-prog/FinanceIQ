const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const crypto = require('crypto')
const { body, validationResult } = require('express-validator')
const pool = require('../config/database')
const { authenticateToken } = require('../middleware/auth')
const emailService = require('../services/email.service')

const router = express.Router()

// Helper function to generate tokens
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { email, password, name } = req.body

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (not verified yet)
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, email_verified, is_active) VALUES ($1, $2, $3, false, false) RETURNING id, email, name',
      [email, hashedPassword, name]
    )

    const user = result.rows[0]

    // Generate verification token
    const verificationToken = generateToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await pool.query(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, verificationToken, expiresAt]
    )

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, verificationToken, name)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email fails, but log it
    }

    res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
})

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { email, password } = req.body

    // Find user
    const result = await pool.query('SELECT id, email, password_hash, name, email_verified FROM users WHERE email = $1', [email])
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
})

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, email_verified FROM users WHERE id = $1',
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const user = result.rows[0]

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.email_verified,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Failed to fetch user' })
  }
})

// Google OAuth verify token
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' })
    }

    // Verify Google token
    const googleTokenUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token='
    let googleUser

    try {
      const response = await axios.get(`${googleTokenUrl}${idToken}`)
      googleUser = response.data
    } catch (error) {
      console.error('Google token verification failed:', error.message)
      return res.status(401).json({ message: 'Invalid Google token' })
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT id, email, name FROM users WHERE email = $1', [googleUser.email])

    let user
    if (existingUser.rows.length > 0) {
      // User exists, get their data
      user = existingUser.rows[0]
      // Update last login
      await pool.query('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id])
    } else {
      // Create new user
      const result = await pool.query(
        `INSERT INTO users (email, name, password_hash, google_id, email_verified) 
         VALUES ($1, $2, $3, $4, true) 
         RETURNING id, email, name`,
        [googleUser.email, googleUser.name || googleUser.email.split('@')[0], 'oauth-google', googleUser.sub]
      )
      user = result.rows[0]
    }

        res.json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            email_verified: user.email_verified,
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Google authentication error:', error)
    res.status(500).json({ message: 'Google authentication failed' })
  }
})

// Logout endpoint (optional - for frontend reference)
router.post('/logout', authenticateToken, (req, res) => {
  // Token is invalidated on frontend by removing it from storage
  res.json({ message: 'Logged out successfully' })
})

// Verify email token
router.post('/verify-email', [
  body('token').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { token } = req.body

    // Find token in database
    const tokenResult = await pool.query(
      'SELECT user_id, expires_at FROM email_verification_tokens WHERE token = $1',
      [token]
    )

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token' })
    }

    const { user_id, expires_at } = tokenResult.rows[0]

    // Check if token is expired
    if (new Date() > new Date(expires_at)) {
      await pool.query('DELETE FROM email_verification_tokens WHERE token = $1', [token])
      return res.status(400).json({ message: 'Verification token has expired' })
    }

    // Update user as verified
    const userResult = await pool.query(
      'UPDATE users SET email_verified = true, is_active = true WHERE id = $1 RETURNING id, email, name',
      [user_id]
    )

    const user = userResult.rows[0]

    // Delete the verification token
    await pool.query('DELETE FROM email_verification_tokens WHERE token = $1', [token])

    // Generate JWT token so user can login immediately
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: 'Email verified successfully. You can now log in.',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({ message: 'Email verification failed' })
  }
})

// Resend verification email
router.post('/resend-verification-email', [
  body('email').isEmail().normalizeEmail(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { email } = req.body

    // Find user
    const userResult = await pool.query(
      'SELECT id, name, email_verified FROM users WHERE email = $1',
      [email]
    )

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' })
    }

    const user = userResult.rows[0]

    if (user.email_verified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    // Delete old tokens
    await pool.query('DELETE FROM email_verification_tokens WHERE user_id = $1', [user.id])

    // Generate new verification token
    const verificationToken = generateToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await pool.query(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, verificationToken, expiresAt]
    )

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, verificationToken, user.name)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
    }

    res.json({ message: 'Verification email sent successfully' })
  } catch (error) {
    console.error('Resend verification email error:', error)
    res.status(500).json({ message: 'Failed to resend verification email' })
  }
})

// Forgot password - send reset email
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { email } = req.body

    // Find user
    const userResult = await pool.query(
      'SELECT id, name FROM users WHERE email = $1',
      [email]
    )

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists for security
      return res.json({ message: 'If email exists, password reset link has been sent' })
    }

    const user = userResult.rows[0]

    // Delete old reset tokens
    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [user.id])

    // Generate password reset token
    const resetToken = generateToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, resetToken, expiresAt]
    )

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken, user.name)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
    }

    res.json({ message: 'If email exists, password reset link has been sent' })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Failed to process forgot password request' })
  }
})

// Reset password with token
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { token, password } = req.body

    // Find token in database
    const tokenResult = await pool.query(
      'SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1',
      [token]
    )

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    const { user_id, expires_at } = tokenResult.rows[0]

    // Check if token is expired
    if (new Date() > new Date(expires_at)) {
      await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token])
      return res.status(400).json({ message: 'Password reset token has expired' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password
    const userResult = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, email, name',
      [hashedPassword, user_id]
    )

    const user = userResult.rows[0]

    // Delete the reset token
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token])

    res.json({
      message: 'Password reset successfully. You can now login with your new password.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Password reset failed' })
  }
})

module.exports = router
