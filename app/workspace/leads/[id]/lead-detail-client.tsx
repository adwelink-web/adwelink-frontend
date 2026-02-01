"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Phone, Mail, Calendar, User, Users, GraduationCap, MapPin, MessageSquare, Edit3, Save, X, Clock, Globe, Activity, CalendarClock, History, Sparkles, LayoutList, MoreVertical, CheckCircle, UserCheck, GraduationCap as Admission } from "lucide-react"
import Link from "next/link"
import { updateLead } from "../actions"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Lead {
    id: string
    name: string | null
    phone: string
    current_class: string | null
    interested_course: string | null
    city: string | null
    status: string | null
    lead_score: number | null
    source: string | null
    visit_date: string | null
    visit_type: string | null
    next_followup: string | null
    ai_notes: string | null
    created_at: string | null
    updated_at: string | null
    parent_name: string | null
    parent_phone: string | null
    budget_range: string | null
    preferred_mode: string | null
    target_year: string | null
    admission_chances: number | null
    tags: string[] | null
}

interface ChatMessage {
    id: string
    user_message: string | null
    ai_response: string | null
    created_at: string | null
    sentiment: string | null
    intent: string | null
    lead_score: number | null
    admission_chances: number | null
    ai_notes: string | null
}

interface Props {
    lead: Lead
    chatHistory: ChatMessage[]
}

export default function LeadDetailClient({ lead, chatHistory }: Props) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [editData, setEditData] = React.useState(lead)
    const [saving, setSaving] = React.useState(false)
    const [isChatOpen, setIsChatOpen] = React.useState(false)
    const router = useRouter()


    const handleSave = async () => {
        setSaving(true)
        try {
            await updateLead(lead.id, {
                name: editData.name,
                phone: editData.phone,
                current_class: editData.current_class,
                interested_course: editData.interested_course,
                city: editData.city,
                status: editData.status,
                // lead_score: editData.lead_score, // Not in DB yet
                source: editData.source,
                visit_date: editData.visit_date,
                visit_type: editData.visit_type,
                next_followup: editData.next_followup,
                ai_notes: editData.ai_notes,
                parent_name: editData.parent_name,
                parent_phone: editData.parent_phone,
                budget_range: editData.budget_range,
                preferred_mode: editData.preferred_mode,
                target_year: editData.target_year,
                // admission_chances: editData.admission_chances, // Not in DB yet
            })
            setIsEditing(false)
            router.refresh()
        } catch (error) {
            console.error("Failed to save:", error)
        } finally {
            setSaving(false)
        }
    }

    // Get latest AI insights directly from chat history (AI already calculates these)
    const getLatestAIInsights = () => {
        // Get latest message that has AI data
        const latestWithData = [...chatHistory].reverse().find(msg => // Simplified lead view
            // removed lead_score and is_ai_paused checksull
            msg.ai_notes !== null
        )

        const latestMessage = chatHistory[chatHistory.length - 1]

        return {
            leadScore: latestWithData?.lead_score ?? lead.lead_score ?? 5,
            admissionChances: latestWithData?.admission_chances ?? lead.admission_chances ?? 50,
            aiNotes: latestWithData?.ai_notes ?? lead.ai_notes ?? "No AI analysis available.",
            sentiment: latestMessage?.sentiment ?? "neutral",
            intent: latestMessage?.intent ?? "general",
            totalMessages: chatHistory.length
        }
    }

    const aiInsights = getLatestAIInsights()


    const getStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'visit_scheduled': return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'visit_confirmed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            case 'not_interested': return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            case 'new_inquiry': return 'bg-sky-500/20 text-sky-400 border-sky-500/30'
            case 'new': return 'bg-sky-500/20 text-sky-400 border-sky-500/30'
            case 'admitted': return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
            case 'hot': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            case 'converted': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            case 'cold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
        }
    }

    const handleQuickStatusUpdate = async (newStatus: string) => {
        try {
            await updateLead(lead.id, { status: newStatus })
            router.refresh()
        } catch (error) {
            console.error("Failed to update status:", error)
        }
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        })
    }

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 h-[100dvh] md:h-[calc(100vh-20px)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/workspace/leads">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{lead.name || "Unknown Lead"}</h1>
                        <p className="text-muted-foreground">{lead.phone}</p>
                    </div>
                    <Badge className={getStatusColor(lead.status)}>
                        {lead.status || "New"}
                    </Badge>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="hidden md:flex" onClick={() => setIsChatOpen(true)}>
                        <MessageSquare className="h-4 w-4 mr-2" /> Chat
                    </Button>
                    <Button variant="outline" onClick={() => { setEditData(lead); setIsEditing(true); }}>
                        <Edit3 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0 max-w-7xl mx-auto w-full overflow-hidden">
                {/* Lead Info Card */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-violet-500/5 via-[#0F131E]/80 to-[#0F131E]/60 backdrop-blur-2xl border-white/10 shadow-2xl shadow-violet-500/5 flex flex-col min-h-0 overflow-hidden py-0 gap-0 pb-2 relative group">
                    {/* Ambient Top Glow */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-50" />

                    <CardHeader className="flex flex-row items-center justify-between px-4 py-2 flex-none">
                        <div>
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                                <User className="h-4 w-4 text-violet-500" />
                                Lead Info
                            </CardTitle>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Contact details & status</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 w-8 hover:bg-white/10">
                                <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 bg-[#0F131E]/95 backdrop-blur-xl border-white/10 text-slate-200">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleQuickStatusUpdate('new')}>
                                    <Activity className="h-4 w-4 mr-2 text-sky-400" />
                                    New
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleQuickStatusUpdate('visit_scheduled')}>
                                    <Calendar className="h-4 w-4 mr-2 text-green-400" />
                                    Visit Scheduled
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleQuickStatusUpdate('visit_confirmed')}>
                                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-400" />
                                    Visit Confirmed
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleQuickStatusUpdate('converted')}>
                                    <UserCheck className="h-4 w-4 mr-2 text-violet-400" />
                                    Lead Converted
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleQuickStatusUpdate('not_interested')}>
                                    <X className="h-4 w-4 mr-2 text-rose-400" />
                                    Not Interested
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 p-4 text-sm">
                        {/* Profile Header - Centered */}
                        <div className="flex flex-col items-center justify-center text-center gap-2 pb-2">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold border-2 border-white/20 shadow-2xl shadow-violet-500/30 mb-1">
                                {lead.name ? lead.name.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
                            </div>
                            <div className="space-y-0.5">
                                <h2 className="text-xl font-bold text-white tracking-tight">{lead.name || "Unknown Lead"}</h2>
                                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 opacity-70">
                                    <span className="opacity-50">ID:</span> {lead.id.slice(0, 8)}
                                </p>
                            </div>
                            <Badge className={`${getStatusColor(lead.status)} border px-3 py-0.5 text-[10px] uppercase tracking-wider shadow-sm mt-1`}>
                                {lead.status?.replace('_', ' ') || "New"}
                            </Badge>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Scores Row */}
                        <div className="flex gap-3">
                            <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5">
                                <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
                                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <path
                                            className={`${aiInsights.leadScore > 7 ? "text-emerald-500" : "text-amber-500"}`}
                                            strokeDasharray={`${aiInsights.leadScore * 10}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-xs font-bold text-white">{aiInsights.leadScore}</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">Score</span>
                                    <span className="text-[9px] text-muted-foreground">Lead</span>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5">
                                <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
                                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <path
                                            className={`${aiInsights.admissionChances > 70 ? "text-cyan-500" : "text-rose-500"}`}
                                            strokeDasharray={`${aiInsights.admissionChances}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-[10px] font-bold text-white">{aiInsights.admissionChances}%</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">Chance</span>
                                    <span className="text-[9px] text-muted-foreground">Admission</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Notes */}
                        <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Aditi's Notes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={`text-[9px] py-0 ${aiInsights.sentiment?.toLowerCase().includes('excited') || aiInsights.sentiment?.toLowerCase().includes('curious') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                                        {aiInsights.sentiment}
                                    </Badge>
                                    <Badge className="text-[9px] py-0 bg-sky-500/10 text-sky-300 border-sky-500/20">
                                        {aiInsights.intent?.replace(/_/g, ' ')}
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-sm text-slate-200 leading-relaxed">
                                {aiInsights.aiNotes}
                            </p>
                            <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                                {aiInsights.totalMessages} messages exchanged
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chat History Card (Desktop Only) */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-violet-500/5 via-[#0F131E]/80 to-[#0F131E]/60 backdrop-blur-2xl border-white/10 shadow-xl hidden lg:flex flex-col md:h-full flex-1 min-h-0 overflow-hidden relative">
                    {/* Ambient Top Glow */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-30" />

                    <CardHeader className="flex flex-col justify-center gap-0.5 py-2 px-5 flex-none border-b border-white/5 bg-[#0F131E]/30">
                        <div className="flex items-center gap-2 leading-none">
                            <LayoutList className="h-3.5 w-3.5 text-violet-500" />
                            <CardTitle className="text-sm font-bold text-white leading-none mt-0.5">Lead Profile</CardTitle>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-none">Comprehensive lead details</p>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 overflow-hidden flex flex-col p-0 bg-[#0F131E]/20">
                        {/* 2. PROFILE DETAILS SECTION (Scrollable Container) */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
                            <div className="space-y-4">


                                {/* Data Grid */}
                                {/* Data Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 px-1">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Student Info</h3>

                                        <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</span>
                                            <span className="text-sm text-slate-200 font-semibold text-right break-all selection:bg-violet-500/30">{lead.phone}</span>
                                        </div>
                                        <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">City</span>
                                            <span className="text-sm text-slate-200 font-semibold text-right">{lead.city || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class</span>
                                            <span className="text-sm text-slate-200 font-semibold text-right">{lead.current_class || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Course</span>
                                            <span className="text-sm text-slate-200 font-semibold text-right">{lead.interested_course || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Year</span>
                                            <span className="text-sm text-slate-200 font-semibold text-right">{lead.target_year || "2025-26"}</span>
                                        </div>
                                        <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mode</span>
                                            <span className="text-sm text-slate-200 font-semibold text-right">{lead.preferred_mode || "-"}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6 md:border-l md:border-white/5 md:pl-12">

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Parent & Other</h3>

                                            <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Parent Name</span>
                                                <span className="text-sm text-slate-200 font-semibold text-right">{lead.parent_name || "-"}</span>
                                            </div>
                                            <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Parent Phone</span>
                                                <span className="text-sm text-slate-200 font-semibold text-right">{lead.parent_phone || "-"}</span>
                                            </div>
                                            <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Budget</span>
                                                <span className="text-sm text-slate-200 font-semibold text-right">{lead.budget_range || "-"}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Visit & Status</h3>

                                            <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Follow-up</span>
                                                <span className="text-sm text-emerald-400 font-bold text-right">{lead.next_followup ? formatDate(lead.next_followup) : "-"}</span>
                                            </div>
                                            <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Visit Date</span>
                                                <span className="text-sm text-slate-200 font-semibold text-right">{lead.visit_date ? formatDate(lead.visit_date) : "-"}</span>
                                            </div>
                                            <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Visit Type</span>
                                                <span className="text-sm text-slate-200 font-semibold text-right">{lead.visit_type || "-"}</span>
                                            </div>
                                            <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Source</span>
                                                <span className="text-sm text-slate-200 font-semibold text-right">{lead.source || "Direct"}</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile Chat FAB & Sheet */}
            <div className="lg:hidden">
                <div className="fixed bottom-6 right-6 z-50">
                    <Button size="icon" className="h-14 w-14 rounded-full shadow-xl bg-violet-600 hover:bg-violet-700 text-white" onClick={() => setIsChatOpen(true)}>
                        <MessageSquare className="h-6 w-6" />
                    </Button>
                </div>

                <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                    <SheetContent side="bottom" className="h-[85vh] bg-[#0F131E] border-t border-white/10 p-0 flex flex-col text-slate-200">
                        <SheetHeader className="p-4 bg-transparent">
                            <SheetTitle className="text-white flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-violet-500" />
                                Conversation History
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <div className="space-y-4">
                                {chatHistory.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">No conversation history yet</p>
                                ) : (
                                    chatHistory.map((msg) => (
                                        <div key={msg.id} className="space-y-2">
                                            {/* User Message */}
                                            {msg.user_message && (
                                                <div className="flex justify-end">
                                                    <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg px-4 py-2 max-w-[85%]">
                                                        <p className="text-sm">{msg.user_message}</p>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {formatDate(msg.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {/* AI Response */}
                                            {msg.ai_response && (
                                                <div className="flex justify-start">
                                                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 max-w-[85%]">
                                                        <p className="text-sm">{msg.ai_response}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {formatDate(msg.created_at)}
                                                            </span>
                                                            {msg.intent && (
                                                                <Badge variant="outline" className="text-[10px] h-4">
                                                                    {msg.intent}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* EDIT LEAD DIALOG POPUP */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="bg-[#0B0F19] border-white/10 text-white max-w-md p-0 overflow-hidden outline-none shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-2xl max-h-[80vh]">
                    <DialogHeader className="p-4 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-violet-500/10 border-violet-500/20 text-violet-400">
                                <Edit3 className="h-4 w-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold">
                                    Edit Lead
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 text-[10px]">
                                    Update lead information
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-4 space-y-4 overflow-y-auto max-h-[55vh]">
                        {/* Basic Info */}
                        <div className="space-y-3">
                            <h4 className="text-[9px] font-bold text-sky-400 uppercase tracking-wider">Basic Info</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Name</label>
                                    <Input
                                        placeholder="Student Name"
                                        value={editData.name || ""}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Phone</label>
                                    <Input
                                        placeholder="Phone"
                                        value={editData.phone || ""}
                                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">City</label>
                                    <Input
                                        placeholder="City"
                                        value={editData.city || ""}
                                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Class</label>
                                    <Input
                                        placeholder="e.g. 12th"
                                        value={editData.current_class || ""}
                                        onChange={(e) => setEditData({ ...editData, current_class: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Source</label>
                                    <Input
                                        placeholder="e.g. Facebook, Website"
                                        value={editData.source || ""}
                                        onChange={(e) => setEditData({ ...editData, source: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Status</label>
                                    <Input
                                        placeholder="e.g. new, contacted"
                                        value={editData.status || ""}
                                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Parent Info */}
                        <div className="pt-3 border-t border-white/5">
                            <h4 className="text-[9px] font-bold text-pink-400 uppercase tracking-wider mb-3">Parent Info</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Parent Name</label>
                                    <Input
                                        placeholder="Parent Name"
                                        value={editData.parent_name || ""}
                                        onChange={(e) => setEditData({ ...editData, parent_name: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Parent Phone</label>
                                    <Input
                                        placeholder="Parent Phone"
                                        value={editData.parent_phone || ""}
                                        onChange={(e) => setEditData({ ...editData, parent_phone: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Interest */}
                        <div className="pt-3 border-t border-white/5">
                            <h4 className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-3">Academic Interest</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Course</label>
                                    <Input
                                        placeholder="Interested Course"
                                        value={editData.interested_course || ""}
                                        onChange={(e) => setEditData({ ...editData, interested_course: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Target Year</label>
                                    <Input
                                        placeholder="e.g. 2025-26"
                                        value={editData.target_year || ""}
                                        onChange={(e) => setEditData({ ...editData, target_year: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Preferred Mode</label>
                                    <Input
                                        placeholder="Online/Offline/Hybrid"
                                        value={editData.preferred_mode || ""}
                                        onChange={(e) => setEditData({ ...editData, preferred_mode: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Budget Range</label>
                                    <Input
                                        placeholder="e.g. 50k-1L"
                                        value={editData.budget_range || ""}
                                        onChange={(e) => setEditData({ ...editData, budget_range: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Scores & Visit */}
                        <div className="pt-3 border-t border-white/5">
                            <h4 className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-3">Scores & Visit</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Lead Score</label>
                                    <Input
                                        type="number"
                                        placeholder="0-10"
                                        value={editData.lead_score || ""}
                                        onChange={(e) => setEditData({ ...editData, lead_score: parseInt(e.target.value) || 0 })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Admission %</label>
                                    <Input
                                        type="number"
                                        placeholder="0-100"
                                        value={editData.admission_chances || ""}
                                        onChange={(e) => setEditData({ ...editData, admission_chances: parseInt(e.target.value) || 0 })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Visit Type</label>
                                    <Input
                                        placeholder="e.g. Campus Tour"
                                        value={editData.visit_type || ""}
                                        onChange={(e) => setEditData({ ...editData, visit_type: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Visit Date</label>
                                    <Input
                                        type="date"
                                        value={editData.visit_date || ""}
                                        onChange={(e) => setEditData({ ...editData, visit_date: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Next Follow-up</label>
                                    <Input
                                        type="date"
                                        value={editData.next_followup || ""}
                                        onChange={(e) => setEditData({ ...editData, next_followup: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-8 text-sm rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="pt-3 border-t border-white/5">
                            <h4 className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mb-3">AI Notes</h4>
                            <textarea
                                placeholder="Add notes about this lead..."
                                value={editData.ai_notes || ""}
                                onChange={(e) => setEditData({ ...editData, ai_notes: e.target.value })}
                                className="w-full h-20 bg-white/[0.03] border border-white/10 text-white text-sm rounded-lg p-2 resize-none"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 border-t border-white/5 flex gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white h-9 font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                        >
                            <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            disabled={saving}
                            className="flex-1 border-white/10 bg-white/5 text-slate-400 hover:text-white h-9 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <X className="h-3.5 w-3.5" /> Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
