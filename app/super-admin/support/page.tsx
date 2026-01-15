"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    HelpCircle,
    MessageSquare,
    Loader2,
    CheckCircle,
    Clock,
    PlayCircle,
    XCircle,
    RefreshCw
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type Ticket = {
    id: string
    subject: string
    description: string | null
    status: string | null
    priority: string | null
    created_at: string | null
    updated_at: string | null
    resolved_at: string | null
    institute_id: string | null
    institutes?: { name: string } | null
}

const STATUS_OPTIONS = [
    { value: "open", label: "Open", icon: Clock, color: "text-orange-500 bg-orange-500/10 border-orange-500/30" },
    { value: "in_progress", label: "In Progress", icon: PlayCircle, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
    { value: "resolved", label: "Resolved", icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" },
    { value: "closed", label: "Closed", icon: XCircle, color: "text-slate-500 bg-slate-500/10 border-slate-500/30" },
]

export default function SupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [adminNote, setAdminNote] = useState("")
    const [filter, setFilter] = useState<string>("all")

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("support_tickets")
                .select(`*, institutes ( name )`)
                .order("created_at", { ascending: false })

            if (error) throw error
            setTickets(data || [])
        } catch (err) {
            console.error("Error fetching tickets:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const updateTicketStatus = async (ticketId: string, newStatus: string) => {
        setUpdating(ticketId)
        try {
            const supabase = createClient()

            const updateData: any = {
                status: newStatus,
                updated_at: new Date().toISOString()
            }

            // Set resolved_at timestamp when resolved
            if (newStatus === "resolved" || newStatus === "closed") {
                updateData.resolved_at = new Date().toISOString()
            }

            const { error } = await supabase
                .from("support_tickets")
                .update(updateData)
                .eq("id", ticketId)

            if (error) throw error

            // Optimistic update
            setTickets(prev => prev.map(t =>
                t.id === ticketId
                    ? { ...t, status: newStatus, updated_at: updateData.updated_at, resolved_at: updateData.resolved_at || t.resolved_at }
                    : t
            ))

            // Close dialog if open
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null)
            }

        } catch (err) {
            console.error("Error updating ticket:", err)
            alert("Failed to update status")
        } finally {
            setUpdating(null)
        }
    }

    const getStatusConfig = (status: string) => {
        return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
    }

    const filteredTickets = filter === "all"
        ? tickets
        : tickets.filter(t => t.status === filter)

    const ticketCounts = {
        all: tickets.length,
        open: tickets.filter(t => t.status === "open").length,
        in_progress: tickets.filter(t => t.status === "in_progress").length,
        resolved: tickets.filter(t => t.status === "resolved").length,
        closed: tickets.filter(t => t.status === "closed").length,
    }

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            {/* Header - Fixed at top */}
            <div className="flex-shrink-0 px-4 md:px-8 py-4 border-b border-white/5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-orange-500/20 flex items-center justify-center ring-1 ring-orange-500/30">
                                <HelpCircle className="h-4 w-4 text-orange-500" />
                            </div>
                            Support Tickets
                            <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                <span className="text-slate-400">{tickets.length} tickets</span>
                            </span>
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">Manage client support requests and issues</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchTickets}
                            disabled={loading}
                            className="border-white/10 hover:bg-white/5"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filter Tabs - Fixed below header */}
            <div className="flex-shrink-0 px-4 md:px-8 py-3 border-b border-white/5">
                <div className="flex flex-wrap gap-2 max-w-7xl mx-auto">
                    {[
                        { value: "all", label: "All" },
                        { value: "open", label: "Open" },
                        { value: "in_progress", label: "In Progress" },
                        { value: "resolved", label: "Resolved" },
                        { value: "closed", label: "Closed" },
                    ].map(tab => (
                        <Button
                            key={tab.value}
                            variant={filter === tab.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(tab.value)}
                            className={filter === tab.value
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "border-white/10 hover:bg-white/5"
                            }
                        >
                            {tab.label}
                            <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5">
                                {ticketCounts[tab.value as keyof typeof ticketCounts]}
                            </Badge>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Ticket List - Scrollable area */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 md:px-8 py-4">
                <div className="max-w-7xl mx-auto space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="text-center py-20 bg-gradient-to-br from-orange-500/5 to-transparent rounded-3xl border border-white/10 border-dashed">
                            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white">No tickets found</h3>
                            <p className="text-muted-foreground text-sm">
                                {filter === "all" ? "Great! No open issues to resolve." : `No ${filter.replace('_', ' ')} tickets.`}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredTickets.map((ticket) => {
                                const statusConfig = getStatusConfig(ticket.status || 'open')
                                const StatusIcon = statusConfig.icon

                                return (
                                    <Card
                                        key={ticket.id}
                                        className="bg-gradient-to-br from-white/5 to-transparent border-white/10 backdrop-blur-md shadow-lg hover:bg-white/10 transition-colors cursor-pointer"
                                        onClick={() => { setSelectedTicket(ticket); setDialogOpen(true) }}
                                    >
                                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge className={`uppercase text-[10px] ${statusConfig.color}`}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {(ticket.status || 'open').replace('_', ' ')}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={`uppercase text-[10px] ${ticket.priority === 'urgent' ? 'border-red-500 text-red-500' :
                                                                ticket.priority === 'high' ? 'border-orange-500 text-orange-500' :
                                                                    'border-slate-500 text-slate-500'
                                                            }`}
                                                    >
                                                        {ticket.priority || 'normal'}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-base font-bold text-white">{ticket.subject}</CardTitle>
                                                {ticket.institutes && (
                                                    <CardDescription className="text-xs text-muted-foreground">
                                                        Client: <span className="text-white/70">{ticket.institutes.name}</span>
                                                    </CardDescription>
                                                )}
                                            </div>

                                            {/* Status Dropdown - Click stops propagation */}
                                            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                <Select
                                                    value={ticket.status || 'open'}
                                                    onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                                                    disabled={updating === ticket.id}
                                                >
                                                    <SelectTrigger className="w-[140px] h-8 text-xs bg-white/5 border-white/10">
                                                        {updating === ticket.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <SelectValue />
                                                        )}
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {STATUS_OPTIONS.map(status => (
                                                            <SelectItem key={status.value} value={status.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <status.icon className="h-3 w-3" />
                                                                    {status.label}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:block">
                                                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '-'}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="text-sm text-slate-300 line-clamp-2">
                                            {ticket.description}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl bg-[#0F131E] border-white/10 text-white">
                    {selectedTicket && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className={getStatusConfig(selectedTicket.status || 'open').color}>
                                        {(selectedTicket.status || 'open').replace('_', ' ')}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px]">
                                        {selectedTicket.priority || 'normal'} priority
                                    </Badge>
                                </div>
                                <DialogTitle className="text-xl">{selectedTicket.subject}</DialogTitle>
                                <DialogDescription>
                                    {selectedTicket.institutes?.name} • Opened {selectedTicket.created_at ? new Date(selectedTicket.created_at).toLocaleString() : '-'}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-4">
                                {/* Description */}
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Description</label>
                                    <div className="mt-1 p-3 bg-white/5 rounded-lg text-sm text-slate-300">
                                        {selectedTicket.description}
                                    </div>
                                </div>

                                {/* Status Update */}
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Update Status</label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {STATUS_OPTIONS.map(status => (
                                            <Button
                                                key={status.value}
                                                variant={selectedTicket.status === status.value ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => updateTicketStatus(selectedTicket.id, status.value)}
                                                disabled={updating === selectedTicket.id || selectedTicket.status === status.value}
                                                className={selectedTicket.status === status.value
                                                    ? status.color.replace('bg-', 'bg-').replace('/10', '')
                                                    : "border-white/10 hover:bg-white/5"
                                                }
                                            >
                                                {updating === selectedTicket.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                ) : (
                                                    <status.icon className="h-3 w-3 mr-1" />
                                                )}
                                                {status.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Resolution Info */}
                                {selectedTicket.resolved_at && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                        <p className="text-xs text-emerald-400">
                                            <CheckCircle className="h-3 w-3 inline mr-1" />
                                            Resolved on {new Date(selectedTicket.resolved_at).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {/* Admin Note (Future: can be saved to DB) */}
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Admin Note (internal)</label>
                                    <Textarea
                                        className="mt-1 bg-white/5 border-white/10 text-sm"
                                        placeholder="Add internal notes about this ticket..."
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
