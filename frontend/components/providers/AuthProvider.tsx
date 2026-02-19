'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  name?: string
  emailVerified?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  googleLogin: (token: string, userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = Cookies.get('token')
    if (token) {
      try {
        const response = await api.get('/auth/me')
        setUser(response.data.user)
      } catch (error) {
        Cookies.remove('token')
      }
    }
    setLoading(false)
  }

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    Cookies.set('token', response.data.token, { expires: 7 })
    setUser(response.data.user)
  }

  const register = async (email: string, password: string, name: string) => {
    // Registration doesn't return token since user is not verified yet
    await api.post('/auth/register', { email, password, name })
    // Don't set user or token - user needs to verify email first
  }

  const googleLogin = (token: string, userData: User) => {
    Cookies.set('token', token, { expires: 7 })
    setUser(userData)
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
