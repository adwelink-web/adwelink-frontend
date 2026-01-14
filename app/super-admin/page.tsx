import { createServerClient } from "@/lib/supabase-server"
import { Building2, Users, MessageSquare, IndianRupee, TrendingUp, ArrowUpRight, Clock, Zap } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
        <div className="flex flex-col h-full">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border flex items-end justify-between transition-all duration-200">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                            <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Command Center
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm">Adwelink Business Overview & Real-time Metrics</p>
                </div>
                <Badge variant="outline" className="font-mono gap-2 hidden sm:flex">
                    <Clock className="h-3 w-3" />
                    Updated: Just now
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className="bg-card/50 backdrop-blur border-border/40 transition-all hover:bg-muted/10">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${colorClasses[stat.color].split(' ').pop()}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
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
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Institutes List */}
                    <Card className="col-span-1 bg-card/50 border-border/40">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    Active Institutes
                                </CardTitle>
                                <CardDescription>Top active clients by message usage</CardDescription>
                            </div>
                            <Link href="/super-admin/institutes">
                                <Badge variant="outline" className="hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                                    View All <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Badge>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border/40">
                                        <TableHead className="pl-6">Name</TableHead>
                                        <TableHead>Usage</TableHead>
                                        <TableHead className="text-right pr-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {metrics.institutes.slice(0, 5).map((inst) => (
                                        <TableRow key={inst.id} className="hover:bg-muted/5 border-border/40">
                                            <TableCell className="pl-6 py-3">
                                                <div className="font-medium text-foreground text-sm">{inst.name}</div>
                                                <div className="text-xs text-muted-foreground">{inst.city || "No city"}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-mono font-medium text-foreground">{inst.messages_used || 0}</div>
                                                <div className="w-16 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(((inst.messages_used || 0) / (inst.message_limit || 50)) * 100, 100)}%` }}></div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                                                    {inst.current_plan || "Trial"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
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
                    <Card className="col-span-1 bg-card/50 border-border/40">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Users className="h-4 w-4 text-emerald-500" />
                                    Recent Leads
                                </CardTitle>
                                <CardDescription>Latest inbound leads across all institutes</CardDescription>
                            </div>
                            <Link href="/super-admin/leads">
                                <Badge variant="outline" className="hover:bg-emerald-500/10 hover:text-emerald-500 cursor-pointer transition-colors">
                                    View All <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Badge>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border/40">
                                        <TableHead className="pl-6">Lead Name</TableHead>
                                        <TableHead>Institute</TableHead>
                                        <TableHead className="text-right pr-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {metrics.recentLeads.map((lead: any) => {
                                        return (
                                            <TableRow key={lead.id} className="hover:bg-muted/5 border-border/40">
                                                <TableCell className="pl-6 py-3">
                                                    <div className="font-medium text-foreground text-sm">{lead.name || "Unknown"}</div>
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
                                        )
                                    })}
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
    )
}
