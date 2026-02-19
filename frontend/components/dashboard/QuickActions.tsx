'use client'

import { useRouter } from 'next/navigation'
import { Plus, Target, BarChart3, AlertCircle } from 'lucide-react'

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      icon: Plus,
      label: 'Add Transaction',
      description: 'Record income or expense',
      color: 'bg-primary-600 hover:bg-primary-700',
      onClick: () => router.push('/dashboard/transactions'),
    },
    {
      icon: Target,
      label: 'Set Goal',
      description: 'Create financial goal',
      color: 'bg-success-600 hover:bg-success-700',
      onClick: () => router.push('/dashboard/goals'),
    },
    {
      icon: BarChart3,
      label: 'Run Simulation',
      description: 'Monte Carlo analysis',
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => router.push('/dashboard/portfolio'),
    },
    {
      icon: AlertCircle,
      label: 'View Alerts',
      description: 'Check risk warnings',
      color: 'bg-danger-600 hover:bg-danger-700',
      onClick: () => router.push('/dashboard/alerts'),
    },
  ]

  return (
    <div className="card card-pad card-hover">
      <h2 className="mb-5 text-lg font-semibold text-slate-50">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`${action.color} relative overflow-hidden rounded-xl p-3 text-left text-xs text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl sm:p-4`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent opacity-40" />
              <Icon className="mb-1 h-5 w-5 sm:h-6 sm:w-6" />
              <p className="mb-0.5 text-sm font-semibold sm:mb-1">
                {action.label}
              </p>
              <p className="text-[11px] opacity-90 sm:text-xs">
                {action.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
