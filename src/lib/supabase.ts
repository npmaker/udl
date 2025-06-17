import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// For development: use placeholder values if environment variables are missing
const defaultUrl = supabaseUrl || 'https://placeholder.supabase.co'
const defaultKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(defaultUrl, defaultKey)

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      log_entries: {
        Row: {
          id: string
          user_id: string
          key: string
          value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          key: string
          value: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          key?: string
          value?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
