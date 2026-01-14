import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Phone, MessageSquare, Users, ArrowLeft, CheckCircle, XCircle, Settings } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getInstituteDetails(id: string) {
    const supabase = await createServerClient()

    // Get institute
    const { data: institute } = await supabase
        .from("institutes")
        .select("*")
        .eq("id", id)
        .single()

    if (!institute) return null

    // Get leads count
    const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("institute_id", id)

    // Get recent leads
    const { data: recentLeads } = await supabase
        .from("leads")
        .select("*")
        .eq("institute_id", id)
        .order("created_at", { ascending: false })
        .limit(10)

    return { institute, leadsCount: leadsCount || 0, recentLeads: recentLeads || [] }
}

export default async function InstituteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getInstituteDetails(id)

    if (!data) {
        notFound()
    }

    const { institute, leadsCount, recentLeads } = data

    const stats = [
        {
            label: "Total Leads",
            value: leadsCount,
            icon: Users,
            color: "violet"
        },
        {
            label: "Messages Used",
            value: `${institute.messages_used || 0}/${institute.message_limit || 50}`,
            icon: MessageSquare,
            color: "cyan"
        },
        {
            label: "WhatsApp",
            value: institute.phone_id ? "Connected" : "Not Setup",
            icon: Phone,
            color: "emerald",
            isConnected: !!institute.phone_id
        },
        {
            label: "Created",
            value: institute.created_at ? new Date(institute.created_at).toLocaleDateString() : "N/A",
            icon: Building2,
            color: "slate"
        }
    ]

    const colorClasses: Record<string, { gradient: string; icon: string; border: string }> = {
        violet: {
            gradient: "from-violet-500/10 to-transparent",
            icon: "text-violet-500",
            border: "border-violet-500/20"
        },
        cyan: {
            gradient: "from-cyan-500/10 to-transparent",
            icon: "text-cyan-500",
            border: "border-cyan-500/20"
        },
        emerald: {
            gradient: "from-emerald-500/10 to-transparent",
            icon: "text-emerald-500",
            border: "border-emerald-500/20"
        },
        slate: {
            gradient: "from-slate-500/10 to-transparent",
            icon: "text-slate-400",
            border: "border-slate-500/20"
        }
    }

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* Main Scrollable Container */}
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">

                {/* Sticky Blurred Header Section */}
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 max-w-7xl mx-auto">
                        {/* Back Button */}
                        <Link href="/super-admin/institutes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back to Institutes
                        </Link>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center ring-1 ring-blue-500/30">
                                        <Building2 className="h-5 w-5 text-blue-500" />
                                    </div>
                                    {institute.name}
                                    <Badge variant="outline" className="uppercase text-xs tracking-wider">
                                        {institute.current_plan || "trial"}
                                    </Badge>
                                </h2>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {institute.city || "No city"}</span>
                                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {institute.helpline_number || "No helpline"}</span>
                                </div>
                            </div>

                            <Button variant="outline" size="sm" className="hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30">
                                <Settings className="mr-2 h-4 w-4" /> Edit Settings
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <Card
                                key={i}
                                className={`bg-gradient-to-br ${colorClasses[stat.color].gradient} border-white/10 backdrop-blur-md shadow-lg ${colorClasses[stat.color].border} hover:scale-[1.02] transition-all`}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                            <p className={`text-xl font-bold mt-1 flex items-center gap-2 ${stat.color === 'emerald' && stat.isConnected !== undefined ? (stat.isConnected ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>
                                                {stat.color === 'emerald' && stat.isConnected !== undefined && (
                                                    stat.isConnected ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
                                                )}
                                                {stat.value}
                                            </p>
                                        </div>
                                        <stat.icon className={`h-8 w-8 ${colorClasses[stat.color].icon}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Details & Leads */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Institute Details */}
                        <Card className="bg-gradient-to-br from-blue-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-blue-500" />
                                    Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Phone Number ID</p>
                                        <p className="text-white font-mono text-xs">{institute.phone_id || "Not set"}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Access Token</p>
                                        <p className="text-white font-mono text-xs">{institute.access_token ? "••••••••" : "Not set"}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Address</p>
                                        <p className="text-white text-xs">{institute.address || "Not set"}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Google Maps</p>
                                        <p className="text-white text-xs">{institute.google_map_link ? "Set" : "Not set"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Leads */}
                        <Card className="bg-gradient-to-br from-violet-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Users className="h-4 w-4 text-violet-500" />
                                    Recent Leads
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentLeads.map((lead: any) => (
                                        <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/20">
                                                    {(lead.name || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white text-sm">{lead.name || "Unknown"}</p>
                                                    <p className="text-xs text-muted-foreground">{lead.phone}</p>
                                                </div>
                                            </div>
                                            <Badge variant={
                                                lead.status === "hot" ? "destructive" :
                                                    lead.status === "warm" ? "secondary" :
                                                        "outline"
                                            } className="text-[10px] uppercase">
                                                {lead.status || "new"}
                                            </Badge>
                                        </div>
                                    ))}
                                    {recentLeads.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                                                <Users className="h-6 w-6 text-violet-500/50" />
                                            </div>
                                            <p className="text-muted-foreground">No leads yet</p>
                                        </div>
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
