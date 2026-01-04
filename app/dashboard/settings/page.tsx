"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Shield, Save, Loader2, Check, IndianRupee, MapPin, Phone, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase"

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // State
    const [institute, setInstitute] = useState<any>(null)
    const [courses, setCourses] = useState<any[]>([])

    // UI State for Dialog
    const [courseDialogOpen, setCourseDialogOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState<any>(null)

    const supabase = createClient()

    // Fetch Data on Load
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // 1. Fetch Institute
            const { data: instData } = await supabase.from('institutes').select('*').limit(1).single()
            if (instData) setInstitute(instData)

            // 2. Fetch Courses
            const { data: coursesData } = await supabase.from('courses').select('*').order('name')
            if (coursesData) setCourses(coursesData)

            setLoading(false)
        }
        fetchData()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setSaved(false)
        try {
            // 1. Save Institute Profile
            if (institute) {
                const { error } = await supabase.from('institutes').update({
                    name: institute.name,
                    address: institute.address,
                    city: institute.city,
                    google_map_link: institute.google_map_link,
                    helpline_number: institute.helpline_number
                }).eq('id', institute.id)

                if (error) throw error
            }

            // Note: Courses are now saved individually via the Dialog, 
            // but we can leave this generic success state for the Profile.

            setSaved(true)
            setTimeout(() => setSaved(false), 3000)

        } catch (error: any) {
            console.error("Error saving:", error)
            alert("Failed to save settings. Check console.")
        } finally {
            setSaving(false)
        }
    }

    // Handle Course Save (Add/Edit)
    const handleSaveCourse = async () => {
        if (!editingCourse || !institute) return
        setSaving(true)

        try {
            const courseData = {
                institute_id: institute.id,
                name: editingCourse.name,
                total_fee: editingCourse.total_fee || 0,
                registration_fee: editingCourse.registration_fee || 0,
                duration_months: editingCourse.duration_months || 0,
                target_class: editingCourse.target_class,
                mode: editingCourse.mode
            }

            if (editingCourse.id) {
                // Update
                const { error } = await supabase.from('courses').update(courseData).eq('id', editingCourse.id)
                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase.from('courses').insert(courseData)
                if (error) throw error
            }

            // Refresh List
            const { data: coursesData } = await supabase.from('courses').select('*').order('name')
            if (coursesData) setCourses(coursesData)

            setCourseDialogOpen(false)
            setEditingCourse(null)

        } catch (error: any) {
            console.error("Error saving course:", error)
            alert("Failed to save course.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading Configuration...
        </div>
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Settings className="h-8 w-8 text-slate-400" /> Control Center
                    </h2>
                    <p className="text-muted-foreground mt-1">Manage Institute Profile & Aditi's Behavior</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className={`min-w-[120px] text-white ${saved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </Button>
            </div>

            <Tabs defaultValue="fees" className="space-y-4">
                <TabsList className="bg-white/5 border border-white/10 text-slate-400">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                        <Shield className="h-4 w-4 mr-2" /> Profile
                    </TabsTrigger>
                    {/* Vibe Check Hidden for v0.01 MVP */}
                    <TabsTrigger value="fees" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                        <IndianRupee className="h-4 w-4 mr-2" /> Rate Card
                    </TabsTrigger>
                </TabsList>

                {/* 1. Institute Profile */}
                <TabsContent value="profile">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-200">Institute Identity & Location</CardTitle>
                            <CardDescription>Official details Aditi uses to guide students.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-200">Institute Name</Label>
                                    <Input
                                        value={institute?.name || ""}
                                        onChange={(e) => setInstitute({ ...institute, name: e.target.value })}
                                        className="bg-black/20 border-white/10 text-white"
                                        placeholder="e.g. Chopra Classes"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-200">City</Label>
                                    <Input
                                        value={institute?.city || ""}
                                        onChange={(e) => setInstitute({ ...institute, city: e.target.value })}
                                        className="bg-black/20 border-white/10 text-white"
                                        placeholder="e.g. Kota"
                                    />
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-200 flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> Helpline Number
                                    </Label>
                                    <Input
                                        value={institute?.helpline_number || ""}
                                        onChange={(e) => setInstitute({ ...institute, helpline_number: e.target.value })}
                                        className="bg-black/20 border-white/10 text-white"
                                        placeholder="+91 99999..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-200 flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Google Map Link
                                    </Label>
                                    <Input
                                        value={institute?.google_map_link || ""}
                                        onChange={(e) => setInstitute({ ...institute, google_map_link: e.target.value })}
                                        className="bg-black/20 border-white/10 text-white"
                                        placeholder="https://maps.app.goo.gl/..."
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label className="text-slate-200">Full Address</Label>
                                <Textarea
                                    value={institute?.address || ""}
                                    onChange={(e) => setInstitute({ ...institute, address: e.target.value })}
                                    className="bg-black/20 border-white/10 text-white min-h-[80px]"
                                    placeholder="Building No, Street, Landmark..."
                                />
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. Courses & Fees (The "Ops" Layer) */}
                <TabsContent value="fees">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-slate-200">Smart Rate Card</CardTitle>
                                <CardDescription>Aditi uses this strictly to pitch fees & modes.</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { setEditingCourse({ mode: 'Offline' }); setCourseDialogOpen(true) }} className="bg-white/10 hover:bg-white/20">
                                + Add Course
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {courses.length === 0 ? (
                                <p className="text-slate-400 text-sm">No courses found. Add one to start selling.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {courses.map((course) => (
                                        <div key={course.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
                                            <div onClick={() => { setEditingCourse(course); setCourseDialogOpen(true) }} className="cursor-pointer flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-slate-200 font-medium">{course.name}</h4>
                                                    {course.mode && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">{course.mode}</span>}
                                                    {course.target_class && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">{course.target_class}</span>}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1 flex gap-4">
                                                    <span>⏱ {course.duration_months} Months</span>
                                                    <span>💰 Total: ₹{course.total_fee}</span>
                                                    {course.registration_fee > 0 && <span className="text-emerald-400">⚡ Booking: ₹{course.registration_fee}</span>}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingCourse(course); setCourseDialogOpen(true) }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Settings className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Course Edit Dialog */}
                    <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                        <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingCourse?.id ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                                <DialogDescription>Aditi will use these details to sell this course.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Course Name</Label>
                                    <Input
                                        value={editingCourse?.name || ""}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                                        placeholder="e.g. Target JEE 2026"
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Target Class</Label>
                                        <Input
                                            value={editingCourse?.target_class || ""}
                                            onChange={(e) => setEditingCourse({ ...editingCourse, target_class: e.target.value })}
                                            placeholder="e.g. 11th"
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Mode</Label>
                                        <select
                                            value={editingCourse?.mode || "Offline"}
                                            onChange={(e) => setEditingCourse({ ...editingCourse, mode: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="Offline">Offline</option>
                                            <option value="Online">Online</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Total Fee (₹)</Label>
                                        <Input
                                            type="number"
                                            value={editingCourse?.total_fee || ""}
                                            onChange={(e) => setEditingCourse({ ...editingCourse, total_fee: parseFloat(e.target.value) })}
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Booking Amount (₹)</Label>
                                        <Input
                                            type="number"
                                            value={editingCourse?.registration_fee || ""}
                                            onChange={(e) => setEditingCourse({ ...editingCourse, registration_fee: parseFloat(e.target.value) })}
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Duration (Months)</Label>
                                    <Input
                                        type="number"
                                        value={editingCourse?.duration_months || ""}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, duration_months: parseFloat(e.target.value) })}
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCourseDialogOpen(false)} className="border-white/10 hover:bg-white/10 text-slate-400">Cancel</Button>
                                <Button onClick={handleSaveCourse} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Course"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

            </Tabs>
        </div>
    )
}
