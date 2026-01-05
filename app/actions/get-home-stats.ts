import { createServerClient } from "@/lib/supabase-server"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

export async function getHomeStats() {
    try {
        const supabase = await createServerClient()
        const institute_id = await getAuthenticatedInstituteId(supabase)

        // Parallel Execution for Performance
        const [
            leadsResult,
            studentsResult,
            userResult,
            recentLeadsResult,
            recentPaymentsResult
        ] = await Promise.all([
            // 0. Total Leads
            supabase.from("leads").select("*", { count: "exact", head: true }).eq("institute_id", institute_id),

            // 1. Total Students
            supabase.from("students").select("*", { count: "exact", head: true }).eq("institute_id", institute_id),

            // 2. User for Greeting
            supabase.auth.getUser(),

            // 3. Recent Leads for Activity Feed
            supabase.from("leads")
                .select("name, created_at, status")
                .eq("institute_id", institute_id)
                .order("created_at", { ascending: false })
                .limit(3),

            // 4. Recent Payments for Activity Feed (Keeping for Activity Log Proof)
            supabase.from("fee_payments")
                .select("amount_paid, created_at, student_id")
                .eq("institute_id", institute_id)
                .order("created_at", { ascending: false })
                .limit(3)
        ])

        // Calculate Totals
        const totalLeads = leadsResult.count || 0
        const totalStudents = studentsResult.count || 0

        // Format Currency Helper
        const formatCurrency = (amount: number) => {
            if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
            if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`
            return `₹${amount}`
        }

        // Process Activity Feed
        const activeLeads = (recentLeadsResult.data || []).map((l: any) => ({
            type: 'success',
            text: `New Lead: ${l.name} (${l.status})`,
            created_at: l.created_at
        }))

        const activePayments = (recentPaymentsResult.data || []).map((p: any) => ({
            type: 'info',
            text: `Fee Received: ${formatCurrency(p.amount_paid)}`,
            created_at: p.created_at
        }))

        // Combine and Sort by Date
        const activities = [...activeLeads, ...activePayments]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 4)
            .map(a => ({
                ...a,
                time: new Date(a.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            }))

        if (activities.length === 0) {
            activities.push({ type: 'warning', text: 'Waiting for activity...', time: 'Now', created_at: new Date().toISOString() })
        }

        // Calculate Growth Logic
        const now = new Date()
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

        const [thisMonthLeads, lastMonthLeads, thisMonthStudents, lastMonthStudents] = await Promise.all([
            supabase.from("leads").select("*", { count: "exact", head: true }).eq("institute_id", institute_id).gte("created_at", firstDayThisMonth),
            supabase.from("leads").select("*", { count: "exact", head: true }).eq("institute_id", institute_id).gte("created_at", firstDayLastMonth).lt("created_at", firstDayThisMonth),
            supabase.from("students").select("*", { count: "exact", head: true }).eq("institute_id", institute_id).gte("created_at", firstDayThisMonth),
            supabase.from("students").select("*", { count: "exact", head: true }).eq("institute_id", institute_id).gte("created_at", firstDayLastMonth).lt("created_at", firstDayThisMonth)
        ])

        const calculateChange = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? `+${current}` : "0"
            const change = ((current - previous) / previous) * 100
            return `${change >= 0 ? '+' : ''}${Math.round(change)}%`
        }

        const leadsChange = calculateChange(thisMonthLeads.count || 0, lastMonthLeads.count || 0)
        const studentsChange = calculateChange(thisMonthStudents.count || 0, lastMonthStudents.count || 0)

        const user = userResult.data?.user
        const metadata = user?.user_metadata || {}

        return {
            leads: { value: totalLeads.toLocaleString(), change: leadsChange },
            students: { value: totalStudents.toLocaleString(), change: studentsChange },
            activityFeed: activities,
            userName: metadata.full_name || metadata.name || "Chief",
            businessName: metadata.business_name || "Institute"
        }
    } catch (error) {
        console.error("Error in getHomeStats:", error)
        // Return fallback data instead of crashing
        return {
            leads: { value: "0", change: "0" },
            students: { value: "0", change: "0" },
            activityFeed: [{ type: 'warning', text: 'Failed to load stats. Please refresh.', time: 'Now', created_at: new Date().toISOString() }],
            userName: "Chief",
            businessName: "Institute"
        }
    }
}
