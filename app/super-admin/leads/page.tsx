import { createAdminClient } from "@/lib/supabase-server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Users, Download, Filter } from "lucide-react"

async function getAllLeads() {
    const supabase = createAdminClient()

    // FK constraint now exists, can use proper join
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
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* Header Area - Shrink-0 to stay fixed */}
            <div className="shrink-0 sticky top-0 z-50 backdrop-blur-xl px-4 md:px-8 py-4 md:py-6 transition-all">
                <div className="relative z-10 flex flex-row items-center justify-between gap-3 md:gap-4 max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-lg md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2 md:gap-3">
                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/30">
                                <Users className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                            </div>
                            <span className="hidden md:inline">All Leads</span>
                            <span className="md:hidden">Leads</span>
                            <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-normal whitespace-nowrap">
                                <span className="text-slate-400">{leads.length}</span>
                            </span>
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base hidden md:block">View all leads across all institutes</p>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3 text-xs hover:bg-white/5 border-white/10">
                            <Filter className="h-3.5 w-3.5 md:mr-2" />
                            <span className="hidden md:inline">Filter</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3 text-xs hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border-white/10">
                            <Download className="h-3.5 w-3.5 md:mr-2" />
                            <span className="hidden md:inline">Export</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Fixed Height, No Page Scroll */}
            <div className="flex-1 w-full overflow-hidden relative z-10 px-4 md:px-8 pb-4 md:pb-6">
                <div className="h-full w-full max-w-7xl mx-auto">
                    {/* Table Card - Full Height, Responsive */}
                    <Card className="h-full bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg flex flex-col overflow-hidden">

                        {/* CardContent handles Horizontal Scroll (if needed) */}
                        <CardContent className="p-0 flex-1 overflow-x-auto overflow-y-hidden relative w-full custom-scrollbar">

                            {/* Inner Wrapper: Forces Width & Handles V-Scroll Layout */}
                            <div className="min-w-[1000px] flex flex-col h-full">

                                {/* TABLE HEADER: Static, Transparent, Outside ScrollView */}
                                <div className="flex-none px-6 py-3 border-b border-white/5">
                                    <div className="grid grid-cols-12 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <div className="col-span-3">Name</div>
                                        <div className="col-span-2">Phone</div>
                                        <div className="col-span-2">Institute</div>
                                        <div className="col-span-2">Course</div>
                                        <div className="col-span-1">Status</div>
                                        <div className="col-span-1">Score</div>
                                        <div className="col-span-1 text-right pr-2">Created</div>
                                    </div>
                                </div>

                                {/* TABLE BODY: Auto V-Scroll, Fits Remaining Height */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-2 space-y-1">
                                    {leads.map((lead: any) => (
                                        <div key={lead.id} className="grid grid-cols-12 items-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5 group">
                                            <div className="col-span-3 pl-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-1 ring-white/20">
                                                        {(lead.name || "?").charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-medium text-white text-sm truncate pr-2">{lead.name || "Unknown"}</p>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-muted-foreground font-mono text-xs">{lead.phone}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-muted-foreground text-xs truncate max-w-[90%]">{lead.institutes?.name || "Unknown"}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-muted-foreground text-xs truncate max-w-[90%]">{lead.interested_course || "-"}</p>
                                            </div>
                                            <div className="col-span-1">
                                                <Badge variant={
                                                    lead.status === "hot" ? "destructive" :
                                                        lead.status === "warm" ? "secondary" :
                                                            lead.status === "converted" ? "default" :
                                                                "outline"
                                                } className="uppercase text-[10px] h-5 px-1.5">
                                                    {lead.status || "new"}
                                                </Badge>
                                            </div>
                                            <div className="col-span-1">
                                                <span className={`text-xs font-bold font-mono ${(lead.lead_score || 0) >= 70 ? "text-emerald-500" :
                                                    (lead.lead_score || 0) >= 40 ? "text-amber-500" :
                                                        "text-muted-foreground"
                                                    }`}>
                                                    {lead.lead_score || 0}
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-right pr-2">
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(lead.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {leads.length === 0 && (
                                        <div className="text-center py-16 text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                    <Users className="h-8 w-8 text-muted-foreground/50" />
                                                </div>
                                                <p className="text-white font-medium mt-2">No leads yet</p>
                                                <p className="text-sm px-4">Leads will appear here once institutes start receiving inquiries.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
