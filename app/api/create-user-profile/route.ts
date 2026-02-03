import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json()

    const { error } = await supabase.from('users').insert({
      id: userId,
      email: email,
      subscription_tier: 'free',
      usage_count: 0,
      usage_reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })

    if (error) {
      console.error('Error creating user profile:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
