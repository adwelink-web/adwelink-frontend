"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

/**
 * Fetches the institute_id for the current authenticated user.
 * Implements a fallback strategy for single-institute setups.
 */
async function getAuthenticatedInstituteId(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized: Please log in.")

    // 1. Try to find the user in the staff_members table
    const { data: profile } = await supabase
        .from("staff_members")
        .select("institute_id")
        .eq("id", user.id)
        .single()

    if (profile?.institute_id) {
        return profile.institute_id
    }

    // 2. Fallback for single-institute setup
    const { data: institutes } = await supabase
        .from("institutes")
        .select("id")
        .limit(2)

    if (institutes && institutes.length === 1) {
        return institutes[0].id
    }

    throw new Error("Could not identify your institute. Please ensure you are added as a Staff Member.")
}

export async function updateLead(leadId: string, data: any) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from("leads")
        .update(data)
        .eq("id", leadId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/leads")
    return { success: true }
}

export async function createLead(data: any) {
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
