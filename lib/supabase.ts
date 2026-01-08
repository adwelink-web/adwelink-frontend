
import { createBrowserClient } from '@supabase/ssr'
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from './env_config'
import { Database } from './database.types'

// Client-Side Usage Only
export function createClient() {
    if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("FATAL: Supabase Environment Variables are missing! Check .env.local")
        // Return a dummy client or throw to prevent further ambiguous errors
    }
    return createBrowserClient<Database>(
        NEXT_PUBLIC_SUPABASE_URL!,
        NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
