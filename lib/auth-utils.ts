import { SupabaseClient } from "@supabase/supabase-js"

/**
 * CTO UTILITY: Centralized Authentication & Tenancy Helper
 * 
 * Fetches the institute_id for the current authenticated user from the staff_members table.
 * This is the cornerstone of our "Multi-tenant Defense" strategy.
 */
export async function getAuthenticatedInstituteId(supabase: SupabaseClient): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized Access: User session not found.")

    const { data: profile, error } = await supabase
        .from("staff_members")
        .select("institute_id")
        .eq("id", user.id)
        .single()

    if (error || !profile?.institute_id) {
        // Fallback for system owners / single-tenant setups if profile is missing
        const { data: firstInstitute } = await supabase
            .from("institutes")
            .select("id")
            .limit(1)
            .single()

        if (!firstInstitute?.id) throw new Error("System Error: No valid institute context found.")
        return firstInstitute.id
    }

    return profile.institute_id
}
