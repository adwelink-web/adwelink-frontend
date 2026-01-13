import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { isSuperAdmin } from "@/lib/super-admin"

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
        <div className="min-h-screen bg-[#030712] text-white">
            {/* Super Admin Header */}
            <header className="fixed top-0 inset-x-0 z-50 h-14 bg-purple-900/20 border-b border-purple-500/20 backdrop-blur-xl flex items-center px-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 text-lg">👑</span>
                    </div>
                    <span className="font-bold text-lg text-white">Super Admin</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">Adwelink</span>
                </div>

                <nav className="ml-12 flex items-center gap-6">
                    <a href="/super-admin" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</a>
                    <a href="/super-admin/institutes" className="text-sm text-slate-400 hover:text-white transition-colors">Institutes</a>
                    <a href="/super-admin/leads" className="text-sm text-slate-400 hover:text-white transition-colors">All Leads</a>
                    <a href="/super-admin/inbound" className="text-sm text-slate-400 hover:text-white transition-colors">Inbound</a>
                    <a href="/super-admin/onboard" className="text-sm text-slate-400 hover:text-white transition-colors">+ Onboard</a>
                </nav>

                <div className="ml-auto flex items-center gap-4">
                    <span className="text-xs text-slate-500">{user.email}</span>
                    <a href="/workspace" className="text-xs text-purple-400 hover:text-purple-300">← Exit to Workspace</a>
                </div>
            </header>

            {/* Content */}
            <main className="pt-14">
                {children}
            </main>
        </div>
    )
}
