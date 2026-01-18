import { createAdminClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    MessageSquare,
    IndianRupee,
    Building2,
    Zap,
    Target,
    ArrowUpRight
} from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Plan prices for revenue calculation
const PLAN_PRICES: Record<string, number> = {
    trial: 0,
    starter: 7999,
    growth: 14999,
    domination: 29999
}

async function getAnalyticsData() {
    const supabase = createAdminClient()

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Parallel queries for performance
    const [
        institutesResult,
        totalLeadsResult,
        thisMonthLeadsResult,
        lastMonthLeadsResult,
        todayLeadsResult,
        hotLeadsResult,
        convertedLeadsResult,
        chatHistoryResult,
        topInstitutesResult
    ] = await Promise.all([
        // All institutes with their data
        supabase.from("institutes").select("*"),

        // Total leads ever
        supabase.from("leads").select("*", { count: "exact", head: true }),

        // This month's leads
        supabase.from("leads")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfMonth.toISOString()),

        // Last month's leads
        supabase.from("leads")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfLastMonth.toISOString())
            .lte("created_at", endOfLastMonth.toISOString()),

        // Today's leads
        supabase.from("leads")
            .select("*", { count: "exact", head: true })
            .gte("created_at", today.toISOString()),

        // Hot leads
        supabase.from("leads")
            .select("*", { count: "exact", head: true })
            .ilike("status", "%hot%"),

        // Converted leads
        supabase.from("leads")
            .select("*", { count: "exact", head: true })
            .or("status.ilike.%converted%,status.ilike.%enrolled%"),

        // Chat history count (messages)
        supabase.from("ai_chat_history")
            .select("*", { count: "exact", head: true }),

        // Top institutes by leads
        supabase.from("leads")
            .select("institute_id, institutes(name)")
    ])

    const institutes = institutesResult.data || []

    // Calculate MRR
    const mrr = institutes.reduce((sum, inst) => {
        const plan = inst.current_plan || "trial"
        return sum + (PLAN_PRICES[plan] || 0)
    }, 0)

    // Calculate total messages used
    const totalMessagesUsed = institutes.reduce((sum, inst) => sum + (inst.messages_used || 0), 0)

    // Calculate lead growth percentage
    const thisMonthLeads = thisMonthLeadsResult.count || 0
    const lastMonthLeads = lastMonthLeadsResult.count || 0
    const leadGrowth = lastMonthLeads > 0
        ? Math.round(((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100)
        : thisMonthLeads > 0 ? 100 : 0

    // Group leads by institute for top performers
    const leadsData = topInstitutesResult.data || []
    const instituteLeadCounts: Record<string, { name: string; count: number }> = {}

    leadsData.forEach((lead: any) => {
        const instId = lead.institute_id
        if (instId) {
            if (!instituteLeadCounts[instId]) {
                instituteLeadCounts[instId] = {
                    name: lead.institutes?.name || "Unknown",
                    count: 0
                }
            }
            instituteLeadCounts[instId].count++
        }
    })

    const topInstitutes = Object.entries(instituteLeadCounts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([id, data]) => ({ id, ...data }))

    // Conversion rate
    const totalLeads = totalLeadsResult.count || 0
    const convertedLeads = convertedLeadsResult.count || 0
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0

    return {
        // Core metrics
        totalInstitutes: institutes.length,
        activeInstitutes: institutes.filter(i => (i.messages_used || 0) > 0).length,
        totalLeads,
        thisMonthLeads,
        todayLeads: todayLeadsResult.count || 0,
        leadGrowth,
        hotLeads: hotLeadsResult.count || 0,
        convertedLeads,
        conversionRate,

        // Messages
        totalMessagesUsed,
        totalConversations: chatHistoryResult.count || 0,

        // Revenue
        mrr,
        planDistribution: {
            trial: institutes.filter(i => (i.current_plan || "trial") === "trial").length,
            starter: institutes.filter(i => i.current_plan === "starter").length,
            growth: institutes.filter(i => i.current_plan === "growth").length,
            domination: institutes.filter(i => i.current_plan === "domination").length,
        },

        // Top performers
        topInstitutes,
        institutes
    }
}

export default async function AnalyticsPage() {
    const data = await getAnalyticsData()

    const mainStats = [
        {
            label: "Total Leads",
            value: data.totalLeads.toLocaleString(),
            subtext: `+${data.todayLeads} today`,
            icon: Users,
            color: "violet",
            trend: data.leadGrowth >= 0 ? `+${data.leadGrowth}%` : `${data.leadGrowth}%`,
            trendUp: data.leadGrowth >= 0
        },
        {
            label: "This Month",
            value: data.thisMonthLeads.toLocaleString(),
            subtext: "New leads",
            icon: Target,
            color: "emerald",
            trend: data.leadGrowth >= 0 ? "Growing" : "Declining",
            trendUp: data.leadGrowth >= 0
        },
        {
            label: "Conversion Rate",
            value: `${data.conversionRate}%`,
            subtext: `${data.convertedLeads} converted`,
            icon: TrendingUp,
            color: "cyan",
            trend: data.conversionRate >= 10 ? "Healthy" : "Needs work",
            trendUp: data.conversionRate >= 10
        },
        {
            label: "Monthly Revenue",
            value: `₹${data.mrr.toLocaleString()}`,
            subtext: "MRR",
            icon: IndianRupee,
            color: "amber",
            trend: "Recurring",
            trendUp: true
        }
    ]

    const colorClasses: Record<string, { gradient: string; icon: string; border: string }> = {
        violet: { gradient: "from-violet-500/10 to-transparent", icon: "text-violet-500", border: "border-violet-500/20" },
        emerald: { gradient: "from-emerald-500/10 to-transparent", icon: "text-emerald-500", border: "border-emerald-500/20" },
        cyan: { gradient: "from-cyan-500/10 to-transparent", icon: "text-cyan-500", border: "border-cyan-500/20" },
        amber: { gradient: "from-amber-500/10 to-transparent", icon: "text-amber-500", border: "border-amber-500/20" }
    }

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                {/* Header */}
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#0B0F19]/80 px-4 md:px-8 py-4 mb-2">
                    <WorkspaceHeader
                        title="Analytics Dashboard"
                        subtitle="Business performance metrics & insights"
                        icon={BarChart3}
                        iconColor="text-cyan-500"
                        className="max-w-7xl mx-auto"
                        badge={
                            <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                </span>
                                <span className="text-emerald-400">Live</span>
                            </span>
                        }
                    />
                </div>

                {/* Content */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {mainStats.map((stat, i) => (
                            <Card
                                key={i}
                                className={`bg-gradient-to-br ${colorClasses[stat.color].gradient} border-white/10 backdrop-blur-md shadow-lg ${colorClasses[stat.color].border} hover:scale-[1.02] transition-all`}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-200">{stat.label}</CardTitle>
                                    <stat.icon className={`h-4 w-4 ${colorClasses[stat.color].icon}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className={`text-[10px] uppercase px-1.5 h-5 ${stat.trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {stat.trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                            {stat.trend}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                        <Building2 className="h-5 w-5 text-violet-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{data.totalInstitutes}</p>
                                        <p className="text-xs text-muted-foreground">Total Clients</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{data.activeInstitutes}</p>
                                        <p className="text-xs text-muted-foreground">Active Clients</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                        <MessageSquare className="h-5 w-5 text-cyan-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{data.totalMessagesUsed.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Messages Sent</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                        <Target className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{data.hotLeads}</p>
                                        <p className="text-xs text-muted-foreground">Hot Leads</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Plan Distribution */}
                        <Card className="bg-gradient-to-br from-violet-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4 text-violet-500" />
                                    Plan Distribution
                                </CardTitle>
                                <CardDescription>Client breakdown by subscription tier</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { name: "Trial", count: data.planDistribution.trial, price: "₹0", color: "slate" },
                                    { name: "Starter", count: data.planDistribution.starter, price: "₹7,999", color: "cyan" },
                                    { name: "Growth", count: data.planDistribution.growth, price: "₹14,999", color: "emerald" },
                                    { name: "Domination", count: data.planDistribution.domination, price: "₹29,999", color: "violet" }
                                ].map((plan) => (
                                    <div key={plan.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-3 w-3 rounded-full bg-${plan.color}-500`}></div>
                                            <div>
                                                <p className="text-white font-medium">{plan.name}</p>
                                                <p className="text-xs text-muted-foreground">{plan.price}/mo</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-white">{plan.count}</p>
                                            <p className="text-xs text-muted-foreground">clients</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Top Performing Institutes */}
                        <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    Top Performing Clients
                                </CardTitle>
                                <CardDescription>Ranked by total leads generated</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 flex flex-col relative">
                                {/* Fixed Header */}
                                <div className="flex-none -mt-4 z-20 mx-6 mb-2">
                                    <div className="grid grid-cols-12 px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <div className="col-span-2 pl-6">Rank</div>
                                        <div className="col-span-7">Institute</div>
                                        <div className="col-span-3 text-right pr-6">Leads</div>
                                    </div>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-2 space-y-1 max-h-[350px]">
                                    {data.topInstitutes.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground text-sm">
                                            No data yet
                                        </div>
                                    ) : (
                                        data.topInstitutes.map((inst, i) => (
                                            <div key={inst.id} className="grid grid-cols-12 items-center p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                                <div className="col-span-2 pl-6">
                                                    <Badge variant={i === 0 ? "default" : "secondary"} className="text-[10px] h-5 px-1.5">
                                                        #{i + 1}
                                                    </Badge>
                                                </div>
                                                <div className="col-span-7 font-medium text-white text-sm">
                                                    {inst.name}
                                                </div>
                                                <div className="col-span-3 text-right pr-6 font-bold text-emerald-400 text-sm">
                                                    {inst.count}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
