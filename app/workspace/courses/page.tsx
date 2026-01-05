"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
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
    Banknote,
    Sparkles,
    MonitorPlay,
    Building2,
    Users2,
    ArrowRight,
    Search,
    GraduationCap,
    Trophy,
    Target,
    Calendar,
    Hash,
    ChevronRight,
    UserCircle2,
    Edit3,
    Trash2,
    Save,
    X,
    LayoutGrid,
    Layers
} from "lucide-react"
import { getCourses, createCourse, updateCourse, deleteCourse } from "./actions"

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
            duration_months: 12,
            mode: "Offline", // DB expects Capitalized 'Offline'
            registration_fee: 0,
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
        } catch (error: any) {
            console.error("Failed to delete course:", error)
            // Show a more helpful error message
            if (error.message?.includes("fk") || error.message?.includes("violates foreign key constraint")) {
                alert("Cannot delete this course because it is linked to active batches. Please delete or move the batches first.")
            } else {
                alert("Failed to delete course: " + (error.message || "Unknown error"))
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
                const response = await createCourse(payload)
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
        (c.target_class?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    )

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 md:p-8 min-h-0">
                {/* Header & Filter Section (Frozen) */}
                <div className="flex-none space-y-6 mb-6">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                                Courses & Fees
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] py-0 px-2 uppercase tracking-widest hidden sm:inline-flex">
                                    {courses.length} Active
                                </Badge>
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base">Manage your batch details, student categories, and fee structures.</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                onClick={handleNewCourse}
                                className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 h-10 px-5 font-bold rounded-xl"
                            >
                                <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> Add New Course
                            </Button>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-white transition-colors" />
                            <Input
                                placeholder="Search by name, batch or standard..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border-white/10 pl-10 h-10 rounded-xl text-white text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Data Cards (Scrollable) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-56 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                            ))
                        ) : filteredCourses.length === 0 ? (
                            <div className="col-span-full py-24 text-center rounded-2xl border border-dashed border-white/10">
                                <LayoutGrid className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-1">No Courses Yet</h3>
                                <p className="text-slate-500 text-sm">Create your first course to begin enrollment management.</p>
                            </div>
                        ) : (
                            filteredCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-xl hover:border-primary/50 transition-all group relative overflow-hidden rounded-2xl"
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 leading-none">
                                            <Hash className="h-3 w-3" /> {course.id.slice(0, 8)}
                                        </CardTitle>
                                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
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

                                    <CardContent className="pt-0">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <div className="text-lg font-bold text-white leading-tight">
                                                    {course.name}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-primary/5 text-[9px] text-primary border-primary/20 uppercase py-0 px-2 font-black tracking-tight rounded-md">
                                                        {course.mode || "Offline"}
                                                    </Badge>
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                                        <Layers className="h-3 w-3 text-sky-400" /> Batch: <span className="text-white">{course.target_class || "All Students"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                                <div className="space-y-1">
                                                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Total Fee</div>
                                                    <div className="text-xl font-bold text-white font-mono leading-none flex items-baseline gap-1">
                                                        <span className="text-xs font-bold text-slate-500">₹</span>
                                                        {Number(course.total_fee).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="space-y-1 text-right">
                                                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Duration</div>
                                                    <div className="text-sm font-bold text-slate-300 flex items-center justify-end gap-1.5">
                                                        <Clock className="h-3.5 w-3.5 text-slate-600" /> {course.duration_months} Months
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5 opacity-60">
                                                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3" />
                                                    {course.created_at ? new Date(course.created_at).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                                                    Adm. Fee: <span className="text-white">₹{Number(course.registration_fee || 0).toLocaleString()}</span>
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
                    <DialogContent className="bg-[#0B0F19] border-white/10 text-white max-w-lg p-0 overflow-hidden outline-none shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-3xl">
                        <DialogHeader className="p-8 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${isEditing ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-sky-500/10 border-sky-500/20 text-sky-400'}`}>
                                        {isEditing ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                    </div>
                                    <div className="space-y-0.5">
                                        <DialogTitle className="text-xl font-bold tracking-tight">
                                            {isEditing ? "Update Course" : "New Course Details"}
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-500 text-xs">
                                            {isEditing ? "Modify the course name, batch, or fee mapping." : "Enter the primary details for your new academic course."}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-8 space-y-6">
                            {/* Identity Controls */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 ml-1">Full Course Name</label>
                                    <Input
                                        placeholder="e.g. NEET Crash Course"
                                        value={formData.name || ""}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-white/[0.03] border-white/10 text-white h-12 focus:ring-1 focus:ring-primary/40 text-sm font-bold rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 ml-1">Target Batch / Class</label>
                                        <Input
                                            placeholder="e.g. 10th, 12th, or Droppers"
                                            value={formData.target_class || ""}
                                            onChange={(e) => setFormData({ ...formData, target_class: e.target.value })}
                                            className="bg-white/[0.03] border-white/10 text-white h-12 text-sm font-medium rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 ml-1">Study Mode</label>
                                        <Select
                                            value={formData.mode || "Offline"}
                                            onValueChange={(val) => setFormData({ ...formData, mode: val })}
                                        >
                                            <SelectTrigger className="bg-white/[0.03] border-white/10 text-white h-12 text-sm font-bold rounded-xl capitalize">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#161B22] border-white/10 text-white rounded-xl">
                                                <SelectItem value="Offline">Offline</SelectItem>
                                                <SelectItem value="Online">Online</SelectItem>
                                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Financials & Duration */}
                            <div className="pt-6 border-t border-white/5">
                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-5">Fees & Program Cycle</h4>
                                <div className="grid grid-cols-3 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase text-slate-600">Total Fee</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs">₹</span>
                                            <Input
                                                type="number"
                                                value={formData.total_fee || ""}
                                                onChange={(e) => setFormData({ ...formData, total_fee: parseFloat(e.target.value) })}
                                                className="bg-primary/5 border-primary/20 text-primary pl-7 h-11 font-mono font-black text-sm rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase text-slate-600">Admission Fee</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs">₹</span>
                                            <Input
                                                type="number"
                                                value={formData.registration_fee || ""}
                                                onChange={(e) => setFormData({ ...formData, registration_fee: parseFloat(e.target.value) })}
                                                className="bg-white/[0.03] border-white/10 text-white pl-7 h-11 font-mono font-bold text-sm rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase text-slate-600">Cycle (m)</label>
                                        <Input
                                            type="number"
                                            value={formData.duration_months || ""}
                                            onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
                                            className="bg-white/[0.03] border-white/10 text-white h-11 font-mono font-bold text-sm rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
                            <Button
                                onClick={handleSave}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Save className="h-4 w-4" /> Save Changes
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="flex-1 border-white/10 bg-white/5 text-slate-400 hover:text-white h-12 rounded-2xl font-bold flex items-center justify-center gap-2"
                            >
                                <X className="h-4 w-4" /> Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
