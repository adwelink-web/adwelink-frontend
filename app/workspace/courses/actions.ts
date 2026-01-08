"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

interface CourseCreateData {
    name: string
    [key: string]: unknown
}

export async function getCourses() {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("institute_id", institute_id)
        .order("name", { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function createCourse(data: CourseCreateData) {
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

export async function updateCourse(courseId: string, data: Record<string, unknown>) {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { error } = await supabase
        .from("courses")
        .update(data)
        .eq("id", courseId)
        .eq("institute_id", institute_id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/courses")
    return { success: true }
}

export async function deleteCourse(courseId: string) {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId)
        .eq("institute_id", institute_id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/courses")
    return { success: true }
}
