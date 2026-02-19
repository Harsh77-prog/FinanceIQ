'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Calendar, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function GoalProjections() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await api.get('/goals/projections/all')
      setItems(res.data.projections || [])
    } catch (e) {
      console.error('Failed to load projections', e)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="card card-pad card-hover">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary-300"/>
        <h3 className="text-lg font-semibold text-slate-50">Goal Projections</h3>
      </div>
      {loading ? <div className="h-24 bg-slate-800/60 rounded-xl animate-pulse"/> : (
        <div className="space-y-3">
          {items.length===0 ? <div className="text-sm text-slate-400">No active goals.</div> : items.map((x:any, i:number)=> (
            <div key={i} className="p-3 rounded-xl border border-slate-800/70 bg-slate-900/40">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-100">{x.goal.name}</div>
                <div className="text-xs text-slate-400">Feasibility {x.projection.feasibilityScore}%</div>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {x.projection.feasible && x.projection.monthsToGoal !== null ? (
                  <div className="flex items-center gap-1 text-success-200">
                    <CheckCircle2 className="h-4 w-4"/> Completion in {x.projection.monthsToGoal} months (by {x.projection.completionDate})
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-200">
                    <AlertTriangle className="h-4 w-4"/> Increase monthly savings to ₹{x.projection.requiredMonthly?.toLocaleString('en-IN')} to reach in ~10 years.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
