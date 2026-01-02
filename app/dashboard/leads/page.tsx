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
import { Search, Filter, MessageCircle, MoreHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function LeadsPage() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const [leads, setLeads] = React.useState<any[]>([])
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
                console.error("Error fetching leads:", error)
            } else {
                // Transform data to match UI needs
                const mappedLeads = data?.map((lead: any) => ({
                    id: lead.phone,
                    name: lead.name || "Unknown Lead",
                    phone: lead.phone,
                    interest: "General Inquiry",
                    status: lead.status || "new",
                    lastActive: lead.last_contact_at ? new Date(lead.last_contact_at).toLocaleTimeString() : "N/A",
                    agent: "Aditi"
                })) || []
                setLeads(mappedLeads)
            }
            setLoading(false)
        }

        fetchLeads()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Hot": return "bg-red-500/10 text-red-400 border-red-500/20";
            case "Warm": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            case "Cold": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "Enrolled": return "bg-green-500/10 text-green-400 border-green-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
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
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400">Assigned Agent</TableHead>
                                <TableHead className="text-slate-400">Last Active</TableHead>
                                <TableHead className="text-right text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                                        Connecting to Supabase Neural Link...
                                    </TableCell>
                                </TableRow>
                            ) : leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                                        No active leads found in database.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leads.map((lead) => (
                                    <TableRow key={lead.id} className="border-white/10 hover:bg-white/5">
                                        <TableCell className="font-medium text-slate-200">
                                            <div>{lead.name}</div>
                                            <div className="text-xs text-muted-foreground">{lead.phone}</div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{lead.interest}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(lead.status)}>
                                                {lead.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{lead.agent}</TableCell>
                                        <TableCell className="text-slate-400">{lead.lastActive}</TableCell>
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
