"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, LineChart, PieChart, TrendingUp, Users, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorkspaceHeader } from "@/components/workspace-header"

export default function ReportsPage() {
    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col relative">
            {/* 🌌 Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full" />
            </div>

            {/* Header - Fixed at top */}
            <WorkspaceHeader
                title="Analytics & Reports"
                subtitle="Deep dive into your institute's performance and AI efficiency."
                icon={BarChart3}
                iconColor="text-blue-500"
                className="px-4 md:px-8 py-6 z-20 shrink-0 max-w-7xl mx-auto w-full"
                badge={
                    <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                        <span className="text-emerald-400">Live Data</span>
                    </span>
                }
            >
                <Button className="w-full md:w-auto bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25 font-bold">
                    <Download className="mr-2 h-4 w-4" /> Export PDF Report
                </Button>
            </WorkspaceHeader>

            {/* Main Scrollable Container */}
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                {/* Scrollable Content Section */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {
                            [
                                { label: "Conversion Rate", value: "12.4%", icon: TrendingUp, color: "text-emerald-400" },
                                { label: "AI Response Time", value: "< 2s", icon: BarChart3, color: "text-blue-400" },
                                { label: "Cost Saved", value: "₹45,200", icon: LineChart, color: "text-purple-400" },
                                { label: "Active Channels", value: "3", icon: Users, color: "text-amber-400" },
                            ].map((kpi, i) => (
                                <Card key={i} className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border-violet-500/5 hover:border-violet-500/20 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                                        </div>
                                        <div className="text-2xl font-bold text-white">{kpi.value}</div>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 backdrop-blur-md shadow-xl rounded-2xl h-[300px] flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                            <div className="text-center z-10">
                                <BarChart3 className="h-12 w-12 text-slate-700 mx-auto mb-4 group-hover:text-blue-500/50 transition-colors" />
                                <p className="text-slate-500 font-medium">Monthly Admission Trend</p>
                                <p className="text-[10px] text-slate-600 mt-1">Data visualization loading...</p>
                            </div>
                        </Card>
                        <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 backdrop-blur-md shadow-xl rounded-2xl h-[300px] flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                            <div className="text-center z-10">
                                <PieChart className="h-12 w-12 text-slate-700 mx-auto mb-4 group-hover:text-purple-500/50 transition-colors" />
                                <p className="text-slate-500 font-medium">Lead Sources Distribution</p>
                                <p className="text-[10px] text-slate-600 mt-1">Data visualization loading...</p>
                            </div>
                        </Card>
                    </div>

                    <p className="text-center text-slate-600 text-[10px] pb-10 uppercase tracking-widest font-bold">
                        Powered by Adwelink Intelligence Core
                    </p>
                </div>
            </div>
        </div>
    )
}
