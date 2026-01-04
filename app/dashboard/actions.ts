"use server"

import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function getDashboardData() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // 1. Get User Profile (Institute Name)
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Metrics: Total Leads
    const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })

    // 3. Metrics: Today's Leads (New Inquiries)
    const today = new Date().toISOString().split('T')[0]
    const { count: todayLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today)

    // 4. Metrics: Pending Follow-ups
    // Matches status containing 'follow' (case insensitive)
    const { count: pendingFollowups } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .ilike("status", "%follow%")

    // 5. Recent Leads List (Last 5)
    const { data: recentLeads } = await supabase
        .from("leads")
        .select("id, name, phone, status, created_at, interested_course")
        .order("created_at", { ascending: false })
        .limit(5)

    return {
        user,
        stats: {
            totalLeads: totalLeads || 0,
            todayLeads: todayLeads || 0,
            pendingFollowups: pendingFollowups || 0,
        },
        recentLeads: recentLeads || []
    }
}
