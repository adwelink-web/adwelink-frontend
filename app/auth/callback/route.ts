import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSuperAdmin } from '@/lib/super-admin'
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from '@/lib/env_config'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/home'

    if (code) {
        // Create Supabase client with proper cookie handling
        // We'll collect cookies to set them on the final response
        const cookiesToSet: { name: string; value: string; options: any }[] = []

        const supabase = createServerClient(
            NEXT_PUBLIC_SUPABASE_URL!,
            NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookies) {
                        cookiesToSet.push(...cookies)
                    },
                },
            }
        )

        // Exchange code for session - this will populate cookiesToSet
        const { error, data: { user } } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && user?.email) {
            // Determine final redirect destination
            const destination = isSuperAdmin(user.email)
                ? `${origin}/super-admin`
                : `${origin}${next}`

            // Create response and attach ALL collected cookies
            const response = NextResponse.redirect(destination)

            // Apply all cookies that Supabase set during session exchange
            cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options)
            })

            return response
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_code_error`)
}
