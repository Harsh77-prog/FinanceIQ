'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { api } from '@/lib/api'

export default function AnalysisPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [analysisData, setAnalysisData] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchAnalysis()
    }
  }, [user])

  const fetchAnalysis = async () => {
    try {
      const response = await api.get('/finance/overview')
      setAnalysisData(response.data)
    } catch (error) {
      console.error('Failed to fetch analysis:', error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const chartData = analysisData ? [
    { name: 'Income', value: analysisData.totalIncome },
    { name: 'Expenses', value: analysisData.totalExpenses },
    { name: 'Savings', value: analysisData.savings },
  ] : []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-50">Financial Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card card-pad card-hover">
            <h2 className="text-lg font-semibold mb-4 text-slate-50">Income vs Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card card-pad card-hover">
            <h2 className="text-lg font-semibold mb-4 text-slate-50">Financial Health Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[{ month: 'Jan', score: analysisData?.healthScore || 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#34d399" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
