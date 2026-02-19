const pool = require('../config/database')

function fvOfAnnuityPMT(pmt, r, n) {
  if (r === 0) return pmt * n
  return pmt * ((Math.pow(1 + r, n) - 1) / r)
}

function solveMonthsForTarget(pv, pmt, rMonthly, target) {
  // pv: current_amount, pmt: monthly_contribution, rMonthly: monthly real return, target: target_amount
  // Brute force small range (0..600 months) to find first n s.t. pv*(1+r)^n + FV_annuity >= target
  const maxMonths = 1200 // up to 100 years safe cap
  let acc = pv
  for (let n = 0; n <= maxMonths; n++) {
    const ann = fvOfAnnuityPMT(pmt, rMonthly, n)
    const value = acc + ann
    if (value >= target) return n
    acc *= (1 + rMonthly)
  }
  return null
}

async function projectGoal(goal, { expectedReturn = 0.08, inflation = 0.03 } = {}) {
  const pv = parseFloat(goal.current_amount) || 0
  const target = parseFloat(goal.target_amount) || 0
  const pmt = parseFloat(goal.monthly_contribution) || 0
  const realReturn = Math.max(0, expectedReturn - inflation)
  const rMonthly = realReturn / 12

  if (target <= pv) {
    return {
      goalId: goal.id,
      feasible: true,
      monthsToGoal: 0,
      completionDate: new Date().toISOString().slice(0,10),
      requiredMonthly: 0,
      feasibilityScore: 100,
      successNote: 'Goal already reached.'
    }
  }

  const months = solveMonthsForTarget(pv, pmt, rMonthly, target)
  let completionDate = null
  if (months !== null) {
    const d = new Date()
    d.setMonth(d.getMonth() + months)
    completionDate = d.toISOString().slice(0,10)
  }

  // If infeasible with current pmt, compute required pmt to hit in 10 years (120 months) as guidance
  let requiredMonthly = 0
  if (months === null) {
    const horizon = 120
    const denom = rMonthly === 0 ? horizon : ((Math.pow(1+rMonthly, horizon) - 1) / rMonthly)
    const gap = Math.max(0, target - pv*Math.pow(1+rMonthly, horizon))
    requiredMonthly = denom > 0 ? gap / denom : (gap / horizon)
  }

  // Feasibility score: 0..100 based on ratio of pmt to requiredMonthly for a 10-year target
  let feasibilityScore = 50
  if (requiredMonthly > 0) {
    const ratio = pmt / requiredMonthly
    feasibilityScore = Math.max(0, Math.min(100, Math.round(ratio * 100)))
  } else if (months !== null) {
    feasibilityScore = 80
  }

  return {
    goalId: goal.id,
    feasible: months !== null,
    monthsToGoal: months,
    completionDate,
    requiredMonthly: Math.round(requiredMonthly * 100) / 100,
    feasibilityScore
  }
}

async function getUserGoalProjections(userId, opts) {
  const res = await pool.query('SELECT * FROM goals WHERE user_id=$1 AND status=\'active\'', [userId])
  const projections = []
  for (const g of res.rows) {
    const p = await projectGoal(g, opts)
    projections.push({ goal: { id: g.id, name: g.name, target_amount: g.target_amount, current_amount: g.current_amount, monthly_contribution: g.monthly_contribution }, projection: p })
  }
  return projections
}

module.exports = { projectGoal, getUserGoalProjections }
