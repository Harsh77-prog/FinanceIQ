require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const financeRoutes = require('./routes/finance')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/finance', financeRoutes)
app.use('/api/transactions', require('./routes/transactions'))
app.use('/api/goals', require('./routes/goals'))
app.use('/api/portfolio', require('./routes/portfolio'))
app.use('/api/alerts', require('./routes/alerts'))
app.use('/api/analytics', require('./routes/analytics'))
app.use('/api/budget', require('./routes/budget'))
app.use('/api/wealth', require('./routes/wealth'))

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
})
