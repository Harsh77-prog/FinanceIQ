'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import {
  TrendingUp,
  Shield,
  Brain,
  Target,
  BarChart3,
  Zap,
} from 'lucide-react'

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { login, register } = useAuth()

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary-500/25 blur-3xl animate-blob-slow" />
        <div className="absolute -right-10 top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl animate-blob-slow" />
        <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-blob-slow" />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_transparent_55%),linear-gradient(#0f172a_1px,transparent_1px),linear-gradient(90deg,#0f172a_1px,transparent_1px)] bg-[length:auto,80px_80px,80px_80px] opacity-40" />

      {/* Header */}
      <header className="container-app py-5 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 ring-1 ring-primary-500/40">
              <TrendingUp className="h-5 w-5 text-primary-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight sm:text-xl">
              FinanceIQ
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-app pb-12 pt-4 sm:pt-6 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Left Side - Hero & feature cards */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                AI-powered wealth insights
              </p>
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                The Modern Solution
                <br />
                <span className="text-primary-300">
                  For Financial Opportunity
                </span>
              </h1>
              <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                Create and track your financial journey with intelligent
                analytics, Monte Carlo simulations, and risk insights crafted
                for Indian investors.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card card-pad card-hover animate-float-soft">
                <Shield className="mb-3 h-6 w-6 text-primary-300" />
                <h3 className="mb-1 text-sm font-semibold text-slate-50">
                  Smart Risk Guard
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time risk score and alerts tuned to your portfolio.
                </p>
              </div>

              <div className="card card-pad card-hover">
                <Brain className="mb-3 h-6 w-6 text-primary-300" />
                <h3 className="mb-1 text-sm font-semibold text-slate-50">
                  AI Opportunity Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Machine learning projections on savings, goals and cashflow.
                </p>
              </div>

              <div className="card card-pad card-hover">
                <Target className="mb-3 h-6 w-6 text-primary-300" />
                <h3 className="mb-1 text-sm font-semibold text-slate-50">
                  Goal Playbooks
                </h3>
                <p className="text-xs text-slate-400">
                  Ready-made tracks for education, house, retirement and more.
                </p>
              </div>

              <div className="card card-pad card-hover">
                <BarChart3 className="mb-3 h-6 w-6 text-primary-300" />
                <h3 className="mb-1 text-sm font-semibold text-slate-50">
                  Live Portfolio Radar
                </h3>
                <p className="text-xs text-slate-400">
                  Allocation heatmaps and Monte Carlo stress tests in one view.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 sm:text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-300" />
                <span>Realtime analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-300" />
                <span>Bank-grade security</span>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="lg:justify-self-end">
            <div className="card card-pad max-w-md border-primary-500/20 bg-slate-900/80">
              <div className="mb-6 flex space-x-2 rounded-full bg-slate-900/70 p-1 text-xs ring-1 ring-slate-700">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 rounded-full py-2 text-center font-medium transition ${
                    isLogin
                      ? 'bg-primary-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 rounded-full py-2 text-center font-medium transition ${
                    !isLogin
                      ? 'bg-primary-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {isLogin ? (
                <LoginForm onLogin={login} />
              ) : (
                <RegisterForm onRegister={register} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
