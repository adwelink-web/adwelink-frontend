"use client"

import * as React from "react"
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
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Search, Filter, MessageCircle, MoreHorizontal, TrendingUp, Smile, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"
import type { Tables } from "@/lib/database.types"

type Lead = Tables<"leads">

export default function LeadsPage() {
    const [leads, setLeads] = React.useState<Lead[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchLeads = async () => {
            const supabase = createClient()

            // Fetch leads sorted by latest contact
            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .order("last_contact_at", { ascending: false })
                .limit(20)

            if (error) {
                console.error("Supabase Leads Error:", error)
            } else {
                setLeads(data || [])
            }
            setLoading(false)
        }

        fetchLeads()
    }, [])

    const getStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case "hot": return "bg-red-500/10 text-red-400 border-red-500/20";
            case "warm": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            case "cold": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "enrolled": return "bg-green-500/10 text-green-400 border-green-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    }

    const getSentimentIcon = (score: number | null) => {
        if (score === null) return <span className="text-slate-500">-</span>
        if (score > 60) return <Smile className="h-4 w-4 text-green-400" />
        if (score < 30) return <AlertCircle className="h-4 w-4 text-red-400" />
        return <span className="text-yellow-400 text-xs font-bold">NEUTRAL</span>
    }

    const getConversionBadge = (prob: number | null) => {
        if (prob === null) return <span className="text-slate-500">-</span>
        const percentage = Math.round(prob) // Assuming 0-100 or 0-1, let's treat as integer % for now based on typical n8n output
        let color = "text-slate-400"
        if (percentage > 70) color = "text-green-400"
        else if (percentage > 40) color = "text-yellow-400"

        return (
            <div className={`flex items-center gap-1 ${color} font-mono text-xs`}>
                <TrendingUp className="h-3 w-3" />
                {percentage}%
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Lead Pipeline</h2>
                    <p className="text-muted-foreground mt-1">Manage and track potential students across all channels.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                        Export CSV
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Add Manual Lead
                    </Button>
                </div>
            </div>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Active Leads (Aditi)</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search leads..." className="pl-8 w-[250px] bg-black/20 border-white/10 text-white" />
                            </div>
                            <Button variant="outline" size="icon" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="text-slate-400">Name</TableHead>
                                <TableHead className="text-slate-400">Interest</TableHead>
                                <TableHead className="text-slate-400">AI Sentiment</TableHead>
                                <TableHead className="text-slate-400">Conversion %</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400">Assigned</TableHead>
                                <TableHead className="text-right text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-slate-500 py-10">
                                        Connecting to Supabase Neural Link...
                                    </TableCell>
                                </TableRow>
                            ) : leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-slate-500 py-10">
                                        No active leads found in database.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leads.map((lead) => (
                                    <TableRow key={lead.id} className="border-white/10 hover:bg-white/5">
                                        <TableCell className="font-medium text-slate-200">
                                            <div>{lead.name || "Unknown"}</div>
                                            <div className="text-xs text-muted-foreground">{lead.phone}</div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{lead.interest_area || "N/A"}</TableCell>
                                        <TableCell>
                                            {getSentimentIcon(lead.sentiment_score)}
                                        </TableCell>
                                        <TableCell>
                                            {getConversionBadge(lead.conversion_probability)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(lead.status)}>
                                                {lead.status || "New"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-300 text-xs">{lead.assigned_agent_slug || "Unassigned"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-purple-400">
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-slate-400">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
