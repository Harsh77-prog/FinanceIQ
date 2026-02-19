'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { AlertCircle, Mail } from 'lucide-react'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
}

declare global {
  interface Window {
    google?: any
  }
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const router = useRouter()
  const { googleLogin } = useAuth()

  // Make callback available globally for Google Sign-In
  const handleGoogleSignIn = useCallback(async (response: any) => {
    setGoogleLoading(true)
    setError('')

    try {
      const result = await api.post('/auth/google', {
        idToken: response.credential,
      })

      // Use AuthProvider's googleLogin to set both token and user state
      googleLogin(result.data.token, result.data.user)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Google sign-in failed'
      setError(errorMsg)
      console.error('Google sign-in error:', err)
    } finally {
      setGoogleLoading(false)
    }
  }, [router, googleLogin])

  useEffect(() => {
    // Register callback on window for Google to access
    (window as any).handleGoogleSignIn = handleGoogleSignIn
    
    // Load Google Sign-In script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID')
      setError('Google Sign-In is not configured')
    }

    script.onload = () => {
      try {
        if (window.google && clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
          })
          window.google.accounts.id.renderButton(
            document.getElementById('google-button'),
            { theme: 'outline', size: 'large' }
          )
        }
      } catch (err) {
        console.error('Failed to initialize Google Sign-In:', err)
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [handleGoogleSignIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onLogin(email, password)
      // Only redirect after successful login - backend will have validated email verification
      router.push('/dashboard')
    } catch (err: any) {
      setLoading(false)
      const status = err.response?.status
      const message = err.response?.data?.message || ''

      // Handle specific error cases
      if (status === 403 && message.includes('verify')) {
        setError('❌ Email not verified. Check your inbox for the verification link or request a new one.')
      } else if (status === 401) {
        setError('❌ Invalid email or password. Please try again.')
      } else if (status === 400) {
        setError(`❌ ${message}`)
      } else if (err.code === 'ECONNREFUSED') {
        setError('❌ Connection error. Please check your internet and try again.')
      } else {
        setError(message || '❌ Login failed. Please try again.')
      }
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)

    try {
      await api.post('/auth/forgot-password', { email: forgotEmail })
      setForgotSuccess(true)
      setForgotEmail('')
      
      // Reset after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false)
        setForgotSuccess(false)
      }, 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send password reset email')
      setForgotLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-danger-500/10 border border-danger-500/20 text-danger-200 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Google Sign-In Button */}
      <div
        id="google-button"
        className="flex justify-center p-3 rounded-xl border border-slate-700 hover:border-slate-600 transition"
      />


      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-900 text-slate-400">Or continue with email</span>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-xs text-primary-400 hover:text-primary-300 mt-1 transition"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading || googleLoading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
        {loading ? 'Signing in...' : 'Sign In with Email'}
      </button>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg p-6 max-w-md w-full border border-slate-700">
            {forgotSuccess ? (
              <div className="text-center">
                <Mail className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-50 mb-2">Check Your Email!</h3>
                <p className="text-sm text-slate-400">
                  We&apos;ve sent a password reset link to <strong>{forgotEmail}</strong>
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Forgot Password</h3>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="forgotEmail" className="block text-sm font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      id="forgotEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="input"
                      placeholder="you@example.com"
                    />
                  </div>

                  <p className="text-xs text-slate-400">
                    We&apos;ll send you a link to reset your password.
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="btn-primary flex-1"
                    >
                      {forgotLoading ? 'Sending...' : 'Send Link'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </form>
  )
}
