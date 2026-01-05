"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

/**
 * Fetches the institute_id for the current authenticated user.
 */
async function getAuthenticatedInstituteId(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized: Please log in.")

    const { data: profile, error } = await supabase
        .from("staff_members")
        .select("institute_id")
        .eq("id", user.id)
        .single()

    if (error || !profile?.institute_id) {
        throw new Error("Could not identify your institute. Please contact support.")
    }

    return profile.institute_id
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

    // Proactively fetch institute_id
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
