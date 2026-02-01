"use server"

import { createServerClient } from "@/lib/supabase-server"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

export async function getScheduledVisits() {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    // Get leads with scheduled visits (today and future)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
        .from("leads")
        .select("id, name, phone, visit_date, interested_course, current_class, status")
        .eq("institute_id", institute_id)
        .not("visit_date", "is", null)
        .gte("visit_date", today.toISOString())
        .order("visit_date", { ascending: true })
        .limit(20)

    if (error) {
        console.error("Error fetching visits:", error)
        return []
    }

    return data || []
}

export async function getVisitStats() {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    // Calculate conversion rate from visits
    const { count: totalVisits } = await supabase
        .from("leads")
        .select("*", { count: 'exact', head: true })
        .eq("institute_id", institute_id)
        .not("visit_date", "is", null)

    const { count: convertedVisits } = await supabase
        .from("leads")
        .select("*", { count: 'exact', head: true })
        .eq("institute_id", institute_id)
        .not("visit_date", "is", null)
        .eq("status", "converted")

    const conversionRate = totalVisits && totalVisits > 0
        ? Math.round((convertedVisits || 0) / totalVisits * 100)
        : 0

    return {
        conversionRate,
        totalVisits: totalVisits || 0,
        convertedVisits: convertedVisits || 0
    }
}
