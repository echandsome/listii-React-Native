import { createClient } from "@supabase/supabase-js"
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from "@/constants/Config";

const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, options)

export default supabase