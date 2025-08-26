import { createClient } from '@supabase/supabase-js'


const SupaBaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SupaBaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY


 export const supabase = createClient(
    SupaBaseURL,SupaBaseKey
)