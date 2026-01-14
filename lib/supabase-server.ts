
import { createServerClient as createServerClientSSR, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from './env_config'
import { Database } from './database.types'

// Regular server client - respects RLS policies (for normal institute users)
export async function createServerClient() {
    const cookieStore = await cookies()

    return createServerClientSSR<Database>(
        NEXT_PUBLIC_SUPABASE_URL!,
        NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch {
                        // The `set` method was called from a Server Component.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch {
                        // The `delete` method was called from a Server Component.
                    }
                },
            },
        }
    )
}

// Admin client - bypasses RLS (for Super Admin operations only)
export function createAdminClient() {
    return createClient<Database>(
        NEXT_PUBLIC_SUPABASE_URL!,
        SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}
