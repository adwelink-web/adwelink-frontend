"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { Database } from "@/lib/database.types" // Use generated types
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Phone, MapPin, Sparkles, ArrowUpRight, Trash2, Users, Download } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateLead, createLead, deleteLead, LeadCreateData } from "./actions"
import { getCourses } from "../courses/actions"

type Lead = Database["public"]["Tables"]["leads"]["Row"]

export default function LeadsPage() {
    const [leads, setLeads] = React.useState<Lead[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [isCreating, setIsCreating] = React.useState(false)
    type Course = Database["public"]["Tables"]["courses"]["Row"]
    const [courses, setCourses] = React.useState<Course[]>([])
    const [formData, setFormData] = React.useState<Partial<Lead>>({})

    const handleEditToggle = () => {
        if (!isEditing && selectedLead) {
            setFormData(selectedLead)
        }
        setIsEditing(!isEditing)
    }

    const handleSave = async () => {
        try {
            // Filter out system fields that shouldn't be updated
            const { id, created_at, updated_at, institute_id, ...updateData } = formData

            if (isCreating) {
                if (!updateData.phone) {
                    alert("Phone number is required")
                    return
                }
                const response = await createLead(updateData as LeadCreateData)
                if (response.success && response.data) {
                    setLeads([response.data, ...leads])
                    setDialogOpen(false)
                }
            } else if (selectedLead) {
                await updateLead(selectedLead.id, updateData)
                // Optimistic update
                const updatedLead = { ...selectedLead, ...updateData } as Lead
                setSelectedLead(updatedLead)
                setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l))
                setIsEditing(false)
            }
        } catch (error) {
            console.error("Failed to save lead:", error)
        }
    }

    const handleDelete = async () => {
        if (!selectedLead) return
        if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return

        try {
            await deleteLead(selectedLead.id)
            setLeads(leads.filter(l => l.id !== selectedLead.id))
            setDialogOpen(false)
        } catch (error) {
            console.error("Failed to delete lead:", error)
            alert("Failed to delete lead. Please try again.")
        }
    }

    const handleNewLead = () => {
        setIsCreating(true)
        setIsEditing(true)
        setFormData({
            status: 'NEW',
            source: 'DIRECT',
        })
        setDialogOpen(true)
    }

    const exportToCSV = () => {
        if (leads.length === 0) {
            alert("No leads to export")
            return
        }

        // Define CSV headers
        const headers = ['Name', 'Phone', 'Status', 'Source', 'Interested Course', 'Notes', 'Last Contacted', 'Created At']

        // Map leads to CSV rows
        const csvRows = leads.map(lead => [
            lead.name || '',
            lead.phone || '',
            lead.status || '',
            lead.source || '',
            lead.interested_course || '',
            lead.ai_notes?.replace(/,/g, ';').replace(/\n/g, ' ') || '',
            lead.next_followup ? new Date(lead.next_followup).toLocaleDateString('en-IN') : '',
            lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN') : ''
        ])

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getSafeDateValue = (dateStr: string | null | undefined, includeTime = false) => {
        if (!dateStr) return ""
        try {
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return ""
            const iso = date.toISOString()
            return includeTime ? iso.slice(0, 16) : iso.split('T')[0]
        } catch (e) {
            return ""
        }
    }

    React.useEffect(() => {
        if (!dialogOpen) {
            setIsEditing(false)
            setIsCreating(false)
        }
    }, [dialogOpen])

    React.useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true)
            const supabase = createClient()

            try {
                // Fetch Leads and Courses in parallel
                const [leadsResponse, coursesData] = await Promise.all([
                    supabase.from("leads").select("*").order("updated_at", { ascending: false }).limit(50),
                    getCourses()
                ])

                if (leadsResponse.error) {
                    console.error("Supabase Error:", leadsResponse.error)
                } else {
                    // PRODUCTION: Only show actual leads from the database. No mock data.
                    const actualLeads = leadsResponse.data || []
                    setLeads(actualLeads)
                }

                setCourses(coursesData || [])
            } catch (error) {
                console.error("Failed to fetch initial data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialData()
    }, [])

    const getStatusBadge = (status: string | null) => {
        const s = (status || 'fresh').toLowerCase()
        if (s.includes('converted') || s.includes('admitted')) return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Converted</Badge>
        if (s.includes('visit') || s.includes('scheduled')) return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Visit Planned</Badge>
        if (s.includes('dead') || s.includes('lost')) return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Lost</Badge>
        if (s.includes('hot')) return <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">Hot Lead</Badge>
        return <Badge variant="outline" className="text-slate-400 border-slate-700">{status || 'Fresh'}</Badge>
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return <span className="text-slate-600">N/A</span>
        try {
            return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        } catch {
            return <span className="text-red-400">Invalid Date</span>
        }
    }

    return (
        <>
            <div className="h-full w-full overflow-hidden flex flex-col relative p-4 md:p-8">
                {/* Background Gradients - Violet Theme */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[100px]" />
                </div>

                {/* Header - Compact */}
                <div className="flex-none flex items-center justify-between z-10 mb-4 max-w-7xl mx-auto w-full">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center ring-1 ring-violet-500/30">
                                <Users className="h-4 w-4 text-violet-500" />
                            </div>
                            Lead Management
                            <Badge className="h-5 px-1.5 text-[10px] bg-violet-500/20 text-violet-400">
                                {leads.length}
                            </Badge>
                        </h2>
                        <p className="text-muted-foreground text-xs mt-1 hidden md:block">Track Visits, Follow-ups, and Admissions</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs hover:bg-white/5 border-white/10 gap-2" onClick={exportToCSV}>
                            <Download className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Export</span>
                        </Button>
                        <Button size="sm" className="h-8 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-2" onClick={handleNewLead}>
                            <Plus className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Add Lead</span>
                        </Button>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="flex-1 min-h-0 bg-gradient-to-br from-violet-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg flex flex-col z-10 max-w-7xl mx-auto w-full overflow-hidden">
                    <CardContent className="p-0 flex flex-col flex-1 min-h-0 overflow-hidden overflow-x-auto scrollbar-hidden">
                        {/* Table Header */}
                        <div className="flex-none z-20 px-6 mb-1 min-w-[1000px]">
                            <div className="grid grid-cols-12 gap-4 px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-3 pl-2">Candidate</div>
                                <div className="col-span-2">Phone</div>
                                <div className="col-span-2">Interest</div>
                                <div className="col-span-1">Score</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-1">Source</div>
                                <div className="col-span-1 text-right pr-2">Date</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden px-6 py-2 space-y-1 min-w-[1000px]">
                            {loading ? (
                                <div className="px-6 py-16 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-16 w-16 rounded-full bg-violet-500/10 flex items-center justify-center animate-pulse">
                                            <Users className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-white font-medium mt-2">Syncing with Brain...</p>
                                    </div>
                                </div>
                            ) : leads.length === 0 ? (
                                <div className="px-6 py-16 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-16 w-16 rounded-full bg-violet-500/10 flex items-center justify-center">
                                            <Users className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-white font-medium mt-2">No leads yet</p>
                                        <p className="text-sm">Click "Add Lead" to create your first lead.</p>
                                    </div>
                                </div>
                            ) : (
                                leads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="grid grid-cols-12 gap-4 items-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group text-xs"
                                        onClick={() => { setSelectedLead(lead); setDialogOpen(true) }}
                                    >
                                        {/* Candidate */}
                                        <div className="col-span-3 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-1 ring-white/20">
                                                    {(lead.name || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white truncate max-w-[120px]">{lead.name || "Unknown"}</div>
                                                    <div className="text-[10px] text-slate-500">{lead.city || "No city"}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="col-span-2">
                                            <p className="text-slate-300 font-mono text-xs">{lead.phone}</p>
                                        </div>

                                        {/* Interest */}
                                        <div className="col-span-2">
                                            <p className="text-slate-400 truncate max-w-[100px]">{lead.interested_course || "-"}</p>
                                        </div>

                                        {/* Score */}
                                        <div className="col-span-1">
                                            <span className={`font-bold font-mono ${(lead.lead_score || 0) >= 70 ? "text-emerald-500" :
                                                    (lead.lead_score || 0) >= 40 ? "text-amber-500" :
                                                        "text-slate-500"
                                                }`}>
                                                {lead.lead_score || 0}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                            {getStatusBadge(lead.status)}
                                        </div>

                                        {/* Source */}
                                        <div className="col-span-1">
                                            <p className="text-slate-500 truncate text-[10px] uppercase">{lead.source || "-"}</p>
                                        </div>

                                        {/* Date */}
                                        <div className="col-span-1 text-right pr-2">
                                            <p className="text-slate-500">
                                                {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* REFACTORED MODAL DIALOG (POPUP) */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-5xl w-full bg-[#0F131E] border border-white/10 text-slate-200 p-0 shadow-2xl max-h-[85vh] h-[85vh] flex flex-col gap-0 overflow-hidden">
                    {(selectedLead || isCreating) && (
                        <div className="flex flex-col h-full min-h-0">
                            {/* DIALOG HEADER */}
                            <DialogHeader className="p-5 bg-[#181D2D] border-b border-white/5 space-y-1 shrink-0">
                                <div className="flex items-start justify-between mb-3 pr-10">
                                    <div>
                                        <DialogTitle className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                                            {isCreating ? "New Student Enrollment" : "Student Profile"}
                                        </DialogTitle>
                                        <div className="mt-1">
                                            {isEditing ? (
                                                <div className="flex flex-col gap-1.5 mt-1">
                                                    <Input
                                                        className="h-8 text-xl font-bold text-white bg-transparent border-white/20 px-2"
                                                        value={formData.name || ""}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Student Name"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            className="h-6 w-32 text-xs bg-transparent border-white/20 px-2"
                                                            value={formData.phone || ""}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            placeholder="Phone"
                                                        />
                                                        <Input
                                                            className="h-6 w-32 text-xs bg-transparent border-white/20 px-2"
                                                            value={formData.source || ""}
                                                            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                                            placeholder="Source"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                                        {selectedLead?.name || "New Student"}
                                                    </h3>
                                                    <DialogDescription className="flex items-center gap-3 text-xs text-slate-400">
                                                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedLead?.phone || "No Phone"}</span>
                                                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedLead?.source || "N/A"}</span>
                                                    </DialogDescription>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {isEditing ? (
                                            <div className="flex flex-col gap-1 items-end">
                                                <Select
                                                    value={formData.status || "NEW"}
                                                    onValueChange={(val) => setFormData({ ...formData, status: val as Lead["status"] })}
                                                >
                                                    <SelectTrigger className="h-6 w-[100px] text-[10px]">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="NEW">New</SelectItem>
                                                        <SelectItem value="CONTACTED">Contacted</SelectItem>
                                                        <SelectItem value="INTERESTED">Interested</SelectItem>
                                                        <SelectItem value="ENROLLED">Enrolled</SelectItem>
                                                        <SelectItem value="CLOSED">Closed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    className="h-5 w-[100px] text-[10px] text-right bg-transparent border-white/20"
                                                    value={formData.source || ""}
                                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                                    placeholder="Source"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                {getStatusBadge(selectedLead?.status || "NEW")}
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wide">{selectedLead?.source || "DIRECT"} SOURCE</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button size="sm" onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs">
                                                Save Changes
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1 border-white/10 hover:bg-white/5 text-slate-300 h-9 text-xs">
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="sm" variant="outline" onClick={handleEditToggle} className="flex-1 border-white/10 hover:bg-white/5 hover:text-white text-slate-300 h-9 text-xs">
                                                Edit Profile
                                            </Button>
                                            {!isCreating && (
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={handleDelete}
                                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 h-9 w-9 shrink-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </DialogHeader>

                            {/* DIALOG BODY */}
                            <ScrollArea className="h-[calc(85vh-130px)]">
                                <div className="p-5 pb-20 space-y-5">

                                    {/* 1. AI Notes */}
                                    <section>
                                        <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 p-4 relative overflow-hidden">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3 flex items-center gap-2">
                                                        <Sparkles className="h-3 w-3" /> AI Notes
                                                    </h4>
                                                    {isEditing ? (
                                                        <textarea
                                                            className="w-full h-20 text-sm bg-black/30 border border-white/10 rounded-lg p-2 text-white resize-none"
                                                            value={formData.ai_notes || ""}
                                                            onChange={(e) => setFormData({ ...formData, ai_notes: e.target.value })}
                                                            placeholder="Add notes about this lead..."
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-violet-200/90 leading-relaxed">
                                                            {selectedLead?.ai_notes || "No notes available yet."}
                                                        </p>
                                                    )}
                                                </div>
                                                {/* Lead Score - Big & Attractive */}
                                                <div className="flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl bg-black/30 border border-white/10">
                                                    <span className="text-[9px] text-slate-500 uppercase font-semibold mb-1">Score</span>
                                                    <span className={`text-3xl font-black ${(selectedLead?.lead_score ?? 0) >= 70 ? 'text-green-400' : (selectedLead?.lead_score ?? 0) >= 40 ? 'text-yellow-400' : 'text-slate-500'}`}>
                                                        {selectedLead?.lead_score ?? '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 2. Student Info */}
                                    <section>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Student Info</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Current Class</label>
                                                {isEditing ? (
                                                    <Input
                                                        className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                        value={formData.current_class || ""}
                                                        onChange={(e) => setFormData({ ...formData, current_class: e.target.value })}
                                                        placeholder="e.g. 12th"
                                                    />
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.current_class || <span className="text-slate-600">-</span>}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">City</label>
                                                {isEditing ? (
                                                    <Input
                                                        className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                        value={formData.city || ""}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        placeholder="City"
                                                    />
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.city || <span className="text-slate-600">-</span>}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Lead Score</label>
                                                <div className={`text-sm font-bold mt-0.5 ${(selectedLead?.lead_score || 0) >= 70 ? 'text-green-400' : (selectedLead?.lead_score || 0) >= 40 ? 'text-yellow-400' : 'text-slate-400'}`}>
                                                    {selectedLead?.lead_score ?? <span className="text-slate-600 font-medium">-</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 3. Academic Interest */}
                                    <section>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Academic Interest</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Interested Course</label>
                                                {isEditing ? (
                                                    <Select
                                                        value={formData.interested_course || ""}
                                                        onValueChange={(val) => setFormData({ ...formData, interested_course: val })}
                                                    >
                                                        <SelectTrigger className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2">
                                                            <SelectValue placeholder="Select Course" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#161B22] border-white/10 text-white">
                                                            {courses.map(course => (
                                                                <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5 truncate">{selectedLead?.interested_course || <span className="text-slate-600">Not Specified</span>}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Target Year</label>
                                                {isEditing ? (
                                                    <Input
                                                        className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                        value={formData.target_year || ""}
                                                        onChange={(e) => setFormData({ ...formData, target_year: e.target.value })}
                                                        placeholder="e.g. 2025"
                                                    />
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.target_year || <span className="text-slate-600">-</span>}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Preferred Mode</label>
                                                {isEditing ? (
                                                    <Select
                                                        value={formData.preferred_mode || ""}
                                                        onValueChange={(val) => setFormData({ ...formData, preferred_mode: val })}
                                                    >
                                                        <SelectTrigger className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2">
                                                            <SelectValue placeholder="Select Mode" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#161B22] border-white/10 text-white">
                                                            <SelectItem value="offline">Offline</SelectItem>
                                                            <SelectItem value="online">Online</SelectItem>
                                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5 capitalize">{selectedLead?.preferred_mode || <span className="text-slate-600">-</span>}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Budget Range</label>
                                                {isEditing ? (
                                                    <Input
                                                        className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                        value={formData.budget_range || ""}
                                                        onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                                                        placeholder="e.g. 50k-1L"
                                                    />
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.budget_range || <span className="text-slate-600">-</span>}</div>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    {/* 4. Parent Details */}
                                    <section>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Parent / Guardian</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Parent Name</label>
                                                {isEditing ? (
                                                    <Input
                                                        className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                        value={formData.parent_name || ""}
                                                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                                                        placeholder="Parent Name"
                                                    />
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.parent_name || <span className="text-slate-600">-</span>}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Parent Phone</label>
                                                {isEditing ? (
                                                    <Input
                                                        className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                        value={formData.parent_phone || ""}
                                                        onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                                                        placeholder="Phone Number"
                                                    />
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5 font-mono">{selectedLead?.parent_phone || <span className="text-slate-600 font-sans">-</span>}</div>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    {/* 5. Visit & Follow-up */}
                                    <section>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Visit & Follow-up</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Visit Type</label>
                                                {isEditing ? (
                                                    <Select
                                                        value={formData.visit_type || ""}
                                                        onValueChange={(val) => setFormData({ ...formData, visit_type: val })}
                                                    >
                                                        <SelectTrigger className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2">
                                                            <SelectValue placeholder="Select Type" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#161B22] border-white/10 text-white">
                                                            <SelectItem value="walk_in">Walk-in</SelectItem>
                                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                                            <SelectItem value="demo_class">Demo Class</SelectItem>
                                                            <SelectItem value="counseling">Counseling</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5 capitalize">{selectedLead?.visit_type?.replace('_', ' ') || <span className="text-slate-600">-</span>}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Visit Date</label>
                                                {isEditing ? (
                                                    <Input
                                                        type="datetime-local"
                                                        className="h-6 text-xs bg-black/20 border-white/10 mt-0.5 px-1 w-full"
                                                        value={getSafeDateValue(formData.visit_date, true)}
                                                        onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                                                    />
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.visit_date ? formatDate(selectedLead.visit_date) : <span className="text-slate-600">-</span>}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 uppercase font-semibold">Next Follow-up</label>
                                                {isEditing ? (
                                                    <Input
                                                        type="datetime-local"
                                                        className="h-6 text-xs bg-black/20 border-white/10 mt-0.5 px-1 w-full"
                                                        value={getSafeDateValue(formData.next_followup, true)}
                                                        onChange={(e) => setFormData({ ...formData, next_followup: e.target.value })}
                                                    />
                                                ) : (
                                                    <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.next_followup ? formatDate(selectedLead.next_followup) : <span className="text-slate-600">Not Set</span>}</div>
                                                )}
                                            </div>
                                        </div>
                                    </section>


                                    {/* Footer Note */}
                                    {!isCreating && (
                                        <div className="pt-8 text-center">
                                            <p className="text-[10px] text-slate-600 uppercase tracking-widest">Lead ID: {selectedLead?.id}</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </DialogContent>
            </Dialog >
        </>
    )
}
