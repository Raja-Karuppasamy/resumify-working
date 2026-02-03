"use client"

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PLANS } from '@/lib/stripe'
import Link from 'next/link'

export default function HomePage() {
  const { user, profile, signOut, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg mx-auto mb-4 animate-pulse">
            R
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                R
              </div>
              <span className="text-xl font-bold text-slate-900">Resumify</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/pricing"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Pricing
              </Link>

              {user ? (
                <>
                  <Link
                    href="/playground"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Parser
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Resume Parser API that
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              just works
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Parse PDFs, DOCX, and scanned resumes into clean, structured JSON — without brittle regex, layout hacks, or OCR nightmares.
          </p>

          {user ? (
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              Start Parsing Resumes
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              Get Started Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-200 bg-white/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-slate-600">Parsing Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">&lt;30s</div>
            <div className="text-slate-600">Average Processing Time</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10MB</div>
            <div className="text-slate-600">Max File Size</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why developers choose Resumify
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl mb-4">
                🤖
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered</h3>
              <p className="text-slate-600">
                Claude AI achieves 95% accuracy vs 60% industry average. No more manual corrections.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Scoring</h3>
              <p className="text-slate-600">
                Get detailed quality analysis with actionable recommendations to improve resumes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white text-2xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">ATS Compatible</h3>
              <p className="text-slate-600">
                Check if resumes will pass Applicant Tracking Systems with detailed compatibility analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-300 mb-12">
            Start free, upgrade when you need more
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(PLANS).map(([tier, plan]) => (
              <div
                key={tier}
                className={`bg-white rounded-2xl p-8 ${
                  tier === 'pro' ? 'ring-2 ring-blue-500 shadow-2xl' : 'shadow-lg'
                }`}
              >
                {tier === 'pro' && (
                  <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  {plan.price > 0 && <span className="text-slate-600">/month</span>}
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={`block w-full py-3 rounded-xl font-semibold transition-colors ${
                    tier === 'pro'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {tier === 'free' ? 'Get Started' : 'Upgrade'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to parse resumes like a pro?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of developers using Resumify to power their hiring platforms
          </p>
          {user ? (
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold text-lg shadow-xl"
            >
              Go to Parser
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold text-lg shadow-xl"
            >
              Start Free Today
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            Built with FastAPI, Claude AI & Next.js
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  )
}

// Auth Modal Component
function AuthModal({ onClose }: { onClose: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {isSignUp ? 'Create an account' : 'Welcome back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
