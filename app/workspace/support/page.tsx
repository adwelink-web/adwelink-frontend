"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    HelpCircle,
    Send,
    Loader2,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    Clock,
    History,
    ArrowLeft,
    Plus,
    ChevronRight
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Ticket {
    id: string
    subject: string
    description: string
    priority: string
    status: string
    created_at: string
}

export default function SupportPage() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [showNewForm, setShowNewForm] = useState(false)

    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        priority: "normal"
    })

    const fetchTickets = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get institute_id
            const { data: staffData }: any = await supabase
                .from("staff_members" as any)
                .select("institute_id")
                .eq("id", user.id)
                .single()

            if (!staffData?.institute_id) return

            const { data: ticketData, error: ticketError }: any = await supabase
                .from("support_tickets" as any)
                .select("*")
                .eq("institute_id", staffData.institute_id)
                .order("created_at", { ascending: false })

            if (ticketError) throw ticketError
            setTickets(ticketData || [])
        } catch (err) {
            console.error("Error fetching tickets:", err)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            const supabase = createClient()

            // Get current user's institute
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            // Get institute_id from staff_members
            const { data: staffData, error: staffError } = await supabase
                .from("staff_members" as any)
                .select("institute_id")
                .eq("id", user.id)
                .single()

            if (staffError || !(staffData as any)?.institute_id) {
                throw new Error("Could not find your institute. Please contact support.")
            }

            const instituteId = (staffData as any).institute_id

            // Insert support ticket
            const { error: insertError } = await supabase
                .from("support_tickets")
                .insert([{
                    institute_id: instituteId,
                    subject: formData.subject,
                    description: formData.description,
                    priority: formData.priority,
                    status: "open"
                }])

            if (insertError) throw insertError

            setSuccess(true)
            setFormData({ subject: "", description: "", priority: "normal" })
            setShowNewForm(false)
            fetchTickets() // Refresh the list

        } catch (err: any) {
            setError(err.message || "Failed to submit ticket")
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'bg-emerald-500'
            case 'in_progress': return 'bg-blue-500'
            case 'closed': return 'bg-slate-500'
            default: return 'bg-orange-500'
        }
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'bg-emerald-500/20 text-emerald-400'
            case 'in_progress': return 'bg-blue-500/20 text-blue-400'
            case 'closed': return 'bg-slate-500/20 text-slate-400'
            default: return 'bg-orange-500/20 text-orange-400'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500/20 text-red-400'
            case 'high': return 'bg-amber-500/20 text-amber-400'
            case 'low': return 'bg-slate-500/20 text-slate-400'
            default: return 'bg-blue-500/20 text-blue-400'
        }
    }

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket)
        setIsSheetOpen(true)
    }

    // Ticket List Component
    const TicketList = () => (
        <div className="space-y-2">
            {fetching ? (
                <div className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center animate-pulse">
                            <Loader2 className="h-6 w-6 text-orange-400 animate-spin" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Loading tickets...</p>
                    </div>
                </div>
            ) : tickets.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <p className="text-white font-medium mt-2 text-sm">No ticket history yet</p>
                        <p className="text-xs text-muted-foreground">Submit your first ticket</p>
                    </div>
                </div>
            ) : (
                tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => handleTicketClick(ticket)}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors space-y-2 cursor-pointer group"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className={`h-2 w-2 rounded-full shrink-0 ${getStatusColor(ticket.status)}`} />
                                <h3 className="text-xs font-bold text-white truncate">{ticket.subject}</h3>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">"{ticket.description}"</p>
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                                <Badge className={`text-[8px] uppercase h-4 px-1 ${getStatusBadgeColor(ticket.status)}`}>
                                    {ticket.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={`text-[8px] uppercase h-4 px-1 ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </Badge>
                            </div>
                            <span className="text-[9px] text-slate-500 flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {new Date(ticket.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    )

    // New Ticket Form Component
    const NewTicketForm = ({ onBack }: { onBack?: () => void }) => (
        <div className="space-y-4">
            {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tickets
                </Button>
            )}

            {success && (
                <Card className="bg-emerald-500/10 border-emerald-500/30">
                    <CardContent className="py-3">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Ticket Submitted!</h3>
                                <p className="text-xs text-emerald-400">Our team will respond within 24 hours.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="bg-gradient-to-br from-orange-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-2 p-3 md:p-4">
                    <CardTitle className="text-white flex items-center gap-2 text-sm">
                        <div className="h-6 w-6 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <MessageSquare className="h-3 w-3 text-orange-400" />
                        </div>
                        New Ticket
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                        Submit a new issue to our team.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-1.5">
                            <Label className="text-slate-300 text-[10px] uppercase font-bold tracking-wider">Subject *</Label>
                            <Input
                                placeholder="Brief description"
                                value={formData.subject}
                                onChange={(e) => updateField("subject", e.target.value)}
                                required
                                className="bg-white/5 border-white/10 focus:border-orange-500/50 h-9 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-slate-300 text-[10px] uppercase font-bold tracking-wider">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => updateField("priority", value)}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 h-9 text-sm">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-slate-300 text-[10px] uppercase font-bold tracking-wider">Description *</Label>
                            <Textarea
                                placeholder="Please describe your issue..."
                                value={formData.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                required
                                className="bg-white/5 border-white/10 focus:border-orange-500/50 min-h-[100px] resize-none text-sm"
                            />
                        </div>

                        {error && (
                            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                                <AlertCircle className="h-3 w-3" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || !formData.subject || !formData.description}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-9 text-sm rounded-lg"
                        >
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Send className="h-3.5 w-3.5 mr-2" />}
                            Submit Ticket
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

    // Ticket Detail Component
    const TicketDetail = ({ ticket }: { ticket: Ticket }) => (
        <div className="space-y-4">
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(ticket.status)}`} />
                    <Badge className={`text-[9px] uppercase ${getStatusBadgeColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={`text-[9px] uppercase ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                    </Badge>
                </div>

                <h2 className="text-lg font-bold text-white">{ticket.subject}</h2>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>
                        Created on {new Date(ticket.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Description</p>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-wider text-orange-400 font-bold mb-2">Status Update</p>
                <p className="text-xs text-slate-400">
                    {ticket.status === 'open' && "Your ticket is open and awaiting response from our team."}
                    {ticket.status === 'in_progress' && "Our team is actively working on your issue."}
                    {ticket.status === 'resolved' && "This issue has been resolved. Contact us if you need more help."}
                    {ticket.status === 'closed' && "This ticket has been closed."}
                </p>
            </div>
        </div>
    )

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative p-4 md:p-8">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Header - Compact */}
            <div className="flex-none flex items-center justify-between z-10 mb-4 max-w-7xl mx-auto w-full">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center ring-1 ring-orange-500/30">
                            <HelpCircle className="h-4 w-4 text-orange-500" />
                        </div>
                        Support Center
                        <Badge className="h-5 px-1.5 text-[10px] bg-orange-500/20 text-orange-400">
                            {tickets.length}
                        </Badge>
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 hidden md:block">Need help? Submit a support ticket and our team will assist you</p>
                </div>
                {/* Mobile: Opens Sheet */}
                <Button
                    onClick={() => { setSelectedTicket(null); setShowNewForm(true); setIsSheetOpen(true); }}
                    size="sm"
                    className="md:hidden h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white gap-1.5"
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
                {/* Desktop: Toggles inline form */}
                <Button
                    onClick={() => { setSelectedTicket(null); setShowNewForm(true); }}
                    size="sm"
                    className="hidden md:flex h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white gap-1.5"
                >
                    <Plus className="h-3.5 w-3.5" />
                    New Ticket
                </Button>
            </div>

            {/* Body - Desktop: Side by side, Mobile: List only */}
            <div className="flex-1 min-h-0 overflow-y-auto z-10 custom-scrollbar">
                <div className="max-w-7xl mx-auto pb-4">
                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-2 md:gap-6">
                        {/* Left: Ticket List */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <History className="h-3 w-3 text-blue-400" />
                                    </div>
                                    My Tickets
                                </h2>
                                <Badge variant="outline" className="text-[9px] h-5 px-1.5">{tickets.length} total</Badge>
                            </div>
                            <TicketList />
                        </div>

                        {/* Right: Form or Detail */}
                        <div>
                            {selectedTicket && !showNewForm ? (
                                <div className="space-y-3">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)} className="-ml-2 text-slate-400 hover:text-white">
                                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                                    </Button>
                                    <TicketDetail ticket={selectedTicket} />
                                </div>
                            ) : (
                                <NewTicketForm onBack={showNewForm ? () => setShowNewForm(false) : undefined} />
                            )}
                        </div>
                    </div>

                    {/* Mobile Layout - List Only */}
                    <div className="md:hidden space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                <div className="h-6 w-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <History className="h-3 w-3 text-blue-400" />
                                </div>
                                My Tickets
                            </h2>
                            <Badge variant="outline" className="text-[9px] h-5 px-1.5">{tickets.length} total</Badge>
                        </div>
                        <TicketList />
                    </div>
                </div>
            </div>



            {/* Mobile Sheet - Ticket Detail or New Form */}
            <Sheet open={isSheetOpen} onOpenChange={(open) => { setIsSheetOpen(open); if (!open) { setShowNewForm(false); } }}>
                <SheetContent side="bottom" className="h-[85vh] bg-[#0F131E] border-t border-white/10 p-0 flex flex-col text-slate-200">
                    <SheetHeader className="p-4 bg-transparent border-b border-white/5">
                        <SheetTitle className="text-white flex items-center gap-2">
                            {showNewForm ? (
                                <>
                                    <MessageSquare className="h-5 w-5 text-orange-500" />
                                    New Ticket
                                </>
                            ) : (
                                <>
                                    <HelpCircle className="h-5 w-5 text-orange-500" />
                                    Ticket Details
                                </>
                            )}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {showNewForm ? (
                            <NewTicketForm />
                        ) : selectedTicket ? (
                            <TicketDetail ticket={selectedTicket} />
                        ) : null}
                    </div>
                </SheetContent>
            </Sheet>


        </div>
    )
}
