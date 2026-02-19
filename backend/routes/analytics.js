const express = require('express')
const { authenticateToken } = require('../middleware/auth')
const { getDashboardAnalytics } = require('../services/analytics.service')

const router = express.Router()

router.use(authenticateToken)

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id
    const data = await getDashboardAnalytics(userId)
    res.json(data)
  } catch (e) {
    console.error('Analytics dashboard error:', e)
    res.status(500).json({ message: 'Failed to compute analytics' })
  }
})

// GET /api/analytics/cashflow-forecast
router.get('/cashflow-forecast', async (req, res) => {
  try {
    const userId = req.user.id
    const { forecastNext6Months } = require('../services/cashflow.service')
    const data = await forecastNext6Months(userId)
    res.json(data)
  } catch (e) {
    console.error('Cashflow forecast error:', e)
    res.status(500).json({ message: 'Failed to compute cashflow forecast' })
  }
})

module.exports = router
