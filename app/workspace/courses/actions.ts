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
        console.error("Profile lookup error:", error)
        throw new Error("Could not identify your institute. Please contact support.")
    }

    return profile.institute_id
}

export async function getCourses() {
    const supabase = await createServerClient()

    // RLS handles filtering, but we could explicitly filter by institute_id here too
    const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("name", { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function createCourse(data: any) {
    const supabase = await createServerClient()

    // Auto-fetch institute_id to ensure data integrity
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { data: course, error } = await supabase
        .from("courses")
        .insert({
            ...data,
            institute_id
        })
        .select()
        .single()

    if (error) {
        console.error("Create course error:", error)
        throw new Error(error.message)
    }

    revalidatePath("/workspace/courses")
    return { success: true, data: course }
}

export async function updateCourse(courseId: string, data: any) {
    const supabase = await createServerClient()

    // We don't necessarily need to reinject institute_id on update 
    // as it should already be tied to the record.
    const { error } = await supabase
        .from("courses")
        .update(data)
        .eq("id", courseId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/courses")
    return { success: true }
}

export async function deleteCourse(courseId: string) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/courses")
    return { success: true }
}
