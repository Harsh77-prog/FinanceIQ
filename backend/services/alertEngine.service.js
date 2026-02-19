const pool = require('../config/database')

function mapSeverityToDb(sev) {
  switch (sev) {
    case 'critical': return 'critical'
    case 'warning': return 'medium'
    case 'high': return 'high'
    case 'info':
    default: return 'low'
  }
}

async function incomeExpenseInPeriod(userId, start, end) {
  const income = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS total FROM transactions WHERE user_id=$1 AND type='income' AND date BETWEEN $2 AND $3`,
    [userId, start, end]
  )
  const expenses = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS total FROM transactions WHERE user_id=$1 AND type='expense' AND date BETWEEN $2 AND $3`,
    [userId, start, end]
  )
  return { income: parseFloat(income.rows[0].total)||0, expenses: parseFloat(expenses.rows[0].total)||0 }
}

async function getEmergencyFund(userId) {
  const savingsRes = await pool.query('SELECT COALESCE(SUM(amount),0) AS total FROM savings WHERE user_id=$1', [userId])
  const cash = parseFloat(savingsRes.rows[0].total)||0
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth()-3, 1).toISOString().slice(0,10)
  const end = now.toISOString().slice(0,10)
  const { expenses } = await incomeExpenseInPeriod(userId, start, end)
  const avgMonthly = expenses/3
  const months = avgMonthly>0 ? cash/avgMonthly : 0
  return { months, cash, avgMonthly }
}

function mapTypeToBucket(type) {
  const t = (type || '').toLowerCase()
  if (['stock','stocks','equity','mutualfund','mutual fund','mf','crypto','cryptocurrency','etf'].some(k => t.includes(k))) return 'equity'
  if (['debt','bond','bonds','fixed income','fd'].some(k => t.includes(k))) return 'debt'
  if (['gold'].some(k => t.includes(k))) return 'gold'
  if (['cash','liquid','savings','bank'].some(k => t.includes(k))) return 'liquid'
  return 'equity'
}

async function currentAllocation(userId) {
  const assets = await pool.query('SELECT type, quantity, price FROM assets WHERE user_id=$1', [userId])
  const sums = { equity: 0, debt: 0, gold: 0, liquid: 0 }
  let total = 0
  for (const a of assets.rows) {
    const qty = parseFloat(a.quantity)||0
    const price = parseFloat(a.price)||0
    const val = qty*price
    sums[mapTypeToBucket(a.type)] += val
    total += val
  }
  const w = total>0 ? {
    equity: (sums.equity/total)*100,
    debt: (sums.debt/total)*100,
    gold: (sums.gold/total)*100,
    liquid: (sums.liquid/total)*100,
  } : { equity:0, debt:0, gold:0, liquid:0 }
  return { weights: {
    equity: Math.round(w.equity*100)/100,
    debt: Math.round(w.debt*100)/100,
    gold: Math.round(w.gold*100)/100,
    liquid: Math.round(w.liquid*100)/100,
  }, total }
}

async function targetAllocation(userId) {
  const p = await pool.query('SELECT target_allocation FROM profiles WHERE user_id=$1', [userId])
  if (p.rows.length && p.rows[0].target_allocation) {
    const ta = p.rows[0].target_allocation
    return { equity: ta.equity||0, debt: ta.debt||0, gold: ta.gold||0, liquid: ta.liquid||0 }
  }
  const r = await pool.query('SELECT risk_level FROM risk_assessments WHERE user_id=$1 ORDER BY assessment_date DESC LIMIT 1', [userId])
  const risk = r.rows[0]?.risk_level || 'Balanced'
  const map = {
    Conservative: { equity: 20, debt: 60, gold: 10, liquid: 10 },
    Balanced: { equity: 50, debt: 30, gold: 10, liquid: 10 },
    Aggressive: { equity: 70, debt: 15, gold: 10, liquid: 5 },
  }
  return map[risk] || map.Balanced
}

async function generateAlerts(userId) {
  const alerts = []
  const now = new Date()
  const start30 = new Date(now)
  start30.setDate(start30.getDate() - 30)
  const { income, expenses } = await incomeExpenseInPeriod(userId, start30.toISOString().slice(0,10), now.toISOString().slice(0,10))

  // Overspending rule
  if (income > 0 && expenses > 0.8 * income) {
    const ratio = Math.round((expenses/income)*100)
    alerts.push({ alert_type: 'overspending', severity: 'warning', message: `Expenses are ${ratio}% of income this month.` })
  }

  // Emergency fund coverage
  const ef = await getEmergencyFund(userId)
  if (ef.months < 1) {
    alerts.push({ alert_type: 'emergency_fund', severity: 'critical', message: 'Emergency fund < 1 month. Build 3-6 months coverage.' })
  } else if (ef.months < 3) {
    alerts.push({ alert_type: 'emergency_fund', severity: 'warning', message: 'Emergency fund below 3 months. Aim for 3-6 months.' })
  }

  // Portfolio overweight vs target
  const cur = await currentAllocation(userId)
  const tgt = await targetAllocation(userId)
  const keys = ['equity','debt','gold','liquid']
  for (const k of keys) {
    const drift = (cur.weights[k]||0) - (tgt[k]||0)
    if (drift > 10) {
      alerts.push({ alert_type: 'portfolio_overweight', severity: 'warning', message: `You are overweight in ${k} by ${Math.round(drift)}%. Consider rebalancing.` })
    }
  }

  // Predictive: months to zero based on last 3 months net cashflow and savings balance
  const start3 = new Date(now.getFullYear(), now.getMonth()-3, 1).toISOString().slice(0,10)
  const { income: inc3, expenses: exp3 } = await incomeExpenseInPeriod(userId, start3, now.toISOString().slice(0,10))
  const netMonthly = (inc3 - exp3)/3
  const savingsRes = await pool.query('SELECT COALESCE(SUM(amount),0) AS total FROM savings WHERE user_id=$1', [userId])
  const balance = parseFloat(savingsRes.rows[0].total)||0
  if (netMonthly < 0 && balance > 0) {
    const monthsToZero = balance / Math.abs(netMonthly)
    if (monthsToZero <= 6) {
      alerts.push({ alert_type: 'predictive_cash_shortfall', severity: monthsToZero<=3 ? 'critical' : 'warning', message: `At the current burn rate, cash may reach zero in ${Math.ceil(monthsToZero)} months.` })
    }
  }

  return alerts
}

async function persistAlerts(userId, alerts) {
  const today = new Date().toISOString().split('T')[0]
  for (const a of alerts) {
    const exists = await pool.query(
      `SELECT id FROM risk_alerts WHERE user_id=$1 AND alert_type=$2 AND DATE(created_at)=$3 AND is_read=false`,
      [userId, a.alert_type, today]
    )
    if (!exists.rows.length) {
      await pool.query(
        `INSERT INTO risk_alerts (user_id, alert_type, severity, message) VALUES ($1,$2,$3,$4)`,
        [userId, a.alert_type, mapSeverityToDb(a.severity), a.message]
      )
    }
  }
}

module.exports = { generateAlerts, persistAlerts }
