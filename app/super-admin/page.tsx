import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, MessageSquare, TrendingUp, IndianRupee, Activity } from "lucide-react"
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
        .limit(10)

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

    return (
        <div className="p-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-slate-500 mt-1">Adwelink Business Overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Institutes */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Institutes</CardTitle>
                        <Building2 className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{metrics.institutesCount}</div>
                        <p className="text-xs text-slate-500">Active clients</p>
                    </CardContent>
                </Card>

                {/* Leads */}
                <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Leads</CardTitle>
                        <Users className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{metrics.leadsCount}</div>
                        <p className="text-xs text-emerald-400">+{metrics.todayLeads} today</p>
                    </CardContent>
                </Card>

                {/* Messages */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Messages Sent</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{metrics.totalMessages.toLocaleString()}</div>
                        <p className="text-xs text-slate-500">Across all institutes</p>
                    </CardContent>
                </Card>

                {/* Revenue */}
                <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Monthly Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">₹{monthlyRevenue.toLocaleString()}</div>
                        <p className="text-xs text-slate-500">Estimated from plans</p>
                    </CardContent>
                </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Institutes List */}
                <Card className="border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Institutes</CardTitle>
                        <Link href="/super-admin/institutes" className="text-xs text-purple-400 hover:text-purple-300">View All →</Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {metrics.institutes.slice(0, 5).map((inst) => (
                                <div key={inst.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div>
                                        <p className="font-medium text-white">{inst.name}</p>
                                        <p className="text-xs text-slate-500">{inst.city || "No city"} • {inst.current_plan || "trial"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-mono text-slate-400">{inst.messages_used || 0}/{inst.message_limit || 50}</p>
                                        <p className="text-[10px] text-slate-600">messages</p>
                                    </div>
                                </div>
                            ))}
                            {metrics.institutes.length === 0 && (
                                <p className="text-slate-500 text-center py-8">No institutes yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card className="border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Recent Leads</CardTitle>
                        <Link href="/super-admin/leads" className="text-xs text-purple-400 hover:text-purple-300">View All →</Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {metrics.recentLeads.map((lead: any) => (
                                <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div>
                                        <p className="font-medium text-white">{lead.name || "Unknown"}</p>
                                        <p className="text-xs text-slate-500">{lead.phone} • {lead.institutes?.name || "Unknown Institute"}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${lead.status === "hot" ? "bg-red-500/20 text-red-400" :
                                            lead.status === "warm" ? "bg-amber-500/20 text-amber-400" :
                                                "bg-slate-500/20 text-slate-400"
                                            }`}>
                                            {lead.status || "new"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {metrics.recentLeads.length === 0 && (
                                <p className="text-slate-500 text-center py-8">No leads yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
