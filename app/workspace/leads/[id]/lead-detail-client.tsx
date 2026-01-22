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
                current_class: editData.current_class,
                interested_course: editData.interested_course,
                city: editData.city,
                status: editData.status,
                lead_score: editData.lead_score,
                next_followup: editData.next_followup,
                ai_notes: editData.ai_notes,
            })
            setIsEditing(false)
            router.refresh()
        } catch (error) {
            console.error("Failed to save:", error)
        } finally {
            setSaving(false)
        }
    }

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
                        {isEditing ? (
                            <Input
                                value={editData.name || ""}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                placeholder="Name"
                                className="h-9 text-xl font-bold bg-transparent border-white/20 mb-1"
                            />
                        ) : (
                            <h1 className="text-2xl font-bold text-white">{lead.name || "Unknown Lead"}</h1>
                        )}
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
                    {isEditing ? (
                        <>
                            <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={saving}>
                                <X className="h-4 w-4 mr-2" /> Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save"}
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                            <Edit3 className="h-4 w-4 mr-2" /> Edit
                        </Button>
                    )}
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
                            <DropdownMenuContent align="end" className="w-44">
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
                    <CardContent className="flex flex-col gap-4 px-4 md:px-5 pb-4 md:pb-6 pt-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar text-sm relative">
                        {/* 0. PROFILE HEADER: Avatar, Name & Status */}
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
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />

                        {/* 1. HERO SECTION: AI Insights & Scores */}
                        <div className="flex flex-col xl:flex-row gap-4 shrink-0">
                            {/* Left: AI Notes (Premium Glass Box) */}
                            <div className="flex-1 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl p-4 md:p-5 relative overflow-hidden group">
                                {/* Ambient Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-[50px] rounded-full pointer-events-none -mr-10 -mt-10" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center gap-2 text-violet-300 mb-3">
                                        <div className="h-6 w-6 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                                            <Sparkles className="h-3 w-3" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Aditi's Insight</span>
                                    </div>
                                    <p className="text-sm text-slate-200 leading-relaxed font-medium line-clamp-3 hover:line-clamp-none transition-all duration-300">
                                        {lead.ai_notes || "No AI analysis available at this moment."}
                                    </p>

                                    {lead.tags && lead.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {lead.tags.map(tag => (
                                                <Badge key={tag} className="h-5 text-[10px] px-2 bg-violet-500/10 text-violet-200 border border-violet-500/20 hover:bg-violet-500/20">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: The "Radio Buttons" (Dials) */}
                            <div className="flex xl:flex-col gap-3 shrink-0">
                                {/* Score Dial */}
                                <div className="flex-1 xl:flex-none flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 px-4 min-w-[140px]">
                                    <div className="relative h-12 w-12 flex items-center justify-center">
                                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                            <path
                                                className={`${(lead.lead_score || 0) > 7 ? "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"}`}
                                                strokeDasharray={`${(lead.lead_score || 0) * 10}, 100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="absolute text-sm font-bold text-white">{lead.lead_score || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-slate-300">Lead Score</span>
                                        <span className="text-[10px] text-muted-foreground">Out of 10</span>
                                    </div>
                                </div>

                                {/* Chance Dial */}
                                <div className="flex-1 xl:flex-none flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 px-4 min-w-[140px]">
                                    <div className="relative h-12 w-12 flex items-center justify-center">
                                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                            <path
                                                className={`${(lead.admission_chances || 0) > 70 ? "text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"}`}
                                                strokeDasharray={`${(lead.admission_chances || 0)}, 100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="absolute text-sm font-bold text-white">{lead.admission_chances || 0}<span className="text-[9px]">%</span></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-slate-300">Chance</span>
                                        <span className="text-[10px] text-muted-foreground">Admission</span>
                                    </div>
                                </div>
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
                                            {isEditing ? (
                                                <Input value={editData.city || ""} onChange={(e) => setEditData({ ...editData, city: e.target.value })} className="h-8 w-40 text-xs text-right border-violet-500/30" />
                                            ) : <span className="text-sm text-slate-200 font-semibold text-right">{lead.city || "-"}</span>}
                                        </div>
                                        <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class</span>
                                            {isEditing ? (
                                                <Input value={editData.current_class || ""} onChange={(e) => setEditData({ ...editData, current_class: e.target.value })} className="h-8 w-40 text-xs text-right border-violet-500/30" />
                                            ) : <span className="text-sm text-slate-200 font-semibold text-right">{lead.current_class || "-"}</span>}
                                        </div>
                                        <div className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Course</span>
                                            {isEditing ? (
                                                <Input value={editData.interested_course || ""} onChange={(e) => setEditData({ ...editData, interested_course: e.target.value })} className="h-8 w-40 text-xs text-right border-violet-500/30" />
                                            ) : <span className="text-sm text-slate-200 font-semibold text-right">{lead.interested_course || "-"}</span>}
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
        </div>
    )
}
