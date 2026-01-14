import { createServerClient } from "@/lib/supabase-server"
import { Building2, Users, MessageSquare, IndianRupee, TrendingUp, ArrowUpRight, Clock, Zap } from "lucide-react"
import Link from "next/link"

// Fetch all metrics
async function getMetrics() {
    const supabase = await createServerClient()

    // Get institutes count and data
    const { data: institutes, count: institutesCount } = await supabase
        .from("institutes")
        .select("*", { count: "exact" })

    // Get total leads count
    const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })

    // Get today's leads
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: todayLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString())

    // Calculate total messages used
    const totalMessages = institutes?.reduce((sum, inst) => sum + (inst.messages_used || 0), 0) || 0

    // Get recent leads
    const { data: recentLeads } = await supabase
        .from("leads")
        .select(`
            id,
            name,
            phone,
            status,
            created_at,
            institute_id,
            institutes (name)
        `)
        .order("created_at", { ascending: false })
        .limit(8)

    return {
        institutes: institutes || [],
        institutesCount: institutesCount || 0,
        leadsCount: leadsCount || 0,
        todayLeads: todayLeads || 0,
        totalMessages,
        recentLeads: recentLeads || []
    }
}

export default async function SuperAdminDashboard() {
    const metrics = await getMetrics()

    // Calculate revenue estimates based on plans
    const planPrices: Record<string, number> = {
        trial: 0,
        starter: 7999,
        growth: 14999,
        domination: 29999
    }

    const monthlyRevenue = metrics.institutes.reduce((sum, inst) => {
        const plan = inst.current_plan || "trial"
        return sum + (planPrices[plan] || 0)
    }, 0)

    const stats = [
        {
            label: "Total Institutes",
            value: metrics.institutesCount,
            subtext: "Active clients",
            icon: Building2,
            color: "purple",
            trend: "+2 this week"
        },
        {
            label: "Total Leads",
            value: metrics.leadsCount,
            subtext: `+${metrics.todayLeads} today`,
            icon: Users,
            color: "emerald",
            trend: "Growing"
        },
        {
            label: "Messages Sent",
            value: metrics.totalMessages.toLocaleString(),
            subtext: "Across all institutes",
            icon: MessageSquare,
            color: "blue",
            trend: "Active"
        },
        {
            label: "Monthly Revenue",
            value: `₹${monthlyRevenue.toLocaleString()}`,
            subtext: "From subscriptions",
            icon: IndianRupee,
            color: "amber",
            trend: "Recurring"
        }
    ]

    const colorClasses: Record<string, string> = {
        purple: "from-primary/20 to-primary/5 border-primary/20 text-primary",
        emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
        blue: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
        amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400"
    }

    return (
        <div className="space-y-8 pb-10">

            {/* Sticky Header with Glassmorphism */}
            <div className="sticky top-0 z-40 -mx-8 px-8 py-4 bg-background/60 backdrop-blur-xl border-b border-white/5 flex items-end justify-between transition-all duration-200">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Command Center
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm ml-1">Adwelink Business Overview • Real-time Metrics</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Updated: Just now</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[stat.color]} border p-6 group hover:scale-[1.02] transition-all duration-300 shadow-xl`}
                    >
                        {/* Smooth Glow effect */}
                        <div className={`absolute top-[-50%] right-[-50%] w-48 h-48 bg-${stat.color === 'purple' ? 'primary' : stat.color}-500/20 blur-[60px] rounded-full group-hover:opacity-100 transition-opacity`} />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70">{stat.label}</span>
                                <stat.icon className={`h-5 w-5 ${colorClasses[stat.color].split(' ').pop()}`} />
                            </div>
                            <div className="text-4xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-medium">{stat.subtext}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/5 ${colorClasses[stat.color].split(' ').pop()}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Institutes List */}
                <div className="rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                                <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Active Institutes</h2>
                        </div>
                        <Link href="/super-admin/institutes" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1 rounded-full">
                            View All <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {metrics.institutes.slice(0, 6).map((inst) => (
                            <div key={inst.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/20 transition-all group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-sm font-bold text-slate-400 border border-white/10 group-hover:border-primary/30 transition-colors">
                                        {inst.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm group-hover:text-primary transition-colors">{inst.name}</p>
                                        <p className="text-xs text-slate-500 font-medium">{inst.city || "No city"} • <span className="text-primary font-bold uppercase text-[10px]">{inst.current_plan || "trial"}</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <span className="text-sm font-mono font-bold text-white">{inst.messages_used || 0}</span>
                                        <span className="text-xs text-slate-600">/ {inst.message_limit || 50}</span>
                                    </div>
                                    <div className="w-20 h-1 bg-slate-800 rounded-full mt-1 ml-auto overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(((inst.messages_used || 0) / (inst.message_limit || 50)) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {metrics.institutes.length === 0 && (
                            <div className="text-center py-12">
                                <Building2 className="h-12 w-12 text-slate-800 mx-auto mb-3" />
                                <p className="text-slate-600 text-sm font-medium">No institutes yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Leads */}
                <div className="rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                                <Users className="h-4 w-4 text-emerald-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Recent Leads</h2>
                        </div>
                        <Link href="/super-admin/leads" className="flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-3 py-1 rounded-full">
                            View All <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {metrics.recentLeads.map((lead: any) => {
                            const statusColors: Record<string, string> = {
                                hot: "bg-red-500/10 text-red-400 border-red-500/20 ring-red-500/10",
                                warm: "bg-amber-500/10 text-amber-400 border-amber-500/20 ring-amber-500/10",
                                interested: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/10",
                                fresh: "bg-blue-500/10 text-blue-400 border-blue-500/20 ring-blue-500/10"
                            }
                            const statusClass = statusColors[lead.status?.toLowerCase()] || "bg-slate-500/10 text-slate-400 border-slate-500/20"

                            return (
                                <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-900/40 to-emerald-900/10 flex items-center justify-center text-sm font-bold text-emerald-400 border border-emerald-500/10 ring-1 ring-emerald-500/10">
                                            {(lead.name || "U").charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm group-hover:text-emerald-300 transition-colors">{lead.name || "Unknown"}</p>
                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                <span>{lead.institutes?.name || "Unknown"}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ring-1 ${statusClass}`}>
                                        {lead.status || "new"}
                                    </span>
                                </div>
                            )
                        })}
                        {metrics.recentLeads.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-slate-800 mx-auto mb-3" />
                                <p className="text-slate-600 text-sm font-medium">No leads yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
