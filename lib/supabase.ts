import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          subscription_tier: 'free' | 'pro' | 'business'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          usage_count: number
          usage_reset_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          subscription_tier?: 'free' | 'pro' | 'business'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          usage_count?: number
          usage_reset_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_tier?: 'free' | 'pro' | 'business'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          usage_count?: number
          usage_reset_date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
