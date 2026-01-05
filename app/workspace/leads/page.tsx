"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { Database } from "@/lib/database.types" // Use generated types
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Calendar, Phone, MapPin, Sparkles, ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns" // We might need to install date-fns or use native Intl

type Lead = Database["public"]["Tables"]["leads"]["Row"]

export default function LeadsPage() {
    const [leads, setLeads] = React.useState<Lead[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
    const [dialogOpen, setDialogOpen] = React.useState(false)

    React.useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()
            setLoading(true)

            // Direct Fetch - Respecting the Schema
            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .order("updated_at", { ascending: false })
                .limit(50)

            if (error) {
                console.error("Supabase Error:", error)
            } else {
                setLeads(data || [])
            }
            setLoading(false)
        }

        fetchData()
    }, [])

    const getStatusBadge = (status: string | null) => {
        const s = (status || 'fresh').toLowerCase()
        if (s.includes('converted') || s.includes('admitted')) return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Converted</Badge>
        if (s.includes('visit') || s.includes('scheduled')) return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Visit Planned</Badge>
        if (s.includes('dead') || s.includes('lost')) return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Lost</Badge>
        if (s.includes('hot')) return <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">Hot Lead</Badge>
        return <Badge variant="outline" className="text-slate-400 border-slate-700">{status || 'Fresh'}</Badge>
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return <span className="text-slate-600">N/A</span>
        try {
            return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        } catch (e) {
            return <span className="text-red-400">Invalid Date</span>
        }
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Lead Management</h2>
                    <p className="text-muted-foreground mt-1">Track Visits, Follow-ups, and Admissions.</p>
                </div>
                <Button className="bg-white text-black hover:bg-slate-200">
                    <Plus className="mr-2 h-4 w-4" /> Add Manual Lead
                </Button>
            </div>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Active Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-slate-900/50">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-slate-300">Candidate</TableHead>
                                <TableHead className="text-slate-300 w-[140px]">Source / City</TableHead>
                                <TableHead className="text-slate-300">Interest</TableHead>
                                <TableHead className="text-slate-300">Score</TableHead>
                                <TableHead className="text-slate-300">Next Action</TableHead>
                                <TableHead className="text-slate-300">Status</TableHead>
                                <TableHead className="text-right text-slate-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">Loading Leads...</TableCell>
                                </TableRow>
                            ) : leads.map((lead) => (
                                <TableRow key={lead.id} className="border-white/5 hover:bg-white/5 group cursor-pointer" onClick={() => { setSelectedLead(lead); setDialogOpen(true) }}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-200">{lead.name || "Unknown"}</span>
                                            <span className="text-xs text-slate-500 font-mono mt-0.5">{lead.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-slate-400 capitalize">{lead.city || "-"}</span>
                                            {lead.source && <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-500 w-fit uppercase">{lead.source}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-400">
                                        <div className="flex flex-col">
                                            <span>{lead.interested_course}</span>
                                            {lead.current_class && <span className="text-xs text-slate-600">{lead.current_class}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {lead.lead_score ? (
                                            <div className={`flex items-center gap-1 font-bold ${lead.lead_score > 80 ? 'text-green-400' : lead.lead_score > 50 ? 'text-amber-400' : 'text-slate-500'}`}>
                                                {lead.lead_score}
                                            </div>
                                        ) : <span className="text-slate-700">-</span>}
                                    </TableCell>
                                    <TableCell>
                                        {lead.next_followup ? (
                                            <div className="text-xs text-slate-300">
                                                {formatDate(lead.next_followup)}
                                            </div>
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(lead.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <ArrowUpRight className="h-4 w-4 text-slate-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* REFACTORED MODAL DIALOG (POPUP) */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-[800px] bg-[#0F131E] border border-white/10 text-slate-200 p-0 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
                    {selectedLead && (
                        <div className="flex flex-col h-full">
                            {/* DIALOG HEADER */}
                            <DialogHeader className="p-6 bg-[#181D2D] border-b border-white/5 space-y-1 shrink-0">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <DialogTitle className="text-xs font-semibold uppercase tracking-widest text-slate-500">Student Profile</DialogTitle>
                                        <div className="mt-2">
                                            <h3 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                                                {selectedLead.name}
                                            </h3>
                                            <DialogDescription className="flex items-center gap-3 text-sm text-slate-400">
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedLead.phone}</span>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedLead.city || "N/A"}</span>
                                            </DialogDescription>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {getStatusBadge(selectedLead.status)}
                                        <span className="text-xs text-slate-500 uppercase tracking-wide">{selectedLead.source || "DIRECT"} SOURCE</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20">
                                        <Phone className="mr-2 h-4 w-4" /> Call Parent
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 hover:text-white text-slate-300">
                                        <Calendar className="mr-2 h-4 w-4" /> Schedule Visit
                                    </Button>
                                </div>
                            </DialogHeader>

                            {/* DIALOG BODY */}
                            <div className="p-6 space-y-8 flex-1 overflow-y-auto">

                                {/* 1. AI Insights */}
                                <section>
                                    <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 p-5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3 opacity-10"><Sparkles className="h-12 w-12 text-violet-500" /></div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 flex items-center gap-2">
                                            <Sparkles className="h-3 w-3" /> AI Engagement Analysis
                                        </h4>
                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">{selectedLead.lead_score || 0}<span className="text-lg text-slate-500 font-normal">%</span></div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">Conversion Chance</div>
                                            </div>
                                            <div className="h-10 w-px bg-white/10"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-violet-200/90 leading-relaxed italic">
                                                    "{selectedLead.ai_notes || "Insufficient interaction data. No AI summary available yet."}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* 2. Academic Info */}
                                <section>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-white/5 pb-2">Academic Profile</h4>
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-semibold">Interested Course</label>
                                            <div className="text-sm font-medium text-white mt-1">{selectedLead.interested_course || <span className="text-slate-600">Not Specified</span>}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-semibold">Current Class</label>
                                            <div className="text-sm font-medium text-white mt-1">{selectedLead.current_class || <span className="text-slate-600">N/A</span>}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-semibold">Target Year</label>
                                            <div className="text-sm font-medium text-white mt-1">{selectedLead.target_year || <span className="text-slate-600">N/A</span>}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-semibold">Budget Est.</label>
                                            <div className="text-sm font-medium text-white mt-1">{selectedLead.budget_range || <span className="text-slate-600">Not Disclosed</span>}</div>
                                        </div>
                                    </div>
                                </section>

                                {/* 3. Family Details */}
                                <section>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-white/5 pb-2">Family & Contact</h4>
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-semibold">Parent Name</label>
                                            <div className="text-sm font-medium text-white mt-1">{selectedLead.parent_name || <span className="text-slate-600">Not Provided</span>}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-semibold">Parent Phone</label>
                                            <div className="text-sm font-medium text-white mt-1 font-mono">{selectedLead.parent_phone || <span className="text-slate-600">N/A</span>}</div>
                                        </div>
                                    </div>
                                </section>

                                {/* 4. Visit Logistic */}
                                <section>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-white/5 pb-2">Visit & Logistics</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                            <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Next Follow-up</label>
                                            <div className="text-xs font-medium text-amber-400">{selectedLead.next_followup ? formatDate(selectedLead.next_followup) : "None"}</div>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                            <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Scheduled Visit</label>
                                            <div className="text-xs font-medium text-white">{selectedLead.visit_date ? formatDate(selectedLead.visit_date) : "None"}</div>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                            <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Visit Type</label>
                                            <div className="text-xs font-medium text-white capitalize">{selectedLead.visit_type || "N/A"}</div>
                                        </div>
                                    </div>
                                </section>

                                {/* Footer Note */}
                                <div className="pt-8 text-center">
                                    <p className="text-[10px] text-slate-600 uppercase tracking-widest">Lead ID: {selectedLead.id}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    )
}
