// AMS (Agent Management System) Workspace

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    hotLeads: number
    visitBooked: number
}

export default async function AMSWorkspacePage() {
    const data = await getDashboardData()
    const stats: DashboardStats = data.stats
    const recentLeads: Lead[] = data.recentLeads as Lead[]
    const user = data.user
    const cookieStore = await cookies()
    const activeAgent = cookieStore.get("activeAgent")?.value || "Aditi"

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative p-4 md:p-8">

            {/* Header - Fixed, Outside Scroll */}
            <div className="flex-none flex items-center justify-between z-10 mb-4 max-w-7xl mx-auto w-full">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <LayoutDashboard className="h-5 w-5 text-violet-500" />
                        Workspace Active: Admin
                        <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-normal whitespace-nowrap">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </span>
                            <span className="text-emerald-400">Aditi Online</span>
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 hidden md:block">Here is your business summary for today.</p>
                </div>
                <Link href="/workspace/leads">
                    <Button size="sm" className="h-8 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-2">
                        <UserPlus className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">View All Leads</span>
                    </Button>
                </Link>
            </div>

            {/* KPI Cards - Fixed */}
            <div className="flex-none w-full mb-4">
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible py-2 px-4">
                    {/* 1. Total Leads */}
                    <Link href="/workspace/leads" className="block min-w-full md:min-w-[calc(50%-8px)] lg:min-w-0 snap-center">
                        <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-violet-500/20 hover:scale-[1.02] transition-all h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">Total Leads</CardTitle>
                                <Users className="h-4 w-4 text-violet-500" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-white">{stats.totalLeads}</div>
                                <p className="text-xs text-muted-foreground">Lifetime inquiries</p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* 2. Today's Leads */}
                    <Link href="/workspace/leads" className="block min-w-full md:min-w-[calc(50%-8px)] lg:min-w-0 snap-center">
                        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-cyan-500/20 hover:scale-[1.02] transition-all h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">New Today</CardTitle>
                                <CalendarDays className="h-4 w-4 text-cyan-500" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-white">{stats.todayLeads}</div>
                                <p className="text-xs text-muted-foreground">Fresh leads</p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* 3. Hot Leads 🔥 */}
                    <Link href="/workspace/leads" className="block min-w-full md:min-w-[calc(50%-8px)] lg:min-w-0 snap-center">
                        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-orange-500/20 hover:scale-[1.02] transition-all h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">🔥 Hot Leads</CardTitle>
                                <Sparkles className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-orange-400">{stats.hotLeads}</div>
                                <p className="text-xs text-orange-200/60">Ready to convert!</p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* 4. Visit Booked 📅 */}
                    <Link href="/workspace/leads" className="block min-w-full md:min-w-[calc(50%-8px)] lg:min-w-0 snap-center">
                        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-purple-500/20 hover:scale-[1.02] transition-all h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">📅 Visit Booked</CardTitle>
                                <CalendarDays className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-purple-400">{stats.visitBooked}</div>
                                <p className="text-xs text-purple-200/60">Appointments scheduled!</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Recent Inquiries Card - Fills Remaining Screen */}
            <Card className="flex-1 min-h-0 bg-gradient-to-br from-violet-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg overflow-hidden flex flex-col max-w-7xl mx-4 md:mx-auto w-auto md:w-full gap-0 py-0">
                <CardHeader className="flex flex-col gap-0 pt-3 pb-4 px-4 flex-none">
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="space-y-0.5">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                                <Users className="h-4 w-4 text-violet-500" />
                                Recent Inquiries
                            </CardTitle>
                            <p className="text-[10px] text-muted-foreground">Last 5 Interactions</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400">
                            Realtime
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto scrollbar-hidden">
                    <div className="space-y-3 sm:space-y-1 px-3 sm:px-4 sm:pb-4 pt-2">
                        {recentLeads.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border-t border-white/5 sm:border border-dashed sm:rounded-lg">
                                No inquiries yet. Aditi is waiting for calls.
                            </div>
                        ) : (
                            recentLeads.map((lead) => (
                                <Link key={lead.id} href={`/workspace/leads?phone=${lead.phone}`} className="block">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-transparent border border-white/5 rounded-lg hover:bg-violet-500/10 transition-colors gap-0 sm:gap-4 group/item">
                                        {/* Left: Identity */}
                                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
                                            <div className="relative shrink-0">
                                                <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-inner ring-1 ring-white/20">
                                                    {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                {lead.lead_score && lead.lead_score > 0 && (
                                                    <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full flex items-center justify-center text-[7px] sm:text-[9px] font-bold ring-1 ring-[#0B0F19] ${lead.lead_score >= 70 ? 'bg-green-500 text-black' : lead.lead_score >= 40 ? 'bg-amber-500 text-black' : 'bg-slate-500 text-white'}`}>
                                                        {lead.lead_score}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs sm:text-sm font-medium text-white truncate">
                                                        {lead.name || "Unknown Caller"}
                                                    </p>
                                                    {lead.ai_notes && (
                                                        <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-violet-500/10 text-violet-300 border border-violet-500/20 max-w-[100px] truncate">
                                                            <Sparkles className="h-2 w-2 mr-1 shrink-0" />
                                                            {lead.ai_notes}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                                                    <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                                                    <span className="truncate">{lead.phone}</span>
                                                    {lead.source && (
                                                        <span className="flex items-center gap-1 text-slate-500 border-l border-white/10 pl-1.5 ml-1.5 shrink-0">
                                                            <span className="uppercase text-[8px] sm:text-[9px] tracking-wider font-semibold">VIA {lead.source}</span>
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right: Status & Course */}
                                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto mt-2 pt-2 border-t border-white/5 sm:mt-0 sm:pt-0 sm:border-0">
                                            <p className="text-[10px] sm:text-xs text-slate-300 bg-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded truncate max-w-[120px] sm:max-w-[200px]">
                                                {lead.interested_course || "General Inquiry"}
                                            </p>
                                            <div className={`text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 ${lead.status?.toLowerCase().includes('hot') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                lead.status?.toLowerCase().includes('warm') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    lead.status?.toLowerCase().includes('converted') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
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
                {/* Creative Footer Line */}
                <div className="flex-none h-2 w-full bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-50" />
            </Card>
        </div>
    )
}
