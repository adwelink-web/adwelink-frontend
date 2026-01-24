"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"
import { Database } from "@/lib/database.types"

// Use generated types for type safety - Schema IS the Brain (DaaB)
type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"]
type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"]

// For createLead, we omit institute_id as it's auto-injected server-side
export type LeadCreateData = Omit<LeadInsert, "institute_id" | "id" | "created_at" | "updated_at">

export async function updateLead(leadId: string, data: LeadUpdate) {
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
        .insert([{
            ...data,
            institute_id
        }])
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

export async function getLeadsWithAIStats() {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    // Fetch all leads
    const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .eq("institute_id", institute_id)
        .order("created_at", { ascending: false })

    if (leadsError) {
        throw new Error(leadsError.message)
    }

    if (!leads || leads.length === 0) {
        return []
    }

    // Get phone numbers from leads
    const phoneNumbers = leads.map(l => l.phone).filter(Boolean)

    // Fetch AI stats from chat history
    // @ts-ignore - TypeScript types are outdated, phone_number column exists
    const { data: aiStats } = await supabase
        .from("ai_chat_history")
        .select("phone_number, lead_score, admission_chances, created_at")
        .eq("institute_id", institute_id)
        .in("phone_number", phoneNumbers)
        .not("lead_score", "is", null)
        .order("created_at", { ascending: false }) as any

    // Create map of latest AI stats per phone number
    const statsMap = new Map()
    if (aiStats) {
        (aiStats as any[]).forEach((stat: any) => {
            if (!statsMap.has(stat.phone_number)) {
                statsMap.set(stat.phone_number, {
                    lead_score: stat.lead_score,
                    admission_chances: stat.admission_chances
                })
            }
        })
    }

    // Merge AI stats with leads
    const enhancedLeads = leads.map(lead => {
        const aiData = statsMap.get(lead.phone)
        return {
            ...lead,
            lead_score: aiData?.lead_score ?? null,
            admission_chances: aiData?.admission_chances ?? null
        }
    })

    return enhancedLeads
}
