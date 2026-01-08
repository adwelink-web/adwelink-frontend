// Workspace Dashboard Page

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Phone, CalendarDays, Bell, UserPlus, LayoutDashboard, Sparkles, GraduationCap } from "lucide-react"
import Link from "next/link"
import { getDashboardData } from "./actions"
import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"
import { Database } from "@/lib/database.types"

type Lead = Database["public"]["Tables"]["leads"]["Row"]

interface DashboardStats {
    totalLeads: number
    todayLeads: number
    totalStudents: number
    pendingFollowups: number
}

export default async function DashboardPage() {
    const { user, stats: rawStats, recentLeads: rawRecentLeads } = await getDashboardData()
    const stats = rawStats as DashboardStats
    const recentLeads = rawRecentLeads as unknown as Lead[]
    const cookieStore = await cookies()
    const activeAgent = cookieStore.get("activeAgent")?.value || "Aditi"

    return (
        <div className="h-full w-full overflow-hidden flex flex-col">

            {/* Main Scrollable Container */}
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative">

                {/* Sticky Header Section */}
                <div className="sticky top-0 z-50 backdrop-blur-xl px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <LayoutDashboard className="h-8 w-8 text-emerald-500" />
                                Workspace Active: {user?.user_metadata?.first_name || 'Admin'}
                                <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                    </span>
                                    <span className="text-emerald-400">{activeAgent} Online</span>
                                </span>
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Here is your business summary for today.</p>
                        </div>

                        <Link href="/workspace/leads" className="w-full md:w-auto">
                            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                                <UserPlus className="mr-2 h-4 w-4" />
                                View All Leads
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content Section */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                    {/* Business KPI Cards */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Leads */}
                        <Link href="/workspace/leads" className="block">
                            <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-violet-500/20 hover:scale-[1.02] transition-all h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-200">Total Leads Inquired</CardTitle>
                                    <Users className="h-4 w-4 text-emerald-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.totalLeads}</div>
                                    <p className="text-xs text-muted-foreground">Lifetime inquiries</p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 2. Today's Leads */}
                        <Link href="/workspace/leads" className="block">
                            <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-violet-500/20 hover:scale-[1.02] transition-all h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-200">New Inquiries (Today)</CardTitle>
                                    <CalendarDays className="h-4 w-4 text-cyan-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.todayLeads}</div>
                                    <p className="text-xs text-muted-foreground">Fresh leads from calls/ads</p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 3. Total Students */}
                        <Link href="/workspace/students" className="block">
                            <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-violet-500/20 hover:scale-[1.02] transition-all h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-200">Active Students</CardTitle>
                                    <GraduationCap className="h-4 w-4 text-emerald-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.totalStudents}</div>
                                    <p className="text-xs text-muted-foreground">Enrolled and verified</p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 4. Pending Follow-ups */}
                        <Link href="/workspace/leads" className="block">
                            <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-violet-500/20 hover:scale-[1.02] transition-all h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-200">Pending Actions</CardTitle>
                                    <Bell className="h-4 w-4 text-amber-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.pendingFollowups}</div>
                                    <p className="text-xs text-muted-foreground">Needs interaction</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Recent Activity List - Premium Violet Theme */}
                    <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-violet-500/20 overflow-hidden flex flex-col h-full gap-0 py-0">
                        <CardHeader className="flex-none pt-4 pb-4 px-4">
                            <CardTitle className="text-white flex items-center gap-2">
                                Recent Inquiries
                                <span className="text-xs font-normal text-muted-foreground ml-2 hidden sm:inline-block">(Last 5 Interactions)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-0 sm:space-y-1 p-0 sm:px-4 sm:pb-4 sm:pt-0">
                                {recentLeads.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border-t border-white/5 sm:border border-dashed sm:rounded-lg">
                                        No inquiries yet. Aditi is waiting for calls.
                                    </div>
                                ) : (
                                    recentLeads.map((lead) => (
                                        <Link key={lead.id} href={`/workspace/leads?phone=${lead.phone}`} className="block">
                                            <div className="flex flex-col sm:flex-row items-center justify-between p-2.5 bg-white/5 border-b sm:border border-white/5 sm:rounded-lg hover:bg-white/10 transition-colors gap-2">
                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                    <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-1 ring-white/20">
                                                        {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-white truncate">{lead.name || "Unknown Caller"}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Phone className="h-3 w-3" /> {lead.phone}
                                                            {lead.source && (
                                                                <span className="ml-2 flex items-center gap-1 text-slate-400 border-l border-white/10 pl-2">
                                                                    <span className="uppercase text-[9px] tracking-wider font-semibold">VIA {lead.source}</span>
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-300 bg-white/10 px-2 py-1 rounded inline-block">
                                                            {lead.interested_course || "General Inquiry"}
                                                        </p>
                                                    </div>
                                                    <div className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wider whitespace-nowrap ${lead.status?.toLowerCase().includes('hot') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        lead.status?.toLowerCase().includes('warm') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        }`}>
                                                        {lead.status?.replace(/_/g, ' ') || "NEW"}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
