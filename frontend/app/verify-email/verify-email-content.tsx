'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import Cookies from 'js-cookie'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('No verification token provided')
        return
      }

      try {
        const response = await api.post('/auth/verify-email', { token })
        
        // Store token
        Cookies.set('token', response.data.token, { expires: 7 })
        
        setStatus('success')
        setMessage('Email verified successfully! Redirecting to dashboard...')
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } catch (error: any) {
        setStatus('error')
        const errorMessage = error.response?.data?.message || 'Failed to verify email'
        setMessage(errorMessage)
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full">
        <div className="card card-pad text-center">
          {status === 'loading' && (
            <>
              <Loader className="h-12 w-12 text-primary-400 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-slate-50 mb-2">Verifying Email</h1>
              <p className="text-slate-400">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-50 mb-2">Email Verified!</h1>
              <p className="text-slate-400 mb-4">{message}</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-danger-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-50 mb-2">Verification Failed</h1>
              <p className="text-slate-400 mb-6">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary w-full"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
