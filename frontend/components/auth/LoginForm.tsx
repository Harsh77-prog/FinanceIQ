'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

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

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleSignIn,
        })
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleGoogleSignIn = async (response: any) => {
    setGoogleLoading(true)
    setError('')

    try {
      const result = await api.post('/auth/google', {
        idToken: response.credential,
      })

      // Store token
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))

      router.push('/dashboard')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Google sign-in failed'
      setError(errorMsg)
      console.error('Google sign-in error:', err)
    } finally {
      setGoogleLoading(false)
    }
  }

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
      <div id="google-signin-button" className="flex justify-center p-2 bg-slate-800/40 rounded-xl border border-slate-700 hover:border-slate-600 transition">
        <div
          id="g_id_onload"
          data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          data-callback="handleGoogleSignIn"
        />
        <div
          className="g_id_signin"
          data-type="standard"
          data-size="large"
          data-theme="dark"
          data-text="signin_with"
          data-shape="rectangular"
          data-logo_alignment="left"
        />
      </div>

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
