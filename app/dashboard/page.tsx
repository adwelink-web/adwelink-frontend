"use server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Phone, CalendarDays, ArrowUpRight, PlusCircle, Bell, UserPlus } from "lucide-react"
import Link from "next/link"
import { getDashboardData } from "./actions"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
    const { user, stats, recentLeads } = await getDashboardData()

    return (
        <div className="relative space-y-6">

            {/* Ambient Background Effects */}
            <div className="absolute top-[-50px] left-[-50px] h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
            <div className="absolute top-[-50px] right-[-50px] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

            {/* Header Section */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Good Morning, {user?.email?.split('@')[0] || 'Sales Head'}
                        <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </span>
                            <span className="text-emerald-400">Aditi Online</span>
                        </span>
                    </h2>
                    <p className="text-muted-foreground mt-1">Here is your business summary for today.</p>
                </div>

                <Link href="/dashboard/leads">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                        <UserPlus className="mr-2 h-4 w-4" />
                        View All Leads
                    </Button>
                </Link>
            </div>

            {/* Business KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3 relative z-10">
                {/* 1. Total Leads */}
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Total Leads Inquired</CardTitle>
                        <Users className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.totalLeads}</div>
                        <p className="text-xs text-muted-foreground">Lifetime inquiries</p>
                    </CardContent>
                </Card>

                {/* 2. Today's Leads */}
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">New Inquiries (Today)</CardTitle>
                        <CalendarDays className="h-4 w-4 text-cyan-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.todayLeads}</div>
                        <p className="text-xs text-muted-foreground">Fresh leads from calls/ads</p>
                    </CardContent>
                </Card>

                {/* 3. Pending Follow-ups */}
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Pending Follow-ups</CardTitle>
                        <Bell className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.pendingFollowups}</div>
                        <p className="text-xs text-muted-foreground">Need attention immediately</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity List */}
            <div className="grid gap-4 md:grid-cols-1 relative z-10">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            Recent Inquiries
                            <span className="text-xs font-normal text-muted-foreground ml-2">(Last 5 Interactions)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLeads.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground border border-dashed border-white/10 rounded-lg">
                                    No inquiries yet. Aditi is waiting for calls.
                                </div>
                            ) : (
                                recentLeads.map((lead: any) => (
                                    <div key={lead.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{lead.name || "Unknown Caller"}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Phone className="h-3 w-3" /> {lead.phone}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden md:block text-right">
                                                <p className="text-xs text-slate-300 bg-white/10 px-2 py-1 rounded">
                                                    {lead.interested_course || "General Inquiry"}
                                                </p>
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded-full border ${lead.status?.toLowerCase().includes('hot') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    lead.status?.toLowerCase().includes('warm') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>
                                                {lead.status || "New"}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
