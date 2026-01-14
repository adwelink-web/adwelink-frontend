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
        purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
        emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
        blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
        amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400"
    }

    return (
        <div className="p-8 space-y-8">

            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Command Center
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm">Adwelink Business Overview • Real-time Metrics</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Last updated: Just now</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[stat.color]} border p-6 group hover:scale-[1.02] transition-all duration-300`}
                    >
                        {/* Glow effect */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 blur-3xl rounded-full`} />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-400">{stat.label}</span>
                                <stat.icon className={`h-5 w-5 ${colorClasses[stat.color].split(' ').pop()}`} />
                            </div>
                            <div className="text-4xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">{stat.subtext}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${colorClasses[stat.color].split(' ').pop()}`}>
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
                <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-purple-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Institutes</h2>
                        </div>
                        <Link href="/super-admin/institutes" className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                            View All <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {metrics.institutes.slice(0, 6).map((inst) => (
                            <div key={inst.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-sm font-bold text-slate-400 border border-white/5">
                                        {inst.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white group-hover:text-purple-300 transition-colors">{inst.name}</p>
                                        <p className="text-xs text-slate-500">{inst.city || "No city"} • <span className="text-purple-400">{inst.current_plan || "trial"}</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono text-slate-300">{inst.messages_used || 0}<span className="text-slate-600">/{inst.message_limit || 50}</span></p>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">messages</p>
                                </div>
                            </div>
                        ))}
                        {metrics.institutes.length === 0 && (
                            <div className="text-center py-12">
                                <Building2 className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">No institutes yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Leads */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-emerald-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Recent Leads</h2>
                        </div>
                        <Link href="/super-admin/leads" className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                            View All <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {metrics.recentLeads.map((lead: any) => {
                            const statusColors: Record<string, string> = {
                                hot: "bg-red-500/20 text-red-400 border-red-500/20",
                                warm: "bg-amber-500/20 text-amber-400 border-amber-500/20",
                                interested: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
                                fresh: "bg-blue-500/20 text-blue-400 border-blue-500/20"
                            }
                            const statusClass = statusColors[lead.status] || "bg-slate-500/20 text-slate-400 border-slate-500/20"

                            return (
                                <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-900/50 to-emerald-900/20 flex items-center justify-center text-sm font-bold text-emerald-400 border border-emerald-500/10">
                                            {(lead.name || "U").charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white group-hover:text-emerald-300 transition-colors">{lead.name || "Unknown"}</p>
                                            <p className="text-xs text-slate-500">{lead.phone} • {lead.institutes?.name || "Unknown"}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusClass}`}>
                                        {lead.status || "new"}
                                    </span>
                                </div>
                            )
                        })}
                        {metrics.recentLeads.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">No leads yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
