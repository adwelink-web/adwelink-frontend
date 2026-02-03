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
    starter: 9999,
    growth: 14999,
    pro: 29999
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
        let plan = inst.current_plan || "trial"
        if (plan === "domination") plan = "pro"
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
            starter: institutes.filter(i => i.current_plan === "starter").length,
            growth: institutes.filter(i => i.current_plan === "growth").length,
            pro: institutes.filter(i => i.current_plan === "pro" || i.current_plan === "domination").length,
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
        violet: {
            gradient: "from-violet-500/10 to-transparent",
            icon: "text-violet-500",
            border: "border-violet-500/20"
        },
        emerald: {
            gradient: "from-emerald-500/10 to-transparent",
            icon: "text-emerald-500",
            border: "border-emerald-500/20"
        },
        cyan: {
            gradient: "from-cyan-500/10 to-transparent",
            icon: "text-cyan-500",
            border: "border-cyan-500/20"
        },
        amber: {
            gradient: "from-amber-500/10 to-transparent",
            icon: "text-amber-500",
            border: "border-amber-500/20"
        }
    }

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative uppercase-none">
            {/* Header Section - Fixed (Non-scrollable) */}
            <div className="flex-none pt-4 px-3 md:px-8 pb-2">
                <WorkspaceHeader
                    title="Analytics Dashboard"
                    subtitle="Business performance metrics & insights"
                    icon={BarChart3}
                    iconColor="text-primary"
                    className="max-w-7xl mx-auto"
                    badge={
                        <span className="flex items-center space-x-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-normal whitespace-nowrap">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            </span>
                            <span className="text-muted-foreground">Live</span>
                        </span>
                    }
                />
            </div>

            {/* Main Content Area - Fixed layout with internal scrolls */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col px-3 md:px-8 pt-6 pb-4 max-w-7xl mx-auto w-full space-y-4">
                {/* 1. Primary Stats - Fixed */}
                <div className="flex-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mainStats.map((stat, i) => (
                        <Card
                            key={i}
                            className={`bg-gradient-to-br ${colorClasses[stat.color].gradient} ${colorClasses[stat.color].border} backdrop-blur-md shadow-lg hover:scale-[1.02] transition-all bg-card/50`}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                <CardTitle className="text-[11px] font-medium text-foreground/80 lowercase">{stat.label}</CardTitle>
                                <stat.icon className={`h-3 w-3 ${colorClasses[stat.color].icon}`} />
                            </CardHeader>
                            <CardContent className="pb-3 pt-0 px-4">
                                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant="secondary" className={`text-[9px] uppercase px-1 h-4 ${stat.trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} border border-transparent`}>
                                        {stat.trend}
                                    </Badge>
                                    <p className="text-[10px] text-muted-foreground whitespace-nowrap">{stat.subtext}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* 2. Secondary Stats - Fixed */}
                <div className="flex-none grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total Clients", value: data.totalInstitutes, icon: Building2, color: "violet" },
                        { label: "Active Clients", value: data.activeInstitutes, icon: Zap, color: "emerald" },
                        { label: "Messages Sent", value: data.totalMessagesUsed.toLocaleString(), icon: MessageSquare, color: "cyan" },
                        { label: "Hot Leads", value: data.hotLeads, icon: Target, color: "amber" }
                    ].map((stat, i) => (
                        <Card key={i} className={`bg-gradient-to-br ${colorClasses[stat.color].gradient.replace('10', '5')} ${colorClasses[stat.color].border.replace('border-', 'border-opacity-10 ')} bg-card/50`}>
                            <CardContent className="pt-4 pb-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-lg ${colorClasses[stat.color].icon.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
                                        <stat.icon className={`h-4 w-4 ${colorClasses[stat.color].icon}`} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* 3. Deep Insights - Side-by-Side Horizontal Scroll Rows */}
                <div className="flex-none grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 pb-20 md:pb-2">
                    {/* Plan Distribution */}
                    <div className="min-w-0 flex flex-col space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <IndianRupee className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground">Subscriptions</h3>
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold px-1.5 h-4">Plans</Badge>
                            </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-3 snap-x snap-mandatory touch-pan-x -mx-1 px-1">
                            {[
                                { name: "Starter", limit: "500 Leads", count: data.planDistribution.starter, price: "₹9,999" },
                                { name: "Growth", limit: "1,000 Leads", count: data.planDistribution.growth, price: "₹14,999" },
                                { name: "Pro", limit: "3,000 Leads", count: data.planDistribution.pro, price: "₹29,999" }
                            ].map((plan) => (
                                <Card key={plan.name} className="flex-none w-full snap-start bg-gradient-to-br from-primary/10 to-transparent border-white/10 backdrop-blur-md shadow-lg bg-card/50 overflow-hidden group">
                                    <CardContent className="p-4 flex flex-col justify-between h-32">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{plan.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <p className="text-[10px] text-muted-foreground">{plan.price}/mo</p>
                                                    <span className="text-[10px] text-primary/40">•</span>
                                                    <p className="text-[10px] font-bold text-emerald-500/80">{plan.limit}</p>
                                                </div>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <IndianRupee className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                        <div className="mt-auto flex items-end justify-between">
                                            <p className="text-3xl font-black text-foreground">{plan.count}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Active Users</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Top Performing Clients */}
                    <div className="min-w-0 flex flex-col space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground">Top Performing</h3>
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold px-1.5 h-4">Clients</Badge>
                            </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-3 snap-x snap-mandatory touch-pan-x -mx-1 px-1">
                            {data.topInstitutes.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground text-xs font-medium w-full bg-muted/20 rounded-xl border border-dashed border-border h-32 flex items-center justify-center">
                                    No data available
                                </div>
                            ) : (
                                data.topInstitutes.map((inst, i) => (
                                    <Card key={inst.id} className="flex-none w-full snap-start bg-gradient-to-br from-emerald-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-emerald-500/20 bg-card/50 overflow-hidden group">
                                        <CardContent className="p-4 relative h-32 flex flex-col justify-between">
                                            <div className="absolute top-3 right-3">
                                                <Badge variant={i === 0 ? "default" : "secondary"} className="text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center p-0">
                                                    #{i + 1}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                    <Building2 className="h-5 w-5 text-emerald-500" />
                                                </div>
                                                <h4 className="text-sm font-bold text-foreground truncate max-w-[200px]">{inst.name}</h4>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="h-3.5 w-3.5 text-emerald-500" />
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Leads Generated</span>
                                                </div>
                                                <span className="text-2xl font-black text-emerald-500">{inst.count}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
