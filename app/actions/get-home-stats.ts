"use server"

import { createServerClient } from "@/lib/supabase-server"

export async function getHomeStats() {
    const supabase = await createServerClient()

    // Parallel Execution for Performance
    const [
        leadsResult,
        studentsResult,
        userResult,
        recentLeadsResult,
        recentPaymentsResult
    ] = await Promise.all([
        // 0. Total Leads
        supabase.from("leads").select("*", { count: "exact", head: true }),

        // 1. Total Students
        supabase.from("students").select("*", { count: "exact", head: true }),

        // 2. User for Greeting
        supabase.auth.getUser(),

        // 3. Recent Leads for Activity Feed
        supabase.from("leads").select("name, created_at, status").order("created_at", { ascending: false }).limit(3),

        // 4. Recent Payments for Activity Feed (Keeping for Activity Log Proof)
        supabase.from("fee_payments").select("amount_paid, created_at, student_id").order("created_at", { ascending: false }).limit(3)
    ])

    // Calculate Totals
    const totalLeads = leadsResult.count || 0
    const totalStudents = studentsResult.count || 0

    // Format Currency Helper (Still needed for Feed)
    const formatCurrency = (amount: number) => {
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`
        return `₹${amount}`
    }

    // Process Activity Feed (Merge Leads & Payments)
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
        .slice(0, 4) // Keep top 4
        .map(a => ({
            ...a,
            time: new Date(a.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }))

    // Fallback if empty
    if (activities.length === 0) {
        activities.push({ type: 'warning', text: 'System Initialized. Waiting for activity...', time: 'Now', created_at: new Date().toISOString() })
    }

    return {
        leads: { value: totalLeads.toLocaleString(), change: "+12%" }, // Change is dummy for now
        students: { value: totalStudents.toLocaleString(), change: "+5" },
        // Revenue & Pending Fees REMOVED for MVP
        activityFeed: activities,
        userName: userResult.data.user?.user_metadata?.full_name || "Chief",
        businessName: userResult.data.user?.user_metadata?.business_name || "Institute"
    }
}
