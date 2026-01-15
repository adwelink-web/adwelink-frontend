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
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col relative">
            {/* Header Area - Shrink-0 to stay fixed */}
            <div className="shrink-0 sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/30">
                                <Users className="h-5 w-5 text-emerald-500" />
                            </div>
                            All Leads
                            <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                <span className="text-slate-400">{leads.length} total</span>
                            </span>
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">View all leads across all institutes</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="text-xs hover:bg-white/5">
                            <Filter className="mr-2 h-3.5 w-3.5" /> Filter
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30">
                            <Download className="mr-2 h-3.5 w-3.5" /> Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Scrollable Content Area */}
            <div className="flex-1 w-full overflow-y-auto custom-scrollbar relative z-10 px-4 md:px-8 py-6 pb-20">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Table Card */}
                    <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg flex flex-col overflow-hidden">
                        <CardContent className="p-0 flex-1 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-[#0B0F19] z-20 shadow-sm transition-all border-b border-white/10">
                                        <TableRow className="hover:bg-transparent border-white/5">
                                            <TableHead className="pl-6 bg-[#0B0F19] text-white/70 font-bold whitespace-nowrap">Name</TableHead>
                                            <TableHead className="bg-[#0B0F19] text-white/70 font-bold whitespace-nowrap">Phone</TableHead>
                                            <TableHead className="bg-[#0B0F19] text-white/70 font-bold whitespace-nowrap">Institute</TableHead>
                                            <TableHead className="bg-[#0B0F19] text-white/70 font-bold whitespace-nowrap">Course</TableHead>
                                            <TableHead className="bg-[#0B0F19] text-white/70 font-bold whitespace-nowrap">Status</TableHead>
                                            <TableHead className="bg-[#0B0F19] text-white/70 font-bold whitespace-nowrap">Score</TableHead>
                                            <TableHead className="pr-6 bg-[#0B0F19] text-white/70 font-bold whitespace-nowrap">Created</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leads.map((lead: any) => (
                                            <TableRow key={lead.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-1 ring-white/20">
                                                            {(lead.name || "?").charAt(0).toUpperCase()}
                                                        </div>
                                                        <p className="font-medium text-white">{lead.name || "Unknown"}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-muted-foreground font-mono text-xs">{lead.phone}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-muted-foreground text-sm truncate max-w-[150px]">{lead.institutes?.name || "Unknown"}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-muted-foreground text-sm truncate max-w-[120px]">{lead.interested_course || "-"}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        lead.status === "hot" ? "destructive" :
                                                            lead.status === "warm" ? "secondary" :
                                                                lead.status === "converted" ? "default" :
                                                                    "outline"
                                                    } className="uppercase text-[10px]">
                                                        {lead.status || "new"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`text-sm font-bold ${(lead.lead_score || 0) >= 70 ? "text-emerald-500" :
                                                        (lead.lead_score || 0) >= 40 ? "text-amber-500" :
                                                            "text-muted-foreground"
                                                        }`}>
                                                        {lead.lead_score || 0}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="pr-6">
                                                    <p className="text-xs text-muted-foreground min-w-[80px]">
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
