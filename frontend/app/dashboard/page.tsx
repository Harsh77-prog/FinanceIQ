'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import FinancialOverview from '@/components/dashboard/FinancialOverview'
import RiskAssessment from '@/components/dashboard/RiskAssessment'
import QuickActions from '@/components/dashboard/QuickActions'
import PortfolioAllocation from '@/components/dashboard/PortfolioAllocation'
import InsightsCard from '@/components/dashboard/InsightsCard'
import NetWorthTrend from '@/components/dashboard/NetWorthTrend'
import AlertsRecommendations from '@/components/dashboard/AlertsRecommendations'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, {user.name || user.email}</p>
          </div>
        </div>

        <FinancialOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InsightsCard />
          <NetWorthTrend />
          <AlertsRecommendations />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskAssessment />
          <QuickActions />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioAllocation />
        </div>
      </div>
    </DashboardLayout>
  )
}
