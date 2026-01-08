"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, LineChart, PieChart, TrendingUp, Users, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Reports</h1>
                        <p className="text-slate-400">Deep dive into your institute's performance and AI efficiency.</p>
                    </div>
                    <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white bg-white/5">
                        <Download className="h-4 w-4 mr-2" /> Export PDF Report
                    </Button>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Conversion Rate", value: "12.4%", icon: TrendingUp, color: "text-emerald-400" },
                        { label: "AI Response Time", value: "< 2s", icon: BarChart3, color: "text-blue-400" },
                        { label: "Cost Saved", value: "₹45,200", icon: LineChart, color: "text-purple-400" },
                        { label: "Active Channels", value: "3", icon: Users, color: "text-amber-400" },
                    ].map((kpi, i) => (
                        <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                                </div>
                                <div className="text-2xl font-bold text-white">{kpi.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="bg-white/5 border-white/10 h-[300px] flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                        <div className="text-center z-10">
                            <BarChart3 className="h-12 w-12 text-slate-700 mx-auto mb-4 group-hover:text-blue-500/50 transition-colors" />
                            <p className="text-slate-500 font-medium">Monthly Admission Trend</p>
                            <p className="text-[10px] text-slate-600 mt-1">Data visualization loading...</p>
                        </div>
                    </Card>
                    <Card className="bg-white/5 border-white/10 h-[300px] flex items-center justify-center relative overflow-hidden group">
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
    )
}
