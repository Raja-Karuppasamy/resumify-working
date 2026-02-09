"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PLANS } from '@/lib/stripe'
import Link from 'next/link'

const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
)

export default function PricingPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [annual, setAnnual] = useState(false)
  
// Add this useEffect to refresh profile on successful payment
useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      // Refresh profile to get updated subscription
      refreshProfile()
      // Clean up URL
      window.history.replaceState({}, '', '/pricing')
    }
  }, [refreshProfile])

  const handleUpgrade = async (priceId: string) => {
    if (!user) {
      alert('Please sign in to upgrade')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId,
          userId: user.id  
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data)
        alert('Failed to create checkout session: ' + (data.error || 'Unknown error'))
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong')
      setLoading(false)
    }
  }

  const currentTier = profile?.subscription_tier || 'free'
  const usageCount = profile?.usage_count || 0
  const usageLimit = currentTier === 'free' ? 20 : currentTier === 'pro' ? 100 : 500

  const plans = [
    {
      key: 'free' as const,
      features: [
        '20 resumes per month',
        'AI-powered parsing (95% accuracy)',
        'Quality scoring',
        'ATS compatibility analysis',
        'JSON export',
      ],
    },
    {
      key: 'pro' as const,
      badge: 'Most Popular',
      features: [
        '100 resumes per month',
        'AI-powered parsing (95% accuracy)',
        'Quality scoring',
        'ATS compatibility analysis',
        'JSON export',
        'Priority processing',
        'Email support',
      ],
    },
    {
      key: 'enterprise' as const,
      features: [
        '500 resumes per month',
        'AI-powered parsing (95% accuracy)',
        'Quality scoring',
        'ATS compatibility analysis',
        'JSON export',
        'Priority processing',
        'Email support (24/7)',
        'Advanced analytics',
        'Custom integrations',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Resumify</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">Home</Link>
            <Link href="/pricing" className="text-indigo-600 font-semibold text-sm">Pricing</Link>
            <Link href="/" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
              Get API Key
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6">
          <span className="text-indigo-600 text-sm font-semibold">💎 Simple, transparent pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Choose the plan that<br />
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">fits your needs</span>
        </h1>
        <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
          Start free, upgrade when you're ready. No hidden fees, no credit card required to get started.
        </p>

        {/* Current plan badge - only for logged in users */}
        {user && profile && (
          <div className="mt-5 inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg">
            <span>Current Plan:</span>
            <strong className="capitalize">{currentTier}</strong>
            <span className="text-indigo-400">•</span>
            <span>Usage: <strong>{usageCount}/{usageLimit}</strong></span>
          </div>
        )}

        {/* Annual Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-sm font-medium ${!annual ? "text-gray-900" : "text-gray-400"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${annual ? "bg-indigo-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${annual ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? "text-gray-900" : "text-gray-400"}`}>
            Annual <span className="text-emerald-600 font-semibold">(Save 20%)</span>
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const planData = PLANS[plan.key]
            const isHighlighted = plan.key === 'pro'
            const isCurrent = currentTier === plan.key
            const monthlyPrice = planData.price
            const displayPrice = annual && monthlyPrice > 0
              ? (monthlyPrice * 0.8).toFixed(2)
              : monthlyPrice.toFixed(2)

            return (
              <div
                key={plan.key}
                className={`relative rounded-2xl flex flex-col transition-all duration-300 ${
                  isHighlighted
                    ? "bg-gradient-to-b from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-200 scale-105 border-2 border-indigo-400"
                    : "bg-white border border-gray-200 shadow-md hover:shadow-lg text-gray-900"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                      ✨ {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-grow">
                  {/* Plan Name */}
                  <h2 className={`text-lg font-bold uppercase tracking-wider ${isHighlighted ? "text-indigo-200" : "text-gray-500"}`}>
                    {planData.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-end gap-1 mt-4">
                    <span className={`text-5xl font-extrabold ${isHighlighted ? "text-white" : "text-gray-900"}`}>
                      ${monthlyPrice === 0 ? '0' : displayPrice}
                    </span>
                    <span className={`text-base mb-1.5 ${isHighlighted ? "text-indigo-200" : "text-gray-400"}`}>
                      {monthlyPrice > 0 ? "/month" : "forever"}
                    </span>
                  </div>

                  {/* Annual note */}
                  {annual && monthlyPrice > 0 && (
                    <span className={`text-xs mt-1 ${isHighlighted ? "text-indigo-200" : "text-emerald-600"}`}>
                      billed ${(monthlyPrice * 0.8 * 12).toFixed(2)}/year
                    </span>
                  )}

                  {/* Divider */}
                  <div className={`border-t my-6 ${isHighlighted ? "border-indigo-400/40" : "border-gray-100"}`} />

                  {/* Features */}
                  <ul className="space-y-3 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckIcon />
                        <span className={`text-sm ${isHighlighted ? "text-white" : "text-gray-700"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {isCurrent ? (
                    <button
                      disabled
                      className={`mt-8 w-full text-center py-3 rounded-xl font-semibold text-sm cursor-not-allowed ${
                        isHighlighted
                          ? "bg-indigo-400/40 text-indigo-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      Current Plan
                    </button>
                  ) : plan.key === 'free' ? (
                    <Link
                      href="/"
                      className="mt-8 w-full text-center py-3 rounded-xl font-semibold text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                    >
                      Get Started Free
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(planData.priceId!)}
                      disabled={loading || !user}
                      className={`mt-8 w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isHighlighted
                          ? "bg-white text-indigo-600 hover:bg-gray-50 shadow-lg"
                          : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
                      }`}
                    >
                      {loading ? 'Redirecting...' : !user ? 'Sign in to Upgrade' : `Get ${planData.name}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: "Do I need a credit card to start?",
              a: "Nope! You can start with the Free plan right away — no credit card needed. Upgrade anytime when you're ready.",
            },
            {
              q: "What happens if I exceed my monthly limit?",
              a: "Parsing will be paused until your next billing cycle. You'll see a clear message prompting you to upgrade. No surprise charges.",
            },
            {
              q: "Can I switch plans at any time?",
              a: "Yes! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately.",
            },
            {
              q: "What kind of resumes does Resumify support?",
              a: "Resumify supports PDF resumes in any format. Our Claude AI-powered parser handles complex layouts, multi-column designs, and various styles with 95% accuracy.",
            },
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900">{faq.q}</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-gray-400 text-sm">
            Built with FastAPI, Claude AI & Next.js · © 2026 Resumify
          </p>
        </div>
      </footer>
    </div>
  )
}