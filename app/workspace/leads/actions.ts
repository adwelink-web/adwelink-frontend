"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

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

    const { data: lead, error } = await supabase
        .from("leads")
        .insert(data)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/leads")
    return { success: true, data: lead }
}
