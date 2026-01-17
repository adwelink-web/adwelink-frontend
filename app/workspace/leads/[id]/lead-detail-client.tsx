"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Phone, Mail, Calendar, User, GraduationCap, MapPin, MessageSquare, Edit3, Save, X, Clock } from "lucide-react"
import Link from "next/link"
import { updateLead } from "../actions"
import { useRouter } from "next/navigation"

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
    next_followup: string | null
    ai_notes: string | null
    created_at: string | null
    updated_at: string | null
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
            case 'hot': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            case 'converted': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            case 'cold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
        }
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead Info Card */}
                <Card className="lg:col-span-1 bg-card border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg">Lead Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {isEditing ? (
                                <Input
                                    value={editData.name || ""}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    placeholder="Name"
                                    className="h-8"
                                />
                            ) : (
                                <span>{lead.name || "-"}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            {isEditing ? (
                                <Input
                                    value={editData.current_class || ""}
                                    onChange={(e) => setEditData({ ...editData, current_class: e.target.value })}
                                    placeholder="Class"
                                    className="h-8"
                                />
                            ) : (
                                <span>{lead.current_class || "-"}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            {isEditing ? (
                                <Input
                                    value={editData.interested_course || ""}
                                    onChange={(e) => setEditData({ ...editData, interested_course: e.target.value })}
                                    placeholder="Interested Course"
                                    className="h-8"
                                />
                            ) : (
                                <span>{lead.interested_course || "-"}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {isEditing ? (
                                <Input
                                    value={editData.city || ""}
                                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                    placeholder="City"
                                    className="h-8"
                                />
                            ) : (
                                <span>{lead.city || "-"}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Visit: {lead.visit_date ? formatDate(lead.visit_date) : "Not scheduled"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Created: {formatDate(lead.created_at)}</span>
                        </div>

                        {/* Lead Score */}
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">Lead Score</span>
                                <span className="text-lg font-bold text-amber-400">{lead.lead_score || 0}/10</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(lead.lead_score || 0) * 10}%` }}
                                />
                            </div>
                        </div>

                        {/* AI Notes */}
                        {lead.ai_notes && (
                            <div className="pt-4 border-t border-white/10">
                                <span className="text-sm text-muted-foreground block mb-2">AI Notes</span>
                                <p className="text-sm bg-white/5 p-3 rounded-lg">{lead.ai_notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Chat History Card */}
                <Card className="lg:col-span-2 bg-card border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Conversation History
                        </CardTitle>
                        <CardDescription>{chatHistory.length} messages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
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
        </div>
    )
}
