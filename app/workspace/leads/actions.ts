"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

interface LeadCreateData {
    phone: string
    [key: string]: unknown
}

export async function updateLead(leadId: string, data: Record<string, unknown>) {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { error } = await supabase
        .from("leads")
        .update(data)
        .eq("id", leadId)
        .eq("institute_id", institute_id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/leads")
    return { success: true }
}

export async function createLead(data: LeadCreateData) {
    const supabase = await createServerClient()

    // Resilient identification
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { data: lead, error } = await supabase
        .from("leads")
        .insert({
            ...data,
            institute_id
        })
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/leads")
    return { success: true, data: lead }
}

export async function getLeads() {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("institute_id", institute_id)
        .order("created_at", { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function deleteLead(leadId: string) {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId)
        .eq("institute_id", institute_id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/leads")
    return { success: true }
}
