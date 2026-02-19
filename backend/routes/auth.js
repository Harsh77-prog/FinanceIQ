const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { body, validationResult } = require('express-validator')
const pool = require('../config/database')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

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

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    )

    const user = result.rows[0]

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
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
    const result = await pool.query('SELECT id, email, password_hash, name FROM users WHERE email = $1', [email])
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const user = result.rows[0]

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
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
  })
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
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [googleUser.email])

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

    // Generate JWT token
    const token = jwt.sign(
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

module.exports = router
