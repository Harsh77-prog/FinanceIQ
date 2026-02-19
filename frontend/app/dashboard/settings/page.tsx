'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Settings as SettingsIcon } from 'lucide-react'
import ProfileForm from '@/components/settings/ProfileForm'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-7 w-7 text-primary-300" />
          <h1 className="text-3xl font-bold text-slate-50">Settings</h1>
        </div>

        <div className="card card-pad card-hover">
          <h2 className="text-lg font-semibold mb-4 text-slate-50">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="input opacity-70"
              />
            </div>
          </div>
        </div>

        <ProfileForm />
      </div>
    </DashboardLayout>
  )
}
