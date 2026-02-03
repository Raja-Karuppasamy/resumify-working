import Stripe from 'stripe'

// Only initialize Stripe on server-side to avoid client-side errors
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null as any

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '20 resumes per month',
      'AI-powered parsing (95% accuracy)',
      'Quality scoring',
      'ATS compatibility analysis',
      'JSON export',
    ],
    limits: {
      resumesPerMonth: 20,
      hasAIParsing: true,
      hasQualityScoring: true,
      hasATSAnalysis: true,
    },
  },
  pro: {
    name: 'Pro',
    price: 4.99,
    priceId: 'price_1SwdtC1huLM0ohjUcryMGujp',
    features: [
      '100 resumes per month',
      'AI-powered parsing (95% accuracy)',
      'Quality scoring',
      'ATS compatibility analysis',
      'JSON export',
      'Priority processing',
      'Email support',
    ],
    limits: {
      resumesPerMonth: 100,
      hasAIParsing: true,
      hasQualityScoring: true,
      hasATSAnalysis: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 9.99,
    priceId: 'price_1Swdul1huLM0ohjUHiLSpViP',
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
    limits: {
      resumesPerMonth: 500,
      hasAIParsing: true,
      hasQualityScoring: true,
      hasATSAnalysis: true,
    },
  },
} as const

export type SubscriptionTier = keyof typeof PLANS