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
            <div className="w-full h-full overflow-hidden p-0 relative">
                {/* Ambient Background Effects - Consistent with Workspace */}
                <div className="fixed top-[-50px] left-[-50px] h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px] pointer-events-none -z-10" />
                <div className="fixed top-[-50px] right-[-50px] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none -z-10" />

                <div className="relative z-0 h-full w-full overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    )
}
