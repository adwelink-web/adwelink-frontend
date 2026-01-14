import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { isSuperAdmin } from "@/lib/super-admin"
import Link from "next/link"
import { LayoutDashboard, Building2, Users, Inbox, UserPlus, LogOut, Crown, Sparkles } from "lucide-react"

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Not logged in -> redirect to login
    if (!user) {
        redirect("/login")
    }

    // Not a super admin -> redirect to workspace
    if (!isSuperAdmin(user.email)) {
        redirect("/workspace")
    }

    return (
        <>
            {/* 
                Sidebar and Layout Shell are now handled by the global SidebarWrapper 
                and AppSidebar component, ensuring exact visual consistency.
                
                This file now acts only as a Security Barrier (Auth Guard).
            */}
            <div className="w-full h-full overflow-y-auto custom-scrollbar p-0">
                {children}
            </div>
        </>
    )
}
