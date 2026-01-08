"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

export async function getInstituteSettings() {
    const supabase = await createServerClient()
    const instituteId = await getAuthenticatedInstituteId(supabase)

    const { data, error } = await supabase
        .from("institutes")
        .select("*")
        .eq("id", instituteId)
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function updateInstituteSettings(data: Record<string, unknown>) {
    const supabase = await createServerClient()
    const instituteId = await getAuthenticatedInstituteId(supabase)

    const { error } = await supabase
        .from("institutes")
        .update(data)
        .eq("id", instituteId)

    if (error) throw new Error(error.message)

    revalidatePath("/settings")
    return { success: true }
}
