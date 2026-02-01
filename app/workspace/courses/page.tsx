"use client"

import * as React from "react"
import { Database } from "@/lib/database.types"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    BookOpen,
    Plus,
    Clock,
    ArrowRight,
    Search,
    Calendar,
    Hash,
    Edit3,
    Trash2,
    Save,
    X,
    LayoutGrid,
    Layers
} from "lucide-react"
import { getCourses, createCourse, updateCourse, deleteCourse } from "./actions"
import { WorkspaceHeader } from "@/components/workspace-header"


type Course = Database["public"]["Tables"]["courses"]["Row"]


export default function CoursesPage() {
    const [courses, setCourses] = React.useState<Course[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [formData, setFormData] = React.useState<Partial<Course>>({})
    const [searchQuery, setSearchQuery] = React.useState("")
    const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set())

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await getCourses()
            setCourses(data || [])
            // end-mock-injection
        } catch (error) {
            console.error("Failed to fetch courses:", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const handleNewCourse = () => {
        setSelectedCourse(null)
        setFormData({
            name: "",
            total_fee: 0,
            registration_fee: 0,
            duration_months: 12,
            mode: "Offline",
            target_class: "",
        })
        setIsEditing(false)
        setDialogOpen(true)
    }

    const handleEditCourse = (course: Course) => {
        setSelectedCourse(course)
        setFormData(course)
        setIsEditing(true)
        setDialogOpen(true)
    }

    const handleDeleteCourse = async (courseId: string) => {
        if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return

        setDeletingIds(prev => new Set(prev).add(courseId))
        try {
            await deleteCourse(courseId)
            setCourses(courses.filter(c => c.id !== courseId))
        } catch (error) {
            console.error("Failed to delete course:", error)
            const msg = (error as { message: string })?.message || "Unknown error"
            // Show a more helpful error message
            if (msg.includes("fk") || msg.includes("violates foreign key constraint")) {
                alert("Cannot delete this course because it is linked to active batches. Please delete or move the batches first.")
            } else {
                alert("Failed to delete course: " + msg)
            }
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev)
                next.delete(courseId)
                return next
            })
        }
    }

    const handleSave = async () => {
        try {
            const { id, created_at, updated_at, institute_id, ...payload } = formData

            if (isEditing && selectedCourse) {
                await updateCourse(selectedCourse.id, payload)
                setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, ...payload } as Course : c))
            } else {

                if (!payload.name) {
                    alert("Course name is required")
                    return
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const response = await createCourse(payload as any) // Type assertion safe due to validation
                if (response.success && response.data) {
                    setCourses([...courses, response.data])
                }
            }
            setDialogOpen(false)
        } catch (error) {
            console.error("Failed to save course:", error)
        }
    }

    const filteredCourses = courses.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.mode?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (c.target_class?.toLowerCase() || "").includes(searchQuery.toLowerCase())
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
                title="Courses & Fees"
                subtitle="Manage your batch details, student categories, and fee structures"
                icon={BookOpen}
                iconColor="text-emerald-500"
                className="mb-4 max-w-7xl mx-auto w-full"
                badge={
                    <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500/20 text-emerald-400">
                        {courses.length}
                    </Badge>
                }
            >
                <Button
                    onClick={handleNewCourse}
                    size="sm"
                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                    <Plus className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Add Course</span>
                </Button>
            </WorkspaceHeader>

            {/* Search Bar */}
            <div className="flex-none z-10 mb-4 max-w-7xl mx-auto w-full">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-white transition-colors" />
                    <Input
                        placeholder="Search by name, batch or standard..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/20 border-white/10 pl-10 h-9 rounded-lg text-white text-sm focus:bg-black/40 transition-colors max-w-md"
                    />
                </div>
            </div>

            {/* Main Scrollable Container */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar z-10 max-w-7xl mx-auto w-full overflow-x-visible">

                {/* Data Cards (Scrollable Content) */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-1">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-56 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                            ))
                        ) : filteredCourses.length === 0 ? (
                            <div className="col-span-full py-16 text-center">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <LayoutGrid className="h-6 w-6 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-white font-medium mt-2 text-sm">No Courses Yet</p>
                                    <p className="text-xs text-muted-foreground">Create your first course to begin enrollment management</p>
                                </div>
                            </div>
                        ) : (
                            filteredCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg hover:border-emerald-500/30 hover:scale-[1.02] transition-all group relative overflow-hidden"
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/30">
                                                <BookOpen className="h-4 w-4 text-emerald-500" />
                                            </div>
                                            <div className="text-sm font-bold text-white truncate max-w-[140px]">
                                                {course.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={deletingIds.has(course.id)}
                                                onClick={() => handleEditCourse(course)}
                                                className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={deletingIds.has(course.id)}
                                                onClick={() => handleDeleteCourse(course.id)}
                                                className={`h-7 w-7 p-0 rounded-lg transition-colors ${deletingIds.has(course.id) ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-600 hover:text-red-400 hover:bg-red-500/10'}`}
                                                title="Delete"
                                            >
                                                {deletingIds.has(course.id) ? (
                                                    <Clock className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                )}
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-3 pt-0">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="secondary" className="text-[9px] uppercase h-5 px-1.5 bg-emerald-500/10 text-emerald-400">
                                                    {course.mode || "Offline"}
                                                </Badge>
                                                <Badge variant="outline" className="text-[9px] h-5 px-1.5">
                                                    {course.duration_months || 12} Months
                                                </Badge>
                                                {course.target_class && (
                                                    <Badge variant="outline" className="text-[9px] h-5 px-1.5 bg-blue-500/10 text-blue-400 border-blue-500/20">
                                                        Class {course.target_class}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                                                <div>
                                                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Total Fee</p>
                                                    <p className="text-lg font-bold text-white font-mono">
                                                        <span className="text-xs text-slate-500">₹</span>
                                                        {Number(course.total_fee || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Registration</p>
                                                    <p className="text-sm font-bold text-emerald-400 font-mono">
                                                        <span className="text-xs text-slate-500">₹</span>
                                                        {Number(course.registration_fee || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* Add/Edit Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="bg-[#0B0F19] border-white/10 text-white max-w-md p-0 overflow-hidden outline-none shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-2xl max-h-[80vh]">
                        <DialogHeader className="p-4 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${isEditing ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-sky-500/10 border-sky-500/20 text-sky-400'}`}>
                                    {isEditing ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-bold">
                                        {isEditing ? "Update Course" : "New Course"}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500 text-[10px]">
                                        {isEditing ? "Modify course details" : "Enter course details"}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-4 space-y-4 overflow-y-auto max-h-[50vh]">
                            {/* Identity Controls */}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Course Name</label>
                                    <Input
                                        placeholder="e.g. NEET Crash Course"
                                        value={formData.name || ""}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-9 text-sm rounded-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Mode</label>
                                        <Input
                                            placeholder="Offline/Online"
                                            value={formData.mode || ""}
                                            onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                            className="bg-white/[0.03] border-white/10 text-white h-9 text-sm rounded-lg"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Target Class</label>
                                        <Input
                                            placeholder="e.g. 12th"
                                            value={formData.target_class || ""}
                                            onChange={(e) => setFormData({ ...formData, target_class: e.target.value })}
                                            className="bg-white/[0.03] border-white/10 text-white h-9 text-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Financials & Duration */}
                            <div className="pt-3 border-t border-white/5">
                                <h4 className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mb-3">Fees & Duration</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-bold uppercase text-slate-500">Total Fee</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs">₹</span>
                                            <Input
                                                type="number"
                                                value={formData.total_fee || ""}
                                                onChange={(e) => setFormData({ ...formData, total_fee: parseFloat(e.target.value) })}
                                                className="bg-primary/5 border-primary/20 text-primary pl-6 h-9 font-mono font-bold text-sm rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-bold uppercase text-slate-500">Registration</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs">₹</span>
                                            <Input
                                                type="number"
                                                value={formData.registration_fee || ""}
                                                onChange={(e) => setFormData({ ...formData, registration_fee: parseFloat(e.target.value) })}
                                                className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 pl-6 h-9 font-mono font-bold text-sm rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-bold uppercase text-slate-500">Months</label>
                                        <Input
                                            type="number"
                                            value={formData.duration_months || ""}
                                            onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
                                            className="bg-white/[0.03] border-white/10 text-white h-9 font-mono font-bold text-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border-t border-white/5 flex gap-3">
                            <Button
                                onClick={handleSave}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                                <Save className="h-3.5 w-3.5" /> Save
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="flex-1 border-white/10 bg-white/5 text-slate-400 hover:text-white h-9 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <X className="h-3.5 w-3.5" /> Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
