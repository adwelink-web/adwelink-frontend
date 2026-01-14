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
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans antialiased">

            {/* 🌌 Iconic Premium Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Primary Ambience */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50" />
                {/* Secondary/Cyan Ambience */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full mix-blend-screen opacity-50" />
                {/* Subtle Pulse */}
                <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full animate-pulse opacity-30" />
            </div>

            {/* 🎯 Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-border/40 backdrop-blur-xl z-50 flex flex-col">

                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 ring-1 ring-white/10">
                            <Crown className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-base text-foreground tracking-tight">Super Admin</span>
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="h-2.5 w-2.5 text-primary" />
                                <span className="text-[9px] text-primary font-bold uppercase tracking-widest">Adwelink</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 group relative overflow-hidden"
                        >
                            <item.icon className="h-4.5 w-4.5 group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium">{item.label}</span>
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </Link>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-border/40 bg-black/20">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-xs font-bold ring-1 ring-white/10">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">Super Admin</p>
                                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>
                        <Link
                            href="/home"
                            className="flex items-center justify-center gap-2 w-full py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold uppercase tracking-wide"
                        >
                            <LogOut className="h-3 w-3" />
                            Exit to AMS
                        </Link>
                    </div>
                </div>
            </aside>

            {/* 📄 Main Content */}
            <main className="ml-64 min-h-screen relative z-10 w-[calc(100%-16rem)] flex flex-col">
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    )
}
