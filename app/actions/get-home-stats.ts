"use server"

import { createServerClient } from "@/lib/supabase-server"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

export async function getHomeStats() {
    try {
        const supabase = await createServerClient()
        const institute_id = await getAuthenticatedInstituteId(supabase)

        // Execute queries in parallel for maximum speed - FILTERED BY INSTITUTE
        const [leadsRes, chatsRes, activityRes] = await Promise.all([
            // 1. Total Leads
            supabase.from('leads').select('*', { count: 'exact', head: true }).eq("institute_id", institute_id),

            // 2. Total Chats Handled by Aditi (count from ai_chat_history)
            supabase.from('ai_chat_history').select('*', { count: 'exact', head: true }).eq("institute_id", institute_id),

            // 3. Activity Feed (Filtered)
            supabase.from('ai_chat_history')
                .select('*')
                .eq("institute_id", institute_id)
                .order('created_at', { ascending: false })
                .limit(3)
        ])

        // Process Results
        const totalLeads = leadsRes.count || 0
        const totalChats = chatsRes.count || 0

        // Process Activity Feed
        // Process Activity Feed
        const activityFeed = activityRes.data?.map(item => {
            const isPositive = ['enrollment', 'confirmed', 'interested'].some(i => item.intent_detected?.toLowerCase().includes(i));
            const isNegative = ['spam', 'stop', 'unsubscribe'].some(i => item.intent_detected?.toLowerCase().includes(i));

            return {
                type: isPositive ? 'success' : isNegative ? 'error' : 'info',
                text: `${item.intent_detected || 'Message'} from ${item.phone_number?.slice(-4) || 'User'}`, // Privacy masking
                time: new Date(item.created_at!).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                created_at: item.created_at || undefined
            }
        }) || []

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
            leads: { value: totalLeads.toLocaleString(), change: "+Live" },
            chatsHandled: { value: totalChats.toLocaleString(), count: totalChats },
            activityFeed,
            userName: "Director",
            businessName: "Adwelink Institute"
        }

    } catch (error) {
        console.error("GHS_ERR: Failed to fetch home stats", error)
        // Fallback to prevent crash
        return {
            leads: { value: "-", change: "Err" },
            chatsHandled: { value: "-", count: 0 },
            activityFeed: [{ type: 'error', text: 'Database Connection Failed', time: 'Now' }],
            userName: "Director",
            businessName: "Adwelink Institute"
        }
    }
}
