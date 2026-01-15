import { createAdminClient } from "@/lib/supabase-server"
import { Building2, Users, MessageSquare, IndianRupee, ArrowUpRight, Clock, Zap, Crown } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

    const stats = [
        {
            label: "Total Institutes",
            value: metrics.institutesCount,
            subtext: "Active clients",
            icon: Building2,
            color: "violet",
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
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* Main Scrollable Container */}
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">

                {/* Sticky Blurred Header Section */}
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center ring-1 ring-violet-500/30">
                                    <Crown className="h-5 w-5 text-violet-500" />
                                </div>
                                Command Center
                                <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                    </span>
                                    <span className="text-emerald-400">Live</span>
                                </span>
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Adwelink Business Overview & Real-time Metrics</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono gap-2 hidden sm:flex">
                                <Clock className="h-3 w-3" />
                                Updated: Just now
                            </Badge>
                            <Link href="/super-admin/onboard">
                                <Button className="bg-violet-500 text-white hover:bg-violet-600 shadow-lg shadow-violet-500/25 font-bold">
                                    <Building2 className="mr-2 h-4 w-4" /> Onboard Client
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <Link href={stat.href} key={i}>
                                <Card
                                    className={`bg-gradient-to-br ${colorClasses[stat.color].gradient} border-white/10 backdrop-blur-md shadow-lg ${colorClasses[stat.color].border} hover:scale-[1.02] transition-all h-full cursor-pointer`}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-200">
                                            {stat.label}
                                        </CardTitle>
                                        <stat.icon className={`h-4 w-4 ${colorClasses[stat.color].icon}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-[10px] uppercase px-1.5 h-5">
                                                {stat.trend}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">
                                                {stat.subtext}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Institutes List */}
                        <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-violet-500/20">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                                        <Building2 className="h-4 w-4 text-violet-500" />
                                        Active Institutes
                                    </CardTitle>
                                    <CardDescription>Top active clients by message usage</CardDescription>
                                </div>
                                <Link href="/super-admin/institutes">
                                    <Badge variant="outline" className="hover:bg-violet-500/10 hover:text-violet-400 cursor-pointer transition-colors">
                                        View All <ArrowUpRight className="h-3 w-3 ml-1" />
                                    </Badge>
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0 max-h-[280px] overflow-y-auto custom-scrollbar">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-[#0B0F19]">
                                        <TableRow className="hover:bg-transparent border-white/5">
                                            <TableHead className="pl-6">Name</TableHead>
                                            <TableHead>Usage</TableHead>
                                            <TableHead className="text-right pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {metrics.institutes.slice(0, 5).map((inst) => (
                                            <Link href={`/super-admin/institutes/${inst.id}`} key={inst.id} className="contents">
                                                <TableRow className="hover:bg-white/10 border-white/5 cursor-pointer transition-colors">
                                                    <TableCell className="pl-6 py-3">
                                                        <div className="font-medium text-white text-sm">{inst.name}</div>
                                                        <div className="text-xs text-muted-foreground">{inst.city || "No city"}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm font-mono font-medium text-white">{inst.messages_used || 0}</div>
                                                        <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                                                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min(((inst.messages_used || 0) / (inst.message_limit || 50)) * 100, 100)}%` }}></div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                                                            {inst.current_plan || "Trial"}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            </Link>
                                        ))}
                                        {metrics.institutes.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                                    No institutes found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Recent Leads */}
                        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-emerald-500/20">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                                        <Users className="h-4 w-4 text-emerald-500" />
                                        Recent Leads
                                    </CardTitle>
                                    <CardDescription>Latest inbound leads across all institutes</CardDescription>
                                </div>
                                <Link href="/super-admin/leads">
                                    <Badge variant="outline" className="hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-colors">
                                        View All <ArrowUpRight className="h-3 w-3 ml-1" />
                                    </Badge>
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0 max-h-[280px] overflow-y-auto custom-scrollbar">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-[#0B0F19]">
                                        <TableRow className="hover:bg-transparent border-white/5">
                                            <TableHead className="pl-6">Lead Name</TableHead>
                                            <TableHead>Institute</TableHead>
                                            <TableHead className="text-right pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {metrics.recentLeads.map((lead: any) => (
                                            <TableRow key={lead.id} className="hover:bg-white/10 border-white/5 cursor-pointer transition-colors">
                                                <TableCell className="pl-6 py-3">
                                                    <div className="font-medium text-white text-sm">{lead.name || "Unknown"}</div>
                                                    <div className="text-xs text-muted-foreground">{new Date(lead.created_at).toLocaleDateString()}</div>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {lead.institutes?.name || "Unknown"}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Badge variant={
                                                        lead.status === 'hot' ? 'destructive' :
                                                            lead.status === 'warm' ? 'default' :
                                                                lead.status === 'fresh' ? 'secondary' : 'outline'
                                                    } className="text-[10px] uppercase">
                                                        {lead.status || "New"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {metrics.recentLeads.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                                    No leads found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
