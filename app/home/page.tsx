import { getHomeStats } from "@/app/actions/get-home-stats"
import { HomeClientContainer } from "@/components/home-client-container"
import { createServerClient } from "@/lib/supabase-server"
import { isSuperAdmin } from "@/lib/super-admin"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AMSHomePage() {
    // Super Admin Guard: Redirect Super Admins to Command Center
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && isSuperAdmin(user.email)) {
        redirect("/super-admin")
    }

    const stats = await getHomeStats()

    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' }
    const initialDate = now.toLocaleDateString('en-US', options)

    return (
        <HomeClientContainer
            stats={stats}
            initialDate={initialDate}
        />
    )
}
