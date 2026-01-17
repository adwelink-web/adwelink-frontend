"use server"

import { createServerClient } from "@/lib/supabase-server"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

export async function getLeadById(leadId: string) {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { data: lead, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .eq("institute_id", institute_id)
        .single()

    if (error) {
        return null
    }

    return lead
}

export async function getLeadChatHistory(phone: string) {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { data, error } = await supabase
        .from("ai_chat_history")
        .select("*")
        .eq("phone_number", phone)
        .eq("institute_id", institute_id)
        .order("created_at", { ascending: true })

    if (error) {
        return []
    }

    return data
}
