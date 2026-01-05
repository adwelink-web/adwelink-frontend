"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, BrainCircuit, CalendarDays, CheckCircle2, Users } from "lucide-react"

interface HomeClientContainerProps {
    stats: any
    initialDate: string
}

export function HomeClientContainer({ stats, initialDate }: HomeClientContainerProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [currentDate, setCurrentDate] = useState<string>(initialDate)

    useEffect(() => {
        // Update date on client mount to match locale if needed
        const now = new Date()
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' }
        setCurrentDate(now.toLocaleDateString('en-US', options))
    }, [])

    const handleSelect = () => {
        setLoading("Aditi")
        document.cookie = `activeAgent=Aditi; path=/; max-age=604800`
        setTimeout(() => {
            router.push("/workspace")
        }, 800)
    }

    const metrics = stats ? [
        { label: "Total Leads", value: stats.leads.value, change: stats.leads.change, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { label: "Total Students", value: stats.students.value, change: stats.students.change, icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    ] : []

    const liveActivity = stats?.activityFeed || []

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 md:p-6 min-h-0 overflow-hidden">
                {/* 1. Header & Welcome (Frozen) */}
                <div className="flex-none flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">AMS Control Center</h1>
                        <p className="text-slate-400 flex items-center gap-2 mt-1">
                            <CalendarDays className="h-4 w-4 opacity-70" />
                            {currentDate || "Loading Date..."} • <span className="text-emerald-400">System Connected</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white bg-transparent hover:bg-white/5">View Reports</Button>
                        <Button className="bg-white text-black hover:bg-slate-200 font-semibold" onClick={handleSelect}>Open Aditi's Workspace</Button>
                    </div>
                </div>

                {/* 2. Content Area (No Scroll) */}
                <div className="flex-1 overflow-hidden min-h-0 space-y-4">
                    {/* Metrics (2 Column Layout) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {metrics.map((m, i) => (
                            <Card key={i} className={`bg-white/5 border-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${m.border} group`}>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-400 font-medium mb-1 group-hover:text-slate-300 transition-colors">{m.label}</p>
                                        <h3 className="text-2xl font-bold text-white tracking-tight">{m.value}</h3>
                                        <span className={`text-xs font-medium ${m.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {m.change} <span className="text-slate-500 opacity-60 ml-1">vs last month</span>
                                        </span>
                                    </div>
                                    <div className={`p-3 rounded-xl ${m.bg} ${m.color} ring-1 ring-inset ring-white/10`}>
                                        <m.icon className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 3. Live Institute Pulse (Activity Feed) */}
                        <Card className="bg-white/5 border-white/10 lg:col-span-2 shadow-xl backdrop-blur-sm">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-white text-lg">
                                            <Activity className="h-5 w-5 text-indigo-400" /> Live Institute Pulse
                                        </CardTitle>
                                        <CardDescription className="mt-1">Real-time actions performing by your AI employees.</CardDescription>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] uppercase text-emerald-500 font-bold tracking-wider">Live</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="h-[280px] overflow-y-auto custom-scrollbar pr-2">
                                    <div className="space-y-4 relative">
                                        {/* Vertical Line */}
                                        <div className="absolute left-[39px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>

                                        {liveActivity.map((item: any, i: number) => (
                                            <div key={i} className="flex gap-4 items-start group relative z-10">
                                                <div className="flex flex-col items-end gap-1 min-w-[70px] pt-1">
                                                    <span className="text-xs text-slate-500 font-mono group-hover:text-slate-300 transition-colors">{item.time}</span>
                                                </div>
                                                <div className={`h-2 w-2 mt-2 rounded-full ring-4 ring-[#0a0a0a] ${i === 0 ? 'bg-indigo-400 animate-ping' : 'bg-slate-700'}`}></div>
                                                <div className="bg-white/5 p-3 rounded-lg w-full border border-white/5 text-sm text-slate-300 hover:bg-white/10 transition-colors hover:border-white/10">
                                                    {item.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 4. Active Agent Snapshot */}
                        <div className="space-y-6">
                            <Card className="bg-white/5 border-white/10 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 group-hover:w-1.5 transition-all"></div>
                                <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-purple-500/20 blur-[50px] rounded-full group-hover:bg-purple-500/30 transition-all pointer-events-none"></div>

                                <CardHeader className="pb-2">
                                    <CardTitle className="text-white text-lg flex justify-between items-center">
                                        Active Workforce
                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wide">
                                            Running
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 relative z-10">
                                    <div className="h-[280px] overflow-y-auto custom-scrollbar pr-2">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-900/20 flex items-center justify-center text-purple-400 shadow-inner ring-1 ring-white/10">
                                                <BrainCircuit className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold text-lg">Aditi</h4>
                                                <p className="text-xs text-purple-300 font-medium">Senior Counselor</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">Automating Sales</p>
                                            </div>
                                        </div>
                                        <Button onClick={handleSelect} className="w-full bg-white text-black hover:bg-indigo-50 font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all py-5">
                                            {loading === "Aditi" ? "Connecting..." : "Go to Workspace"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
