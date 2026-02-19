'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { AlertCircle, CheckCircle, Lock } from 'lucide-react'

export default function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('No password reset token provided')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/reset-password', {
        token,
        password,
      })

      setSuccess(true)
      setPassword('')
      setConfirmPassword('')

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md w-full">
          <div className="card card-pad text-center">
            <AlertCircle className="h-12 w-12 text-danger-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-50 mb-2">Invalid Link</h1>
            <p className="text-slate-400 mb-6">Password reset link is invalid or missing.</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary w-full"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md w-full">
          <div className="card card-pad text-center">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-50 mb-2">Password Reset Successfully!</h1>
            <p className="text-slate-400 mb-4">Your password has been updated. Redirecting to login...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full">
        <div className="card card-pad">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-500/20 mx-auto mb-4">
            <Lock className="h-6 w-6 text-primary-400" />
          </div>

          <h1 className="text-2xl font-bold text-slate-50 text-center mb-2">Reset Password</h1>
          <p className="text-slate-400 text-center mb-6">Enter your new password below</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-danger-500/10 border border-danger-500/20 text-danger-200 rounded-xl text-sm flex items-gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400 text-center">
              Remember your password?{' '}
              <button
                onClick={() => router.push('/')}
                className="text-primary-400 hover:text-primary-300 transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
