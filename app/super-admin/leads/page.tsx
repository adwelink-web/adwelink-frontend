import { createAdminClient } from "@/lib/supabase-server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Download, Filter } from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"

async function getAllLeads() {
    const supabase = createAdminClient()

    const { data: leads } = await supabase
        .from("leads")
        .select(`
            *,
            institutes (name)
        `)
        .order("created_at", { ascending: false })

    return leads || []
}

export default async function AllLeadsPage() {
    const leads = await getAllLeads()

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative p-4 md:p-8">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Header - Compact */}
            <WorkspaceHeader
                title="All Leads"
                subtitle="View all leads across all institutes"
                icon={Users}
                iconColor="text-emerald-500"
                className="mb-4 max-w-7xl mx-auto w-full"
                badge={
                    <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500/20 text-emerald-400">
                        {leads.length}
                    </Badge>
                }
            >
                <Button variant="outline" size="sm" className="h-8 text-xs hover:bg-white/5 border-white/10 gap-2">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border-white/10 gap-2">
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Export</span>
                </Button>
            </WorkspaceHeader>

            {/* Main Card - Fills remaining height, inner scroll only */}
            <Card className="flex-1 min-h-0 bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg flex flex-col z-10 max-w-7xl mx-auto w-full overflow-hidden">
                <CardContent className="p-0 flex flex-col flex-1 min-h-0 overflow-hidden overflow-x-auto scrollbar-hidden">
                    {/* Table Header */}
                    <div className="flex-none z-20 px-6 mb-1 min-w-[1000px]">
                        <div className="grid grid-cols-12 gap-4 px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <div className="col-span-3 pl-2">Name</div>
                            <div className="col-span-2">Phone</div>
                            <div className="col-span-2">Institute</div>
                            <div className="col-span-1">Course</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-1">Score</div>
                            <div className="col-span-1 text-right pr-2">Date</div>
                        </div>
                    </div>

                    {/* Table Body - Scrollable */}
                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden px-6 py-2 space-y-1 min-w-[1000px]">
                        {leads.length === 0 ? (
                            <div className="px-6 py-16 text-center text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <Users className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-white font-medium mt-2">No leads yet</p>
                                    <p className="text-sm">Leads will appear here once institutes start receiving inquiries.</p>
                                </div>
                            </div>
                        ) : (
                            leads.map((lead: any) => (
                                <div key={lead.id} className="grid grid-cols-12 gap-4 items-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group text-xs">
                                    {/* Name */}
                                    <div className="col-span-3 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-1 ring-white/20">
                                                {(lead.name || "?").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white truncate max-w-[120px]">{lead.name || "Unknown"}</div>
                                                <div className="text-[10px] text-slate-500">{lead.source || "Direct"}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="col-span-2">
                                        <p className="text-slate-300 font-mono text-xs">{lead.phone}</p>
                                    </div>

                                    {/* Institute */}
                                    <div className="col-span-2">
                                        <p className="text-slate-400 truncate max-w-[100px]">{lead.institutes?.name || "Unknown"}</p>
                                    </div>

                                    {/* Course */}
                                    <div className="col-span-1">
                                        <p className="text-slate-400 truncate max-w-[80px]">{lead.interested_course || "-"}</p>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2">
                                        <Badge variant="secondary" className={`text-[9px] uppercase h-5 px-1.5 ${lead.status === "hot" ? "bg-red-500/10 text-red-400" :
                                            lead.status === "warm" ? "bg-amber-500/10 text-amber-400" :
                                                lead.status === "converted" ? "bg-emerald-500/10 text-emerald-400" :
                                                    "bg-slate-500/10 text-slate-400"
                                            }`}>
                                            {lead.status || "new"}
                                        </Badge>
                                    </div>

                                    {/* Score */}
                                    <div className="col-span-1">
                                        <span className={`font-bold font-mono ${(lead.lead_score || 0) >= 70 ? "text-emerald-500" :
                                            (lead.lead_score || 0) >= 40 ? "text-amber-500" :
                                                "text-slate-500"
                                            }`}>
                                            {lead.lead_score || 0}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="col-span-1 text-right pr-2">
                                        <p className="text-slate-500">
                                            {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
