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

    const navItems = [
        { href: "/super-admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/super-admin/institutes", icon: Building2, label: "Institutes" },
        { href: "/super-admin/leads", icon: Users, label: "All Leads" },
        { href: "/super-admin/inbound", icon: Inbox, label: "Inbound" },
        { href: "/super-admin/onboard", icon: UserPlus, label: "Onboard" },
    ]

    return (
        <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">

            {/* 🌌 Premium Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] bg-purple-900/20 blur-[180px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] bg-indigo-900/15 blur-[150px] rounded-full" />
                <div className="absolute top-[50%] right-[30%] w-[400px] h-[400px] bg-violet-900/10 blur-[120px] rounded-full animate-pulse" />
            </div>

            {/* 🎯 Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0d14]/80 backdrop-blur-2xl border-r border-white/5 z-50 flex flex-col">

                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Crown className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg text-white tracking-tight">Super Admin</span>
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="h-3 w-3 text-purple-400" />
                                <span className="text-[10px] text-purple-400 font-medium uppercase tracking-wider">Adwelink</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-4 space-y-1.5">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                        >
                            <item.icon className="h-5 w-5 group-hover:text-purple-400 transition-colors" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-white/5">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-xs font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">Super Admin</p>
                                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        <Link
                            href="/home"
                            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors text-xs font-medium"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Exit to AMS
                        </Link>
                    </div>
                </div>
            </aside>

            {/* 📄 Main Content */}
            <main className="ml-64 min-h-screen relative z-10">
                {children}
            </main>
        </div>
    )
}
