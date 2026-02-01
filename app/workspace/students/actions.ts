"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { getAuthenticatedInstituteId } from "@/lib/auth-utils"

export async function getStudents() {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { data, error } = await supabase
        .from("students")
        .select('*')
        .eq("institute_id", institute_id)
        .order("name", { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function deleteStudent(studentId: string) {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId)
        .eq("institute_id", institute_id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/students")
    return { success: true }
}

export async function updateStudent(studentId: string, data: Record<string, unknown>) {
    const supabase = await createServerClient()
    const institute_id = await getAuthenticatedInstituteId(supabase)

    const { error } = await supabase
        .from("students")
        .update(data)
        .eq("id", studentId)
        .eq("institute_id", institute_id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/workspace/students")
    return { success: true }
}
