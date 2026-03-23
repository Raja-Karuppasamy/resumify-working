import Stripe from 'stripe'

// Only initialize Stripe on server-side to avoid client-side errors
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    })
  : null as any

export const PLANS = {
  free: {
    name: 'Developer',
    price: 0,
    priceId: null,
    features: [
      '200 resume parses per month',
      'ATS compatibility scoring',
      'Quality analysis & grading (A–F)',
      'Instant JSON results',
      'REST API access',
      'Community support',
    ],
    limits: {
      resumesPerMonth: 200,
      hasAIParsing: true,
      hasQualityScoring: true,
      hasATSAnalysis: true,
      hasBatchAPI: false,
      hasWebhooks: false,
      hasJDMatching: false,
    },
  },
  pro: {
    name: 'Startup',
    price: 49,
    priceId: 'price_1TBx9w1huLM0ohjU2yJDUkd8',
    features: [
      '2,000 resume parses per month',
      'ATS compatibility scoring',
      'Quality analysis & grading (A–F)',
      'Webhooks (push to your ATS/CRM)',
      'JD match scoring',
      'PDF + DOCX + TXT support',
      'Email support',
    ],
    limits: {
      resumesPerMonth: 2000,
      hasAIParsing: true,
      hasQualityScoring: true,
      hasATSAnalysis: true,
      hasBatchAPI: false,
      hasWebhooks: true,
      hasJDMatching: true,
    },
  },
  business: {
    name: 'Growth',
    price: 199,
    priceId: 'price_1TBxAJ1huLM0ohjUvckKtDRU',
    features: [
      '20,000 resume parses per month',
      'Everything in Startup',
      'Batch ZIP upload API',
      'Priority webhooks + retry logic',
      '99.9% uptime SLA',
      'White-label ready',
      'Priority support',
    ],
    limits: {
      resumesPerMonth: 20000,
      hasAIParsing: true,
      hasQualityScoring: true,
      hasATSAnalysis: true,
      hasBatchAPI: true,
      hasWebhooks: true,
      hasJDMatching: true,
    },
  },
} as const

export type SubscriptionTier = keyof typeof PLANS