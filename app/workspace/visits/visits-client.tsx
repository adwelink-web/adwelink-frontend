"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Phone, GraduationCap, ArrowRight } from "lucide-react"
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
}

export default function VisitsClient({ visits }: Props) {
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
    const upcomingVisits = visits.filter(v => !isToday(v.visit_date))

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-emerald-400" />
                        Scheduled Visits
                    </h1>
                    <p className="text-muted-foreground">{visits.length} upcoming visits</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-emerald-300">Today's Visits</p>
                                <p className="text-3xl font-bold text-white">{todayVisits.length}</p>
                            </div>
                            <Calendar className="h-10 w-10 text-emerald-400 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-300">This Week</p>
                                <p className="text-3xl font-bold text-white">{visits.length}</p>
                            </div>
                            <Clock className="h-10 w-10 text-blue-400 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-amber-300">Conversion Rate</p>
                                <p className="text-3xl font-bold text-white">--</p>
                            </div>
                            <ArrowRight className="h-10 w-10 text-amber-400 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Visits List */}
            <div className="space-y-6">
                {visits.length === 0 ? (
                    <Card className="bg-card border-white/10">
                        <CardContent className="py-12 text-center">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No scheduled visits</p>
                            <p className="text-sm text-muted-foreground mt-1">Visits will appear here when leads book a campus visit</p>
                        </CardContent>
                    </Card>
                ) : (
                    Object.entries(groupedVisits).map(([dateKey, dateVisits]) => (
                        <div key={dateKey}>
                            <div className="flex items-center gap-3 mb-3">
                                <Badge
                                    className={
                                        isToday(dateVisits[0].visit_date)
                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                            : isTomorrow(dateVisits[0].visit_date)
                                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                                : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                                    }
                                >
                                    {getDateLabel(dateVisits[0].visit_date)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    {dateVisits.length} visit{dateVisits.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="grid gap-3">
                                {dateVisits.map((visit) => (
                                    <Link href={`/workspace/leads/${visit.id}`} key={visit.id}>
                                        <Card className="bg-card border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                                            <CardContent className="py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                                            {(visit.name || "?").charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white">{visit.name || "Unknown"}</p>
                                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                                                        <div className="flex items-center gap-1 text-emerald-400 font-medium">
                                                            <Clock className="h-4 w-4" />
                                                            {formatTime(visit.visit_date)}
                                                        </div>
                                                        <Badge variant="outline" className="mt-1">
                                                            {visit.current_class || "-"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
