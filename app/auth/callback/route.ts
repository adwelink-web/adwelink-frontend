import { createServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { isSuperAdmin } from "@/lib/super-admin"

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/home"

    if (code) {
        const supabase = await createServerClient()
        const { error, data: { user } } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && user?.email) {
            // Check if user is Super Admin
            if (isSuperAdmin(user.email)) {
                return NextResponse.redirect(`${origin}/super-admin`)
            }
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_code_error`)
}
