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
import { MoreHorizontal, Plus, Calendar, Phone, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns" // We might need to install date-fns or use native Intl

type Lead = Database["public"]["Tables"]["leads"]["Row"]

export default function LeadsPage() {
    const [leads, setLeads] = React.useState<Lead[]>([])
    const [loading, setLoading] = React.useState(true)

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
        return <Badge variant="outline" className="text-slate-400 border-slate-700">{status || 'Fresh'}</Badge>
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return <span className="text-slate-600">-</span>
        return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="space-y-6">
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
                                <TableHead className="text-slate-300">Course / Class</TableHead>
                                <TableHead className="text-slate-300">City</TableHead>
                                <TableHead className="text-slate-300">Visit Status</TableHead>
                                <TableHead className="text-slate-300">Next Action</TableHead>
                                <TableHead className="text-slate-300">Status</TableHead>
                                <TableHead className="text-right text-slate-300"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">Loading Leads...</TableCell>
                                </TableRow>
                            ) : leads.map((lead) => (
                                <TableRow key={lead.id} className="border-white/5 hover:bg-white/5 group">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-200">{lead.name || "Unknown"}</span>
                                            <span className="text-xs text-slate-500 font-mono mt-0.5">{lead.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-400">
                                        {lead.interested_course}
                                        {lead.current_class && <span className="text-slate-600 text-xs ml-1">({lead.current_class})</span>}
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                        {lead.city || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {lead.visit_date ? (
                                            <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20 w-fit">
                                                <Calendar className="h-3 w-3" />
                                                <span className="text-xs font-bold">{formatDate(lead.visit_date)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-600 text-xs">-</span>
                                        )}
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
                                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
