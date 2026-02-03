import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Use service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId } = await req.json()
    
    if (!userId || !priceId) {
      console.error('Missing userId or priceId')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Creating checkout session for user:', userId)

    // Fetch profile with service role key (bypasses RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (!profile) {
      console.error('Profile not found for user:', userId)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    console.log('Profile found:', profile.email)

    // Create or retrieve Stripe customer
    let customerId = profile.stripe_customer_id

    if (!customerId) {
      console.log('Creating Stripe customer')
      const customer = await stripe!.customers.create({
        email: profile.email,
        metadata: { supabase_user_id: userId },
      })
      customerId = customer.id

      // Update profile with customer ID
      await supabaseAdmin
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
      
      console.log('Created Stripe customer:', customerId)
    }

    // Create Stripe checkout session
    console.log('Creating checkout session for price:', priceId)
    const session = await stripe!.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { user_id: userId },
    })

    console.log('Checkout session created:', session.id)
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
