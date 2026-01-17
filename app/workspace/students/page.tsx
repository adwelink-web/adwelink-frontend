"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { GraduationCap, Phone, User, Search, Filter, Trash2, ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { getStudents, deleteStudent, updateStudent } from "./actions"

import { Database } from "@/lib/database.types"

type Student = Database["public"]["Tables"]["students"]["Row"]

export default function StudentsPage() {
    const [students, setStudents] = React.useState<Student[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [formData, setFormData] = React.useState<Partial<Student>>({})
    const [isSaving, setIsSaving] = React.useState(false)

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await getStudents()
                setStudents(data || [])
            } catch (error) {
                console.error("Failed to fetch students:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()
        if (!confirm("Are you sure you want to delete this student record?")) return
        try {
            await deleteStudent(id)
            setStudents(students.filter(s => s.id !== id))
            if (selectedStudent?.id === id) setIsDialogOpen(false)
        } catch (error) {
            console.error("Failed to delete student:", error)
        }
    }

    const handleEdit = (student: Student) => {
        setSelectedStudent(student)
        setFormData({
            name: student.name || "",
            phone: student.phone || "",
            status: student.status || "Enrolled"
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!selectedStudent) return
        setIsSaving(true)
        try {
            await updateStudent(selectedStudent.id, formData)
            setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...formData } : s))
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Failed to update student:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const filteredStudents = students.filter(s =>
    (s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone?.includes(searchQuery))
    )

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 flex flex-col min-h-0 overflow-hidden space-y-6 w-full">
                {/* Header Section */}
                <div className="flex-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <GraduationCap className="h-8 w-8 text-emerald-500" />
                            Active Students
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your enrolled student database.</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex-none flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search students by name or phone..."
                            className="pl-10 bg-white/5 border-white/10 text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                </div>

                {/* Students Table */}
                <div className="flex-1 min-h-0 flex flex-col">
                    <Card className="max-h-full bg-white/5 border-white/10 flex flex-col overflow-hidden !p-0 !m-0 !border-0 shadow-none">
                        <CardContent className="flex-1 min-h-0 !p-0 !m-0 overflow-hidden flex flex-col">
                            <div className="flex flex-col flex-1 min-h-0 relative">
                                {/* Fixed Header */}
                                <div className="flex-none z-20 mx-0 border-b border-white/5 bg-[#0B0F19]/75 backdrop-blur-md">
                                    <div className="grid grid-cols-12 px-2 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <div className="col-span-3 pl-6">Student</div>
                                        <div className="col-span-3">Contact</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-2">Joined Date</div>
                                        <div className="col-span-2 text-right pr-6">Actions</div>
                                    </div>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {loading ? (
                                        <div className="h-32 flex items-center justify-center text-slate-500 text-sm">
                                            Syncing with Brain...
                                        </div>
                                    ) : filteredStudents.length === 0 ? (
                                        <div className="h-32 flex items-center justify-center text-slate-500 text-sm">
                                            No students found.
                                        </div>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <div
                                                key={student.id}
                                                className="grid grid-cols-12 items-center px-2 py-2 border-b border-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group"
                                                onClick={() => handleEdit(student)}
                                            >
                                                <div className="col-span-3 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 border border-white/10 shadow-sm group-hover:border-emerald-500/30 transition-colors">
                                                            <AvatarFallback className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                                                                {student.name?.charAt(0) || "S"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{student.name}</span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 font-mono text-xs text-slate-400">
                                                    {student.phone}
                                                </div>
                                                <div className="col-span-2">
                                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 capitalize">
                                                        {student.status || "Enrolled"}
                                                    </Badge>
                                                </div>
                                                <div className="col-span-2 text-xs text-slate-500">
                                                    {student.created_at ? new Date(student.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                                                </div>
                                                <div className="col-span-2 text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/10">
                                                            <ArrowUpRight className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10"
                                                            onClick={(e) => handleDelete(student.id, e)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* MANAGEMENT DIALOG */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#0B0F19] border-white/10 text-white max-w-md p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="p-6 border-b border-white/5 bg-white/[0.02]">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <User className="h-5 w-5 text-emerald-500" />
                            Manage Student
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Full Name</label>
                            <Input
                                value={formData.name || ""}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-white/5 border-white/10 focus:border-emerald-500/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Phone Number</label>
                            <Input
                                value={formData.phone || ""}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="bg-white/5 border-white/10 focus:border-emerald-500/50 font-mono"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Status</label>
                            <Input
                                value={formData.status || ""}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="bg-white/5 border-white/10 focus:border-emerald-500/50"
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-white/[0.02] flex gap-3">
                        <Button
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20"
                            onClick={() => selectedStudent?.id && handleDelete(selectedStudent.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
