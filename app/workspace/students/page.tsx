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
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { getStudents, deleteStudent, updateStudent } from "./actions"
import { WorkspaceHeader } from "@/components/workspace-header"

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
                toast.error("Failed to load students", { description: "Please refresh the page." })
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
            toast.success("Student Deleted")
        } catch (error) {
            console.error("Failed to delete student:", error)
            toast.error("Delete Failed", { description: "Could not remove student record." })
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
            toast.success("Student Updated")
        } catch (error) {
            console.error("Failed to update student:", error)
            toast.error("Update Failed")
        } finally {
            setIsSaving(false)
        }
    }

    const filteredStudents = students.filter(s =>
    (s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone?.includes(searchQuery))
    )

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative p-4 md:p-8">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Header - Compact */}
            <WorkspaceHeader
                title="Active Students"
                subtitle="Manage your enrolled student database"
                icon={GraduationCap}
                iconColor="text-emerald-500"
                className="mb-4 max-w-7xl mx-auto w-full"
                badge={
                    <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500/20 text-emerald-400">
                        {filteredStudents.length}
                    </Badge>
                }
            />

            <div className="flex-1 min-h-0 flex flex-col z-10 max-w-7xl mx-auto w-full space-y-4">

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
                <Card className="flex-1 min-h-0 bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg flex flex-col overflow-hidden">
                    <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                        {/* Fixed Header */}
                        <div className="flex-none z-20 px-6 mb-1">
                            <div className="grid grid-cols-12 gap-4 px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-3 pl-2">Student</div>
                                <div className="col-span-3">Contact</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Joined Date</div>
                                <div className="col-span-2 text-right pr-2">Actions</div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden px-6 py-2 space-y-1">
                            {loading ? (
                                <div className="px-6 py-16 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
                                            <GraduationCap className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-white font-medium mt-2">Syncing with Brain...</p>
                                    </div>
                                </div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="px-6 py-16 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                            <GraduationCap className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-white font-medium mt-2">No students found</p>
                                        <p className="text-sm">Students will appear here once leads are converted</p>
                                    </div>
                                </div>
                            ) : (
                                filteredStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className="grid grid-cols-12 gap-4 items-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group text-xs"
                                        onClick={() => handleEdit(student)}
                                    >
                                        <div className="col-span-3 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-1 ring-white/20">
                                                    {student.name?.charAt(0).toUpperCase() || "S"}
                                                </div>
                                                <div className="font-semibold text-white truncate max-w-[120px]">{student.name}</div>
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-slate-300 font-mono text-xs">{student.phone}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <Badge variant="secondary" className="text-[9px] uppercase h-5 px-1.5 bg-emerald-500/10 text-emerald-400">
                                                {student.status || "Enrolled"}
                                            </Badge>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-slate-500">
                                                {student.created_at ? new Date(student.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "-"}
                                            </p>
                                        </div>
                                        <div className="col-span-2 text-right pr-2">
                                            <div className="flex justify-end gap-1">
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-white/10">
                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                                                    onClick={(e) => handleDelete(student.id, e)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
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
