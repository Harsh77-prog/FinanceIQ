'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface TrendPoint { month: string; netWorth: number }
interface NetWorth { assetsTotal: number; liabilitiesTotal: number; current: number; trend: TrendPoint[] }
interface DashboardResponse { netWorth: NetWorth }

export default function NetWorthTrend() {
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await api.get<DashboardResponse>('/analytics/dashboard')
      setTrend(res.data.netWorth?.trend || [])
    } catch (e) {
      console.error('Failed to fetch net worth trend', e)
      setTrend([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="card card-pad card-hover">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-6 w-6 text-primary-300" />
        <h2 className="text-lg font-semibold text-slate-50">Net Worth Trend</h2>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-800/60 rounded-xl animate-pulse"></div>
      ) : trend.length === 0 ? (
        <div className="text-sm text-slate-400">Not enough data to display trend.</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString('en-IN')}`} />
              <Line type="monotone" dataKey="netWorth" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
