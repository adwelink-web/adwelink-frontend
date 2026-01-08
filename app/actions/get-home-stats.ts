"use server"

import { createServerClient } from "@/lib/supabase-server"

export async function getHomeStats() {
    try {
        const supabase = await createServerClient()

        // Execute queries in parallel for maximum speed
        const [leadsRes, studentsRes, revenueRes, activityRes] = await Promise.all([
            // 1. Total Leads
            supabase.from('leads').select('*', { count: 'exact', head: true }),

            // 2. Total Students
            supabase.from('students').select('*', { count: 'exact', head: true }),

            // 3. Revenue (Get all payments to sum up) - TODO: Optimize with a DB function later for large datasets
            supabase.from('fee_payments').select('amount_paid'),

            // 4. Activity Feed (Latest 3)
            supabase.from('ai_chat_history')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3)
        ])

        // Process Results
        const totalLeads = leadsRes.count || 0
        const totalStudents = studentsRes.count || 0

        // Calculate Revenue
        const totalRevenue = revenueRes.data?.reduce((sum, record) => sum + (record.amount_paid || 0), 0) || 0

        // Format Revenue (e.g., 1.5L, 15k)
        const formatMoney = (amount: number) => {
            if (amount >= 100000) return (amount / 100000).toFixed(1) + "L"
            if (amount >= 1000) return (amount / 1000).toFixed(1) + "k"
            return amount.toString()
        }

        // Process Activity Feed
        const activityFeed = activityRes.data?.map(item => ({
            type: item.sentiment === 'positive' ? 'success' : item.sentiment === 'negative' ? 'error' : 'info',
            text: `${item.intent || 'Message'} from ${item.phone_number?.slice(-4) || 'User'}`, // Privacy masking
            time: new Date(item.created_at!).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            created_at: item.created_at || undefined
        })) || []

        // If feed is empty, show system status
        if (activityFeed.length === 0) {
            activityFeed.push({
                type: 'info',
                text: 'System Initialized. Waiting for traffic...',
                time: 'Now',
                created_at: new Date().toISOString()
            })
        }

        return {
            leads: { value: totalLeads.toLocaleString(), change: "+Live" }, // Change % placeholder
            students: { value: totalStudents.toLocaleString(), change: "+Live" },
            revenue: { value: formatMoney(totalRevenue), raw: totalRevenue },
            activityFeed,
            userName: "Director", // Can fetch real user name if passed context
            businessName: "Adwelink Institute"
        }

    } catch (error) {
        console.error("GHS_ERR: Failed to fetch home stats", error)
        // Fallback to prevent crash
        return {
            leads: { value: "-", change: "Err" },
            students: { value: "-", change: "Err" },
            revenue: { value: "-", raw: 0 },
            activityFeed: [{ type: 'error', text: 'Database Connection Failed', time: 'Now' }],
            userName: "Director",
            businessName: "Adwelink Institute"
        }
    }
}
