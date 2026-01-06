// Workspace Dashboard Page

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Phone, CalendarDays, ArrowUpRight, PlusCircle, Bell, UserPlus, GraduationCap } from "lucide-react"
import Link from "next/link"
import { getDashboardData } from "./actions"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
    const { user, stats, recentLeads } = await getDashboardData()

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col space-y-4 p-4 md:p-8 !pb-10 max-w-7xl mx-auto w-full overflow-hidden">

                {/* Header Section (Fixed) */}
                <div className="flex-none relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                            Workspace Active: {user?.user_metadata?.first_name || 'Admin'}
                            <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                </span>
                                <span className="text-emerald-400">Aditi Online</span>
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

                {/* Business KPI Cards (Fixed) */}
                <div className="flex-none grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
                    {/* 1. Total Leads */}
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Total Leads Inquired</CardTitle>
                            <Users className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{(stats as any).totalLeads}</div>
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
                            <div className="text-2xl font-bold text-white">{(stats as any).todayLeads}</div>
                            <p className="text-xs text-muted-foreground">Fresh leads from calls/ads</p>
                        </CardContent>
                    </Card>

                    {/* 3. Total Students */}
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-all border-emerald-500/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Active Students</CardTitle>
                            <GraduationCap className="h-4 w-4 text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{(stats as any).totalStudents}</div>
                            <p className="text-xs text-muted-foreground">Enrolled and verified</p>
                        </CardContent>
                    </Card>

                    {/* 4. Pending Follow-ups */}
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Pending Actions</CardTitle>
                            <Bell className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{(stats as any).pendingFollowups}</div>
                            <p className="text-xs text-muted-foreground">Needs interaction</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity List (Flexible & Scrollable) */}
                <div className="flex-1 min-h-0 relative z-10 flex flex-col">
                    <Card className="bg-white/5 border-white/10 overflow-hidden flex flex-col h-full">
                        <CardHeader className="flex-none">
                            <CardTitle className="text-white flex items-center gap-2">
                                Recent Inquiries
                                <span className="text-xs font-normal text-muted-foreground ml-2 hidden sm:inline-block">(Last 5 Interactions)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-y-auto custom-scrollbar">
                            <div className="space-y-0 sm:space-y-1 p-0 sm:p-4">
                                {recentLeads.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border-t border-white/5 sm:border border-dashed sm:rounded-lg">
                                        No inquiries yet. Aditi is waiting for calls.
                                    </div>
                                ) : (
                                    recentLeads.map((lead: any) => (
                                        <div key={lead.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 border-b sm:border border-white/5 sm:rounded-lg hover:bg-white/10 transition-colors gap-4">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-1 ring-white/20">
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
