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
    const { data: profile, error: profileError } = await supabase
        .from("staff_members")
        .select("institute_id")
        .eq("id", user.id)
        .single()

    if (profile?.institute_id) {
        return profile.institute_id
    }

    // 2. Fallback: If not in staff_members, check if there is only one institute in the system
    // This handles cases where the owner/admin hasn't been added to staff_members yet.
    const { data: institutes, error: instError } = await supabase
        .from("institutes")
        .select("id")
        .limit(2) // We only need to know if there's exactly one

    if (institutes && institutes.length === 1) {
        console.warn(`User ${user.id} not found in staff_members. Falling back to single institute: ${institutes[0].id}`)
        return institutes[0].id
    }

    // 3. Fail if multiple institutes exist and we can't map the user
    console.error("Profile identification failed:", { userId: user.id, profileError, instError })
    throw new Error("Could not identify your institute. Please ensure you are added as a Staff Member.")
}

export async function getCourses() {
    const supabase = await createServerClient()

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

    // Resilient institute identification
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
