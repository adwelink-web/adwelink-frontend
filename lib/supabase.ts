
import { createBrowserClient } from '@supabase/ssr'
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from './env_config'
import { Database } from './database.types'

// Client-Side Usage Only
export function createClient() {
    return createBrowserClient<Database>(
        NEXT_PUBLIC_SUPABASE_URL!,
        NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
