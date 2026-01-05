"use server"

import { createServerClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

export async function getDashboardData() {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    // 1. Get User Profile (Institute Name)
    const { data: { user } } = await supabase.auth.getUser()

    // PARALLEL EXECUTION START
    const today = new Date().toISOString().split('T')[0]

    const [
        totalLeadsResult,
        todayLeadsResult,
        pendingFollowupsResult,
        recentLeadsResult,
        totalStudentsResult
    ] = await Promise.all([
        // Query 1: Total Leads
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("institute_id", institute_id),

        // Query 2: Today's Leads
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("institute_id", institute_id).gte("created_at", today),

        // Query 3: Pending Follow-ups
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("institute_id", institute_id).ilike("status", "%follow%"),

        // Query 4: Recent Leads
        supabase.from("leads")
            .select("id, name, phone, status, created_at, interested_course, source, next_followup")
            .eq("institute_id", institute_id)
            .order("created_at", { ascending: false })
            .limit(5),

        // Query 5: Total Students
        supabase.from("students").select("*", { count: "exact", head: true }).eq("institute_id", institute_id)
    ])
    // PARALLEL EXECUTION END

    return {
        user,
        stats: {
            totalLeads: totalLeadsResult.count || 0,
            todayLeads: todayLeadsResult.count || 0,
            pendingFollowups: pendingFollowupsResult.count || 0,
            totalStudents: totalStudentsResult.count || 0,
        },
        recentLeads: recentLeadsResult.data || []
    }
}
