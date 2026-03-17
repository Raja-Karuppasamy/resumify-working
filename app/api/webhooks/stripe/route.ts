import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map Stripe priceId → your subscription tier
function getTierFromPriceId(priceId: string): 'pro' | 'enterprise' | 'free' {
  if (priceId === process.env.STRIPE_STARTUP_PRICE_ID) return 'pro'
  if (priceId === process.env.STRIPE_GROWTH_PRICE_ID) return 'enterprise'
  return 'free'
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    switch (event.type) {

      // ── Payment successful → activate plan ──────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id  // ← keep as user_id to match your existing metadata key

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )
          const priceId = subscription.items.data[0].price.id
          const tier = getTierFromPriceId(priceId)

          await supabase
            .from('profiles')        // ← FIX 1: was 'users', should match your actual table
            .update({
              subscription_tier: tier,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: session.customer as string,
              subscription_status: 'active',
            })
            .eq('id', userId)
        }
        break
      }

      // ── Plan changed (upgrade/downgrade) ────────────────────
      case 'customer.subscription.updated': {   // ← FIX 2: this case was missing entirely
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0].price.id
        const tier = getTierFromPriceId(priceId)

        await supabase
          .from('profiles')
          .update({
            subscription_tier: subscription.status === 'active' ? tier : 'free',
            subscription_status: subscription.status,
          })
          .eq('stripe_customer_id', customerId)

        break
      }

      // ── Subscription cancelled ───────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await supabase
          .from('profiles')          // ← FIX 1: was 'users'
          .update({
            subscription_tier: 'free',
            stripe_subscription_id: null,
            subscription_status: 'cancelled',
          })
          .eq('stripe_customer_id', customerId)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
