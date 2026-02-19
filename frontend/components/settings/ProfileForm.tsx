'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function ProfileForm() {
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await api.get('/wealth/profiles/me')
      setProfile(res.data.profile || {})
    } catch (e) {
      console.error('Profile load failed', e)
      setProfile({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  const update = async (e:any) => {
    e.preventDefault()
    try {
      const payload:any = { ...profile }
      if (payload.target_allocation && typeof payload.target_allocation === 'string') {
        try { payload.target_allocation = JSON.parse(payload.target_allocation) } catch {}
      }
      await api.put('/wealth/profiles/me', payload)
      alert('Profile saved')
    } catch (e) {
      alert('Failed to save profile')
    }
  }

  if (loading) return <div className="h-24 bg-slate-800/60 rounded-xl animate-pulse" />

  return (
    <div className="card card-pad card-hover">
      <h3 className="text-lg font-semibold text-slate-50 mb-4">Financial Profile</h3>
      <form onSubmit={update} className="grid md:grid-cols-2 gap-4">
        {[
          ['age','Age'],
          ['retirement_age','Retirement Age'],
          ['dependents','Dependents'],
          ['income_stability','Income Stability (low/medium/high)'],
          ['risk_quiz_score','Risk Quiz Score (0..100)'],
        ].map(([k,label])=> (
          <div key={k}>
            <label className="block text-sm text-slate-400 mb-1">{label}</label>
            <input
              value={profile?.[k] || ''}
              onChange={e=> setProfile({ ...profile, [k]: e.target.value })}
              className="input"
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-400 mb-1">
            Target Allocation (JSON, e.g. {`{ "equity":60, "debt":25, "gold":10, "liquid":5 }`})
          </label>
          <textarea
            value={typeof profile?.target_allocation === 'object' ? JSON.stringify(profile.target_allocation) : (profile?.target_allocation || '')}
            onChange={e=> setProfile({ ...profile, target_allocation: e.target.value })}
            className="input h-28"
          />
        </div>
        <div className="md:col-span-2">
          <button className="btn-primary w-full sm:w-auto px-5">Save Profile</button>
        </div>
      </form>
    </div>
  )
}
