'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

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
  const router = useRouter()
  const { login: authLogin } = useAuth()

  // Make callback available globally for Google Sign-In
  const handleGoogleSignIn = useCallback(async (response: any) => {
    setGoogleLoading(true)
    setError('')

    try {
      const result = await api.post('/auth/google', {
        idToken: response.credential,
      })

      // Store token in cookies (same as regular login)
      Cookies.set('token', result.data.token, { expires: 7 })
      
      // Redirect to dashboard - the AuthProvider will fetch user data on load
      router.push('/dashboard')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Google sign-in failed'
      setError(errorMsg)
      console.error('Google sign-in error:', err)
    } finally {
      setGoogleLoading(false)
    }
  }, [router])

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
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
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
      </div>

      <button
        type="submit"
        disabled={loading || googleLoading}
        className="btn-primary w-full"
      >
        {loading ? 'Signing in...' : 'Sign In with Email'}
      </button>
    </form>
  )
}