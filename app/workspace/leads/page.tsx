"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { Database } from "@/lib/database.types" // Use generated types
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Calendar, Phone, MapPin, Sparkles, ArrowUpRight, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateLead, createLead, deleteLead } from "./actions"
import { getCourses } from "../courses/actions"
import { format } from "date-fns" // We might need to install date-fns or use native Intl

type Lead = Database["public"]["Tables"]["leads"]["Row"]

export default function LeadsPage() {
    const [leads, setLeads] = React.useState<Lead[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [isCreating, setIsCreating] = React.useState(false)
    const [courses, setCourses] = React.useState<any[]>([])
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
                const response = await createLead(updateData)
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
            visit_type: 'offline'
        })
        setDialogOpen(true)
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
                    setLeads(leadsResponse.data || [])
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
        } catch (e) {
            return <span className="text-red-400">Invalid Date</span>
        }
    }

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 flex flex-col min-h-0 overflow-hidden space-y-6 w-full">
                <div className="flex-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Lead Management</h2>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">Track Visits, Follow-ups, and Admissions.</p>
                    </div>
                    <Button className="w-full md:w-auto bg-white text-black hover:bg-slate-200 h-9 px-4 text-xs font-bold rounded-xl shadow-lg" onClick={handleNewLead}>
                        <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> Add Manual Lead
                    </Button>
                </div>

                <div className="flex-1 min-h-0 flex flex-col">
                    <Card className="max-h-full bg-white/5 border-white/10 flex flex-col overflow-hidden !p-0 !m-0 !border-0 shadow-none shrink-0">
                        <CardContent className="flex-1 min-h-0 !p-0 !m-0 overflow-hidden flex flex-col">
                            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar !p-0 !m-0 !mb-0 !pb-0">
                                <table className="w-full text-sm border-collapse !m-0 !p-0 !mb-0 !pb-0">
                                    <thead className="sticky top-0 z-30 bg-white/5 backdrop-blur-md shadow-sm border-b border-white/10">
                                        <tr className="text-left">
                                            <th className="h-11 px-6 font-medium text-slate-400 text-[11px] uppercase tracking-wider">Candidate</th>
                                            <th className="h-11 px-6 font-medium text-slate-400 text-[11px] uppercase tracking-wider w-[160px]">Source / City</th>
                                            <th className="h-11 px-6 font-medium text-slate-400 text-[11px] uppercase tracking-wider">Interest</th>
                                            <th className="h-11 px-6 font-medium text-slate-400 text-[11px] uppercase tracking-wider">Score</th>
                                            <th className="h-11 px-6 font-medium text-slate-400 text-[11px] uppercase tracking-wider">Next Action</th>
                                            <th className="h-11 px-6 font-medium text-slate-400 text-[11px] uppercase tracking-wider text-center">Status</th>
                                            <th className="h-11 px-6 font-medium text-slate-400 text-[11px] uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} className="h-32 text-center text-slate-500 text-sm">Syncing with Brain...</td>
                                            </tr>
                                        ) : leads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-white/[0.08] group cursor-pointer border-b border-white/[0.03] transition-all duration-150" onClick={() => { setSelectedLead(lead); setDialogOpen(true) }}>
                                                <td className="px-6 py-2.5 align-middle">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-200 text-sm leading-tight">{lead.name || "Unknown"}</span>
                                                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">{lead.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-2.5 align-middle">
                                                    <div className="flex flex-col gap-0 mt-0.5">
                                                        <span className="text-xs text-slate-400 font-medium capitalize leading-normal">{lead.city || "-"}</span>
                                                        {lead.source && <span className="text-[9px] text-slate-600 uppercase tracking-tighter">{lead.source}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-2.5 align-middle">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-slate-300 font-medium leading-normal">{lead.interested_course}</span>
                                                        {lead.current_class && <span className="text-[10px] text-slate-600 mt-0.5">{lead.current_class}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-2.5 align-middle">
                                                    {lead.lead_score ? (
                                                        <div className={`text-sm font-bold tracking-tight ${lead.lead_score > 80 ? 'text-emerald-400' : lead.lead_score > 50 ? 'text-amber-400' : 'text-slate-500'}`}>
                                                            {lead.lead_score}
                                                        </div>
                                                    ) : <span className="text-slate-700">-</span>}
                                                </td>
                                                <td className="px-6 py-2.5 align-middle">
                                                    {lead.next_followup ? (
                                                        <div className="text-[11px] text-slate-400 font-medium">
                                                            {formatDate(lead.next_followup)}
                                                        </div>
                                                    ) : <span className="text-slate-700">-</span>}
                                                </td>
                                                <td className="px-6 py-2.5 align-middle text-center">
                                                    {getStatusBadge(lead.status)}
                                                </td>
                                                <td className="px-6 py-2.5 align-middle text-right">
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-white/10 rounded-full transition-all">
                                                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-600" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                                                                value={formData.city || ""}
                                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                                placeholder="City"
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
                                                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedLead?.city || "N/A"}</span>
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
                                                        onValueChange={(val) => setFormData({ ...formData, status: val as any })}
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
                                                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20 h-9 text-xs">
                                                    <Phone className="mr-2 h-3.5 w-3.5" /> Call Parent
                                                </Button>
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

                                        {/* 1. AI Insights */}
                                        <section>
                                            <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 p-4 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-3 opacity-10"><Sparkles className="h-10 w-10 text-violet-500" /></div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3 flex items-center gap-2">
                                                    <Sparkles className="h-3 w-3" /> AI Engagement Analysis
                                                </h4>
                                                <div className="flex items-center gap-6 mb-2">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-white">{selectedLead?.lead_score || 0}<span className="text-base text-slate-500 font-normal">%</span></div>
                                                        <div className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Chance</div>
                                                    </div>
                                                    <div className="h-8 w-px bg-white/10"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-violet-200/90 leading-relaxed italic">
                                                            "{selectedLead?.ai_notes || "Insufficient interaction data. No AI summary available yet."}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* 2. Academic Info */}
                                        <section>
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Academic Profile</h4>
                                            <div className="grid grid-cols-4 gap-4">
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
                                                    <label className="text-[9px] text-slate-500 uppercase font-semibold">Current Class</label>
                                                    {isEditing ? (
                                                        <Input
                                                            className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                            value={formData.current_class || ""}
                                                            onChange={(e) => setFormData({ ...formData, current_class: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.current_class || <span className="text-slate-600">N/A</span>}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-[9px] text-slate-500 uppercase font-semibold">Target Year</label>
                                                    {isEditing ? (
                                                        <Input
                                                            className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                            value={formData.target_year || ""}
                                                            onChange={(e) => setFormData({ ...formData, target_year: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.target_year || <span className="text-slate-600">N/A</span>}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-[9px] text-slate-500 uppercase font-semibold">Budget Est.</label>
                                                    {isEditing ? (
                                                        <Input
                                                            className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                            value={formData.budget_range || ""}
                                                            onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.budget_range || <span className="text-slate-600">Not Disclosed</span>}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </section>

                                        {/* 3. Family Details */}
                                        <section>
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Family & Contact</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[9px] text-slate-500 uppercase font-semibold">Parent Name</label>
                                                    {isEditing ? (
                                                        <Input
                                                            className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2"
                                                            value={formData.parent_name || ""}
                                                            onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div className="text-sm font-medium text-white mt-0.5">{selectedLead?.parent_name || <span className="text-slate-600">Not Provided</span>}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-[9px] text-slate-500 uppercase font-semibold">Parent Phone</label>
                                                    {isEditing ? (
                                                        <Input
                                                            className="h-6 text-sm bg-black/20 border-white/10 mt-0.5 px-2 font-mono"
                                                            value={formData.parent_phone || ""}
                                                            onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div className="text-sm font-medium text-white mt-0.5 font-mono">{selectedLead?.parent_phone || <span className="text-slate-600">N/A</span>}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </section>

                                        {/* 4. Visit Logistic */}
                                        <section>
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Visit & Logistics</h4>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                                                    <label className="text-[9px] text-slate-500 uppercase font-semibold block mb-0.5">Next Follow-up</label>
                                                    {isEditing ? (
                                                        <Input
                                                            type="date"
                                                            className="h-6 text-xs bg-black/20 border-white/10 mt-0.5 px-1 w-full"
                                                            value={getSafeDateValue(formData.next_followup)}
                                                            onChange={(e) => setFormData({ ...formData, next_followup: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div className="text-xs font-medium text-amber-400">{selectedLead?.next_followup ? formatDate(selectedLead.next_followup) : "None"}</div>
                                                    )}
                                                </div>
                                                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                                                    <label className="text-[9px] text-slate-500 uppercase font-semibold block mb-0.5">Scheduled Visit</label>
                                                    {isEditing ? (
                                                        <Input
                                                            type="datetime-local"
                                                            className="h-6 text-xs bg-black/20 border-white/10 mt-0.5 px-1 w-full"
                                                            value={getSafeDateValue(formData.visit_date, true)}
                                                            onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div className="text-xs font-medium text-white">{selectedLead?.visit_date ? formatDate(selectedLead.visit_date) : "None"}</div>
                                                    )}
                                                </div>
                                                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                                                    <label className="text-[9px] text-slate-500 uppercase font-semibold block mb-0.5">Visit Type</label>
                                                    {isEditing ? (
                                                        <Select
                                                            value={formData.visit_type || "offline"}
                                                            onValueChange={(val) => setFormData({ ...formData, visit_type: val })}
                                                        >
                                                            <SelectTrigger className="h-6 w-full text-xs bg-black/20 border-white/10">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="offline">Offline</SelectItem>
                                                                <SelectItem value="online">Online</SelectItem>
                                                                <SelectItem value="parent_visit">Parent Visit</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <div className="text-xs font-medium text-white capitalize">{selectedLead?.visit_type || "N/A"}</div>
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
                </Dialog>
            </div>
        </div>
    )
}
