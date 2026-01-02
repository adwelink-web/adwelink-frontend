import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Zap, Radio } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="relative space-y-6">

            {/* Ambient Background Effects (Merged from Splash Screen) */}
            <div className="absolute top-[-50px] left-[-50px] h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
            <div className="absolute top-[-50px] right-[-50px] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

            {/* Header Section */}
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Good Morning, Kashi
                        <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </span>
                            <span className="text-emerald-400">System Online</span>
                        </span>
                    </h2>
                    <p className="text-muted-foreground mt-1">Mission Control is active. Aditi is handling inquiries.</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground border border-white/10 rounded-full px-4 py-2 bg-black/20 backdrop-blur-md">
                    <span className="flex items-center gap-1 text-purple-400">
                        <Radio className="h-3 w-3" /> Broadcast Peak
                    </span>
                    <span>|</span>
                    <span>Server: <span className="text-white">Mumbai-1</span></span>
                    <span>|</span>
                    <span>Latency: <span className="text-emerald-400">24ms</span></span>
                </div>
            </div>

            {/* KPI Cards (Glassmorphism Upgrade) */}
            <div className="grid gap-4 md:grid-cols-3 relative z-10">
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Total Conversations</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">1,248</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Active Agents</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">2</div>
                        <p className="text-xs text-muted-foreground">Aditi (Sales), Rahul (Tutor)</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">System Health</CardTitle>
                        <Zap className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">99.9%</div>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 relative z-10">
                <Card className="col-span-4 bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Neural Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm border border-dashed border-white/10 rounded-md">
                            Live Chat Feed Component Loading...
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="h-10 bg-white/5 rounded w-full animate-pulse" />
                            <div className="h-10 bg-white/5 rounded w-full animate-pulse" />
                            <div className="h-10 bg-white/5 rounded w-full animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
