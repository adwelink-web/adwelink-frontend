"use server"

import { createServerClient } from "@/lib/supabase-server"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

export async function getBillingData() {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    // Fetch institute details (subscription info)
    const { data: institute } = await supabase
        .from("institutes")
        .select("id, name, current_plan, subscription_status, message_limit, messages_used, created_at")
        .eq("id", institute_id)
        .single()

    // Fetch payment history
    const { data: payments } = await supabase
        .from("payments")
        .select("*")
        .eq("institute_id", institute_id)
        .order("payment_date", { ascending: false })
        .limit(20)

    return {
        institute,
        payments: payments || []
    }
}
