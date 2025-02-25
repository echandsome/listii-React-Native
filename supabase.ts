import { createClient } from "@supabase/supabase-js"
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from "@/constants/Config";

const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// const _delete = async() => {
//   const { data, error } = await supabase.from('lists').delete().eq("user_id", '6a9525a2-a4d8-461d-9ee4-defb9675c7fe');
//   await supabase.from('items').delete().eq("user_id", '6a9525a2-a4d8-461d-9ee4-defb9675c7fe');
  
// }
// _delete();

export default supabase