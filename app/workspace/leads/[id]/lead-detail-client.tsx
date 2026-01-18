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
                        <h1 className="text-2xl font-bold text-white">{lead.name || "Unknown Lead"}</h1>
                        <p className="text-muted-foreground">{lead.phone}</p>
                    </div>
                    <Badge className={getStatusColor(lead.status)}>
                        {lead.status || "New"}
                    </Badge>
                </div>
                <div className="flex gap-2">
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
                <Card className="lg:col-span-1 bg-white/5 border-white/5 md:bg-gradient-to-br md:from-violet-500/5 md:to-transparent md:border-white/10 md:backdrop-blur-md md:shadow-lg max-h-[60vh] md:max-h-full md:h-full flex flex-col min-h-0 overflow-hidden py-0 gap-0 pb-2">
                    <CardHeader className="flex flex-row items-center justify-between px-4 py-3 flex-none">
                        <div>
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                                <User className="h-4 w-4 text-violet-500" />
                                Lead Info
                            </CardTitle>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Contact details & status</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
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
                    <CardContent className="flex flex-col gap-2 md:gap-4 px-4 md:px-5 pb-2 md:pb-4 pt-1 md:pt-2 flex-1 overflow-y-auto custom-scrollbar text-sm">
                        {/* Top Section: Name/Details & Score Gauge */}
                        <div className="flex justify-between items-start gap-2 mt-2">
                            <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                    {isEditing ? (
                                        <Input
                                            value={editData.name || ""}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            placeholder="Name"
                                            className="h-8 min-w-0"
                                        />
                                    ) : (
                                        <span className="truncate font-semibold text-xl text-white">{lead.name || "-"}</span>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge className={getStatusColor(lead.status)}>
                                        {lead.status || "New"}
                                    </Badge>
                                </div>
                                {/* Visit Scheduled */}
                                {lead.visit_date && (
                                    <div className="flex flex-col mt-3">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Visit Scheduled On</span>
                                        <span className="text-lg font-semibold text-emerald-400">{formatDate(lead.visit_date)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Lead Score Gauge */}
                            <div className="flex flex-col items-center justify-center bg-white/5 p-4 md:p-5 rounded-xl border border-white/10 shrink-0">
                                <div className="relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center">
                                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                        {/* Background Circle */}
                                        <path
                                            className="text-slate-700"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        {/* Progress Circle */}
                                        <path
                                            className={`${(lead.lead_score || 0) > 7 ? "text-emerald-500" : (lead.lead_score || 0) > 4 ? "text-amber-500" : "text-rose-500"}`}
                                            strokeDasharray={`${(lead.lead_score || 0) * 10}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-base md:text-xl font-bold text-white">{lead.lead_score || 0}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-1 font-medium">Score</span>
                            </div>
                        </div>

                        {/* Details Grid - All Fields */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:gap-y-3 mt-4 md:mt-6">
                            <div className="flex items-center gap-2 min-w-0">
                                <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate text-xs">Phone: {lead.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-xs">Parent Phone: {lead.parent_phone || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-xs">Parent: {lead.parent_name || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                {isEditing ? (
                                    <Input
                                        value={editData.city || ""}
                                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                        placeholder="City"
                                        className="h-6 text-xs min-w-0"
                                    />
                                ) : (
                                    <span className="truncate text-xs">City: {lead.city || "-"}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                {isEditing ? (
                                    <Input
                                        value={editData.current_class || ""}
                                        onChange={(e) => setEditData({ ...editData, current_class: e.target.value })}
                                        placeholder="Class"
                                        className="h-6 text-xs min-w-0"
                                    />
                                ) : (
                                    <span className="truncate text-xs">Class: {lead.current_class || "-"}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                {isEditing ? (
                                    <Input
                                        value={editData.interested_course || ""}
                                        onChange={(e) => setEditData({ ...editData, interested_course: e.target.value })}
                                        placeholder="Course"
                                        className="h-6 text-xs min-w-0"
                                    />
                                ) : (
                                    <span className="truncate text-xs">Course: {lead.interested_course || "-"}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-xs">Source: {lead.source || "Direct"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <Activity className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-xs">Visit Type: {lead.visit_type || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <CalendarClock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-xs">Follow-up: {lead.next_followup ? formatDate(lead.next_followup) : "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-xs">Target Year: {lead.target_year || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <Activity className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-xs">Mode: {lead.preferred_mode || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <Activity className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-xs">Budget: {lead.budget_range || "-"}</span>
                            </div>
                        </div>

                        {/* AI Notes - Compact Block pushed to bottom */}
                        {lead.ai_notes && (
                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 md:p-4 space-y-2 mt-auto">
                                <div className="flex items-center gap-1.5 text-violet-300">
                                    <Sparkles className="h-3 w-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Aditi's Insight</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-snug line-clamp-3">
                                    {lead.ai_notes}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Chat History Card (Desktop Only) */}
                <Card className="lg:col-span-2 bg-white/5 border-white/5 md:bg-gradient-to-br md:from-violet-500/5 md:to-transparent md:border-white/10 md:backdrop-blur-md md:shadow-lg hidden lg:flex flex-col md:h-full flex-1 min-h-0 overflow-hidden">
                    <CardHeader className="flex flex-col gap-0 pt-2 pb-0 px-4 flex-none bg-transparent">
                        <div className="space-y-0.5">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                                <MessageSquare className="h-4 w-4 text-violet-500" />
                                Conversation History
                            </CardTitle>
                            <p className="text-[10px] text-muted-foreground">{chatHistory.length} messages logged</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 overflow-hidden flex flex-col px-4 pb-4 pt-0">
                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {chatHistory.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No conversation history yet</p>
                            ) : (
                                chatHistory.map((msg) => (
                                    <div key={msg.id} className="space-y-2">
                                        {/* User Message */}
                                        {msg.user_message && (
                                            <div className="flex justify-end">
                                                <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg px-4 py-2 max-w-[80%]">
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
                                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 max-w-[80%]">
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
        </div >
    )
}
