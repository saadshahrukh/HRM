import { createClient } from '@supabase/supabase-js'


const SupaBaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SupaBaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY


 export const supabase = createClient(
    "https://utepclyeklimrwjvtxke.supabase.co" , 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXBjbHlla2xpbXJ3anZ0eGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTc3MDEsImV4cCI6MjA2OTc5MzcwMX0.z1AiGgmW3wbY7gmBjCnP1ymxRmFa71JP3wtiqGIJsPg'
)