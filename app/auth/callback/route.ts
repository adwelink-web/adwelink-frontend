import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSuperAdmin } from '@/lib/super-admin'
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from '@/lib/env_config'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/home'

    if (code) {
        // Create response to which we'll attach cookies
        const response = NextResponse.redirect(`${origin}${next}`)

        // Create Supabase client with request/response cookie handling
        const supabase = createServerClient(
            NEXT_PUBLIC_SUPABASE_URL!,
            NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, options)
                        })
                    },
                },
            }
        )

        // Exchange code for session - this will set auth cookies
        const { error, data: { user } } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && user?.email) {
            // Check if user is Super Admin and redirect accordingly
            if (isSuperAdmin(user.email)) {
                return NextResponse.redirect(`${origin}/super-admin`, {
                    headers: response.headers, // Preserve cookies
                })
            }

            // Return the response with cookies intact
            return response
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_code_error`)
}
