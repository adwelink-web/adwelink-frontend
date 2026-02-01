"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Phone, GraduationCap, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Visit {
    id: string
    name: string | null
    phone: string
    visit_date: string
    interested_course: string | null
    current_class: string | null
    status: string | null
}

interface Props {
    visits: Visit[]
    stats: {
        conversionRate: number
        totalVisits: number
        convertedVisits: number
    }
}

export default function VisitsClient({ visits, stats }: Props) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        })
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const isToday = (dateString: string) => {
        const visitDate = new Date(dateString)
        const today = new Date()
        return visitDate.toDateString() === today.toDateString()
    }

    const isTomorrow = (dateString: string) => {
        const visitDate = new Date(dateString)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return visitDate.toDateString() === tomorrow.toDateString()
    }

    const getDateLabel = (dateString: string) => {
        if (isToday(dateString)) return "Today"
        if (isTomorrow(dateString)) return "Tomorrow"
        return formatDate(dateString)
    }

    // Group visits by date
    const groupedVisits = visits.reduce((acc, visit) => {
        const dateKey = new Date(visit.visit_date).toDateString()
        if (!acc[dateKey]) {
            acc[dateKey] = []
        }
        acc[dateKey].push(visit)
        return acc
    }, {} as Record<string, Visit[]>)

    const todayVisits = visits.filter(v => isToday(v.visit_date))

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative p-4 md:p-8">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Header - Compact */}
            <div className="flex-none flex items-center justify-between z-10 mb-4 max-w-7xl mx-auto w-full">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/30">
                            <Calendar className="h-4 w-4 text-emerald-500" />
                        </div>
                        Scheduled Visits
                        <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500/20 text-emerald-400">
                            {visits.length}
                        </Badge>
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 hidden md:block">Track campus visits and student appointments</p>
                </div>
            </div>

            {/* KPI Cards - Horizontal scroll on mobile, grid on desktop */}
            <div className="flex-none w-full mb-3 z-10 overflow-visible">
                <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-3 md:overflow-visible py-2 px-1 max-w-7xl mx-auto">
                    {/* 1. Today's Visits */}
                    <Card className="min-w-full md:min-w-0 snap-center bg-gradient-to-br from-emerald-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-emerald-500/20 hover:scale-[1.02] transition-all h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
                            <CardTitle className="text-xs font-medium text-slate-200">Today's Visits</CardTitle>
                            <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="text-xl font-bold text-white">{todayVisits.length}</div>
                            <p className="text-[10px] text-muted-foreground">Campus visits scheduled</p>
                        </CardContent>
                    </Card>

                    {/* 2. This Week */}
                    <Card className="min-w-full md:min-w-0 snap-center bg-gradient-to-br from-blue-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-blue-500/20 hover:scale-[1.02] transition-all h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
                            <CardTitle className="text-xs font-medium text-slate-200">This Week</CardTitle>
                            <Clock className="h-3.5 w-3.5 text-blue-500" />
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="text-xl font-bold text-white">{visits.length}</div>
                            <p className="text-[10px] text-muted-foreground">Upcoming appointments</p>
                        </CardContent>
                    </Card>

                    {/* 3. Conversion Rate */}
                    <Card className="min-w-full md:min-w-0 snap-center bg-gradient-to-br from-amber-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-amber-500/20 hover:scale-[1.02] transition-all h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
                            <CardTitle className="text-xs font-medium text-slate-200">Conversion</CardTitle>
                            <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="text-xl font-bold text-amber-400">
                                {stats.totalVisits > 0 ? `${stats.conversionRate}%` : "--"}
                            </div>
                            <p className="text-[10px] text-amber-200/60">
                                {stats.totalVisits > 0
                                    ? `${stats.convertedVisits} / ${stats.totalVisits} visits converted`
                                    : "No visits recorded yet"
                                }
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Card - Visits List */}
            <Card className="flex-1 min-h-0 bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg flex flex-col z-10 max-w-7xl mx-auto w-full overflow-hidden">
                <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                    <div className="flex-1 overflow-y-auto scrollbar-hidden p-3 md:p-4 space-y-3">
                        {visits.length === 0 ? (
                            <div className="px-4 py-12 text-center text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <Calendar className="h-6 w-6 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-white font-medium mt-2 text-sm">No scheduled visits</p>
                                    <p className="text-xs">Visits will appear here when leads book a campus visit</p>
                                </div>
                            </div>
                        ) : (
                            Object.entries(groupedVisits).map(([dateKey, dateVisits]) => (
                                <div key={dateKey}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge
                                            className={
                                                isToday(dateVisits[0].visit_date)
                                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] h-5 px-1.5"
                                                    : isTomorrow(dateVisits[0].visit_date)
                                                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] h-5 px-1.5"
                                                        : "bg-slate-500/20 text-slate-400 border-slate-500/30 text-[10px] h-5 px-1.5"
                                            }
                                        >
                                            {getDateLabel(dateVisits[0].visit_date)}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {dateVisits.length} visit{dateVisits.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        {dateVisits.map((visit) => (
                                            <Link href={`/workspace/leads/${visit.id}`} key={visit.id}>
                                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-1 ring-white/20">
                                                            {(visit.name || "?").charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white text-xs">{visit.name || "Unknown"}</p>
                                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Phone className="h-3 w-3" />
                                                                    {visit.phone}
                                                                </span>
                                                                {visit.interested_course && (
                                                                    <span className="flex items-center gap-1">
                                                                        <GraduationCap className="h-3 w-3" />
                                                                        {visit.interested_course}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 text-emerald-400 font-medium text-xs">
                                                            <Clock className="h-3 w-3" />
                                                            {formatTime(visit.visit_date)}
                                                        </div>
                                                        <Badge variant="outline" className="mt-0.5 text-[9px] h-4 px-1">
                                                            {visit.current_class || "-"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
