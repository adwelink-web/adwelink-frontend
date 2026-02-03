import { createAdminClient } from "@/lib/supabase-server"
import { Building2, Users, MessageSquare, IndianRupee, ArrowUpRight, Clock, Zap, Crown } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WorkspaceHeader } from "@/components/workspace-header"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// Helper for currency format
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount)
}

// Fetch all metrics
async function getMetrics() {
    const supabase = createAdminClient()

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

    // Get recent leads with institute names (FK constraint exists)
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

    // Using semantic mapped colors where appropriate, but keeping distinct colors for distinct metrics
    const stats = [
        {
            label: "Total Institutes",
            value: metrics.institutesCount,
            subtext: "Active clients",
            icon: Building2,
            color: "primary", // Was violet
            trend: "+2 this week",
            href: "/super-admin/institutes"
        },
        {
            label: "Total Leads",
            value: metrics.leadsCount,
            subtext: `+${metrics.todayLeads} today`,
            icon: Users,
            color: "emerald",
            trend: "Growing",
            href: "/super-admin/leads"
        },
        {
            label: "Messages Sent",
            value: metrics.totalMessages.toLocaleString(),
            subtext: "Across all institutes",
            icon: MessageSquare,
            color: "cyan",
            trend: "Active",
            href: "/super-admin/analytics"
        },
        {
            label: "Monthly Revenue",
            value: `₹${monthlyRevenue.toLocaleString()}`,
            subtext: "From subscriptions",
            icon: IndianRupee,
            color: "amber",
            trend: "Recurring",
            href: "/super-admin/billing"
        }
    ]

    const colorClasses: Record<string, { gradient: string; icon: string; border: string }> = {
        primary: {
            gradient: "from-primary/10 to-transparent",
            icon: "text-primary",
            border: "border-primary/20"
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
        <div className="h-[calc(100vh-45px)] w-full overflow-hidden flex flex-col relative">
            {/* Header Section - Fixed (Non-scrollable) */}
            <div className="flex-none pt-4 px-4 md:px-8 pb-2">
                <WorkspaceHeader
                    title="Command Center"
                    subtitle="Adwelink Business Overview & Real-time Metrics"
                    icon={Crown}
                    iconColor="text-primary"
                    className="max-w-7xl mx-auto"
                    badge={
                        <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            </span>
                            <span className="text-emerald-400">Live</span>
                        </span>
                    }
                >
                    <Badge variant="outline" className="font-mono gap-2 hidden sm:flex">
                        <Clock className="h-3 w-3" />
                        Updated: Just now
                    </Badge>
                    <Link href="/super-admin/onboard">
                        <Button className="font-bold shadow-lg shadow-primary/25">
                            <Building2 className="mr-2 h-4 w-4" /> Onboard Client
                        </Button>
                    </Link>
                </WorkspaceHeader>
            </div>

            {/* Scrollable / Flexible Content Area */}
            <div className="flex-1 min-h-0 flex flex-col px-4 md:px-8 pb-4 max-w-7xl mx-auto w-full space-y-4">

                {/* 1. Stats Grid - Fixed height within flex flow */}
                <div className="flex-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <Link href={stat.href} key={i}>
                            <Card
                                className={`bg-gradient-to-br ${colorClasses[stat.color].gradient} border-white/10 backdrop-blur-md shadow-lg ${colorClasses[stat.color].border} hover:scale-[1.02] transition-all h-full cursor-pointer bg-card/50`}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                    <CardTitle className="text-[11px] font-medium text-foreground/80 lowercase">
                                        {stat.label}
                                    </CardTitle>
                                    <stat.icon className={`h-3 w-3 ${colorClasses[stat.color].icon}`} />
                                </CardHeader>
                                <CardContent className="pb-3 pt-0 px-4">
                                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Badge variant="secondary" className="text-[9px] uppercase px-1 h-4">
                                            {stat.trend}
                                        </Badge>
                                        <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {stat.subtext}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* 2. Main content cards - Flexible and scroll internally */}
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
                    {/* Institutes List */}
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-primary/20 flex flex-col bg-card/50 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                            <div className="space-y-0.5">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    Active Institutes
                                </CardTitle>
                                <CardDescription className="text-[11px]">Top active clients by message usage</CardDescription>
                            </div>
                            <Link href="/super-admin/institutes">
                                <Badge variant="outline" className="text-[10px] hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                                    View All <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Badge>
                            </Link>
                        </CardHeader>

                        <CardContent className="p-0 flex-1 min-h-0 flex flex-col pt-2">
                            {/* Table Header Wrapper - Non-scrollable */}
                            <div className="px-6 mb-2 flex-none">
                                <div className="grid grid-cols-12 px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <div className="col-span-5">Name</div>
                                    <div className="col-span-4">Usage</div>
                                    <div className="col-span-3 text-right">Status</div>
                                </div>
                            </div>

                            {/* Scrollable Container */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-4 space-y-1">
                                {metrics.institutes.map((inst) => (
                                    <Link href={`/super-admin/institutes/${inst.id}`} key={inst.id} className="block group">
                                        <div className="grid grid-cols-12 items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                                            <div className="col-span-5">
                                                <div className="font-medium text-foreground text-sm line-clamp-1">{inst.name}</div>
                                                <div className="text-[10px] text-muted-foreground">{inst.city || "No city"}</div>
                                            </div>
                                            <div className="col-span-4">
                                                <div className="text-sm font-mono font-medium text-foreground">{inst.messages_used || 0}</div>
                                                <div className="w-16 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${Math.min(((inst.messages_used || 0) / (inst.message_limit || 50)) * 100, 100)}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 text-right">
                                                <Badge variant="secondary" className="text-[10px] uppercase font-bold px-1.5 h-5">
                                                    {inst.current_plan || "Trial"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {metrics.institutes.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground text-xs">No institutes found.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Leads */}
                    <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-emerald-500/20 flex flex-col bg-card/50 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                            <div className="space-y-0.5">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                                    <Users className="h-4 w-4 text-emerald-500" />
                                    Recent Leads
                                </CardTitle>
                                <CardDescription className="text-[11px]">Latest inbound leads across all institutes</CardDescription>
                            </div>
                            <Link href="/super-admin/leads">
                                <Badge variant="outline" className="text-[10px] hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-colors">
                                    View All <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Badge>
                            </Link>
                        </CardHeader>

                        <CardContent className="p-0 flex-1 min-h-0 flex flex-col pt-2">
                            {/* Fixed Header Wrapper */}
                            <div className="px-6 mb-2 flex-none">
                                <div className="grid grid-cols-12 px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <div className="col-span-5">Lead Name</div>
                                    <div className="col-span-4">Institute</div>
                                    <div className="col-span-3 text-right">Status</div>
                                </div>
                            </div>

                            {/* Scrollable Container */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-4 space-y-1">
                                {metrics.recentLeads.map((lead: any) => (
                                    <div key={lead.id} className="grid grid-cols-12 items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                                        <div className="col-span-5">
                                            <div className="font-medium text-foreground text-sm line-clamp-1">{lead.name || "Unknown"}</div>
                                            <div className="text-[10px] text-muted-foreground">{new Date(lead.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="text-xs text-muted-foreground max-w-[120px] truncate">
                                                {lead.institutes?.name || "Unknown"}
                                            </div>
                                        </div>
                                        <div className="col-span-3 text-right">
                                            <Badge variant={
                                                lead.status === 'hot' ? 'destructive' :
                                                    lead.status === 'warm' ? 'default' :
                                                        lead.status === 'fresh' ? 'secondary' : 'outline'
                                            } className="text-[10px] uppercase h-5 px-1.5">
                                                {lead.status || "New"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {metrics.recentLeads.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground text-xs">No leads found.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
