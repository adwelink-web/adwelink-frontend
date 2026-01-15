"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    HelpCircle,
    Send,
    Loader2,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    Clock,
    History
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SupportPage() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [tickets, setTickets] = useState<any[]>([])
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

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
            fetchTickets() // Refresh the list

        } catch (err: any) {
            setError(err.message || "Failed to submit ticket")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            {/* Header - Fixed at top */}
            <div className="flex-shrink-0 px-4 md:px-8 py-6">
                <div className="max-w-6xl mx-auto flex flex-col gap-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                        <HelpCircle className="h-7 w-7 md:h-8 md:w-8 text-orange-400" /> Support Center
                    </h1>
                    <p className="text-slate-400 text-sm">Need help? Submit a support ticket and our team will assist you.</p>
                </div>
            </div>

            {/* Body - Fills remaining space */}
            <div className="flex-1 min-h-0 px-4 md:px-8 overflow-hidden">
                <div className="max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Form - No scroll needed */}
                    <div className="space-y-4 overflow-y-auto lg:overflow-visible custom-scrollbar">
                        {/* Success Message */}
                        {success && (
                            <Card className="bg-emerald-500/10 border-emerald-500/30">
                                <CardContent className="py-4">
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

                        {/* Support Form */}
                        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-white/10 backdrop-blur-md border-orange-500/20 shadow-lg">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white flex items-center gap-2 text-base">
                                    <MessageSquare className="h-4 w-4 text-orange-400" />
                                    New Ticket
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Submit a new issue to our team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-300 text-xs">Subject *</Label>
                                        <Input
                                            placeholder="Brief description"
                                            value={formData.subject}
                                            onChange={(e) => updateField("subject", e.target.value)}
                                            required
                                            className="bg-white/5 border-white/10 focus:border-orange-500/50 h-9"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-slate-300 text-xs">Priority</Label>
                                        <Select
                                            value={formData.priority}
                                            onValueChange={(value) => updateField("priority", value)}
                                        >
                                            <SelectTrigger className="bg-white/5 border-white/10 h-9">
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
                                        <Label className="text-slate-300 text-xs">Description *</Label>
                                        <Textarea
                                            placeholder="Please describe your issue..."
                                            value={formData.description}
                                            onChange={(e) => updateField("description", e.target.value)}
                                            required
                                            className="bg-white/5 border-white/10 focus:border-orange-500/50 min-h-[80px] resize-none"
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
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 rounded-xl shadow-lg shadow-orange-500/25"
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                        Submit Ticket
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Ticket History - Internal scroll */}
                    <div className="flex flex-col min-h-0 overflow-hidden">
                        <div className="flex items-center justify-between mb-3 flex-shrink-0">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <History className="h-4 w-4 text-blue-400" />
                                My Tickets
                            </h2>
                            <Badge variant="outline" className="text-[10px]">{tickets.length} total</Badge>
                        </div>

                        {/* Scrollable ticket list */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
                            {fetching ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                                </div>
                            ) : tickets.length === 0 ? (
                                <Card className="bg-white/5 border-dashed border-white/10 py-8">
                                    <CardContent className="text-center space-y-2">
                                        <Clock className="h-8 w-8 text-slate-600 mx-auto" />
                                        <p className="text-slate-400 text-sm">No ticket history yet</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                tickets.map((ticket) => (
                                    <Card key={ticket.id} className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors overflow-hidden">
                                        <div className={`h-1 w-full ${ticket.status === 'resolved' ? 'bg-emerald-500' :
                                            ticket.status === 'in_progress' ? 'bg-blue-500' :
                                                ticket.status === 'closed' ? 'bg-slate-500' : 'bg-orange-500'
                                            }`} />
                                        <CardContent className="p-3 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-sm font-bold text-white line-clamp-1">{ticket.subject}</h3>
                                                <Badge className={`text-[9px] uppercase shrink-0 ${ticket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                    ticket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                        'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                                    }`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-400 line-clamp-2 italic">"{ticket.description}"</p>
                                            <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                                                <Badge variant="secondary" className="text-[9px] uppercase px-1.5 h-4">
                                                    {ticket.priority}
                                                </Badge>
                                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(ticket.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex-shrink-0 px-4 md:px-8 py-4 border-t border-white/5">
                <div className="max-w-6xl mx-auto space-y-3">
                    {/* FAQ Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { title: "WhatsApp Error?", tip: "Check access token in Settings." },
                            { title: "AI Not Responding?", tip: "Ensure message limit is not reached." },
                            { title: "Need Upgrades?", tip: "Check Billing section for plans." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 px-3 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{item.title}</span>
                                <span className="text-[11px] text-slate-400">{item.tip}</span>
                            </div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="text-center text-xs text-slate-600">
                        <p>Urgent? Email us at <span className="text-white">support@adwelink.com</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
