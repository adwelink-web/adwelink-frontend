"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Activity, BrainCircuit, Users, Sparkles, TrendingUp, Zap, IndianRupee, ShieldCheck } from "lucide-react"

interface ActivityItem {
    type: string
    text: string
    time: string
    created_at?: string
    sentiment?: string
    intent?: string
    phone_number?: string
}

interface HomeStats {
    leads?: { value: string | number; change?: string }
    revenue?: { value: string; raw: number }
    activityFeed?: ActivityItem[]
    userName?: string
    businessName?: string
    students?: { value: string | number; change?: string }
}

interface HomeClientContainerProps {
    stats: HomeStats
    initialDate: string
}

export function HomeClientContainer({ stats, initialDate }: HomeClientContainerProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [currentTime, setCurrentTime] = useState<string>("")
    const [dateString, setDateString] = useState<string>(initialDate)

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
            setDateString(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
        }
        updateTime()
        const timer = setInterval(updateTime, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleSelect = () => {
        setLoading("Aditi")
        document.cookie = `activeAgent=Aditi; path=/; max-age=604800`
        // Force hard navigation to bypass router hang
        window.location.href = "/workspace"
    }

    const liveActivity = stats?.activityFeed || []

    return (
        <div className="h-full w-full bg-[#030712] relative overflow-hidden flex flex-col font-sans selection:bg-violet-500/30">

            {/* 🌌 Background VFX */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-violet-900/20 via-[#030712] to-[#030712] pointer-events-none" />
            <div className="absolute -top-[200px] left-[20%] w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

            {/* 🚀 COMPACT ONE-SCREEN INTERFACE */}
            <div className="relative z-10 flex-1 flex flex-col p-4 lg:p-6 h-full max-w-[1600px] mx-auto w-full min-h-0">

                {/* COMPACT HEADER */}
                <header className="flex justify-between items-end mb-4 shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                            <span className="text-[9px] font-bold tracking-[0.2em] text-emerald-500 uppercase">System Online</span>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                            Dashboard <span className="text-violet-600">Prime</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-lg font-bold text-white tabular-nums tracking-tight leading-none">{currentTime}</div>
                            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{dateString}</div>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT GRID - FLEX 1 TO FILL SPACE */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">

                    {/* COL 1: Neural Core (Aditi) - Compact */}
                    <div className="lg:col-span-4 flex flex-col h-full min-h-0">
                        <div className="flex-1 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-2xl p-1 relative overflow-hidden group flex flex-col min-h-0">
                            <div className="absolute inset-0 bg-violet-600/5 group-hover:bg-violet-600/10 transition-colors"></div>

                            {/* Inner Glass */}
                            <div className="h-full w-full bg-[#05060A]/80 backdrop-blur-xl rounded-xl border border-white/5 p-5 flex flex-col relative overflow-hidden min-h-0">

                                {/* Header */}
                                <div className="flex justify-between items-start z-10 shrink-0">
                                    <div>
                                        <h2 className="text-xl font-bold text-white leading-none">Aditi</h2>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">AI Counselor</p>
                                    </div>
                                    <div className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <Zap className="h-2.5 w-2.5 fill-current" /> Active
                                    </div>
                                </div>

                                {/* Main Visual - Flex grows to fill space */}
                                <div className="flex-1 relative flex items-center justify-center min-h-0 py-2">
                                    <div className="relative h-32 w-32 lg:h-40 lg:w-40 group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-violet-500 blur-[50px] opacity-20 animate-pulse"></div>
                                        {/* Rings */}
                                        <div className="absolute inset-0 border border-violet-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                                        <div className="absolute inset-3 border border-violet-400/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                                        {/* Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-20 w-20 bg-[#0B0F19] rounded-full border border-violet-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                                <BrainCircuit className="h-10 w-10 text-violet-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Stats & Action */}
                                <div className="w-full z-10 shrink-0 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-violet-500/30 transition-colors">
                                            <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">Efficiency</div>
                                            <div className="text-lg font-bold text-white leading-none">98%</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-violet-500/30 transition-colors">
                                            <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">Latency</div>
                                            <div className="text-lg font-bold text-emerald-400 leading-none">1.2s</div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSelect}
                                        onMouseEnter={() => router.prefetch("/workspace")}
                                        disabled={loading === "Aditi"}
                                        className="w-full h-10 bg-white text-black hover:bg-violet-50 font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading === "Aditi" ? (
                                            <span className="flex items-center gap-2">
                                                <Activity className="h-4 w-4 animate-spin text-violet-600" />
                                                INITIALIZING...
                                            </span>
                                        ) : (
                                            "Access Workspace"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COL 2: Metrics & Feed - 8 Cols */}
                    <div className="lg:col-span-8 flex flex-col gap-4 h-full min-h-0">

                        {/* 1. Compact HUD Strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[120px] shrink-0">
                            {/* Card 1: Leads */}
                            <div
                                onClick={() => router.push('/workspace/leads')}
                                className="bg-[#0B0F19]/50 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:bg-[#0B0F19]/80 transition-colors cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute right-0 top-0 p-16 bg-violet-600/10 blur-[60px] rounded-full pointer-events-none"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div className="p-2 bg-violet-500/10 rounded-md border border-violet-500/20 text-violet-400">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                </div>
                                <div className="z-10">
                                    <div className="text-3xl font-black text-white tracking-tighter">{stats?.leads?.value || 0}</div>
                                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Total Leads</div>
                                </div>
                            </div>

                            {/* Card 2: Revenue Unlocked (ROI) - REAL DATA FIX */}
                            <div
                                onClick={() => router.push('/report/revenue')}
                                className="bg-[#0B0F19]/50 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:bg-[#0B0F19]/80 transition-colors cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute right-0 top-0 p-16 bg-emerald-600/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-emerald-600/20 transition-all"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div className="p-2 bg-emerald-500/10 rounded-md border border-emerald-500/20 text-emerald-400">
                                        <IndianRupee className="h-4 w-4" />
                                    </div>
                                    <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                                </div>
                                <div className="z-10">
                                    <div className="text-3xl font-black text-white tracking-tighter flex items-center gap-1">
                                        <span className="text-2xl text-slate-500 font-bold">₹</span>
                                        {stats?.revenue?.value || "0"}
                                    </div>
                                    <div className="text-[10px] font-medium text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                                        Revenue Unlocked
                                        <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded text-[8px] border border-emerald-500/20">ROI</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500 mt-0.5">from dead leads revived</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Terminal Log - Fills Remaining Space */}
                        <div className="flex-1 bg-[#05060A] border border-white/10 rounded-2xl overflow-hidden flex flex-col relative min-h-0">
                            <div className="bg-[#0B0F19] border-b border-white/5 py-2 px-4 flex items-center justify-between shrink-0">
                                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                    SECURE_LOG_V2.0
                                </span>
                                <div className="flex gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700"></div>
                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700"></div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto custom-scrollbar p-4 font-mono text-xs relative">
                                <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-white/5 border-r border-dashed border-white/5"></div>
                                <div className="space-y-3">
                                    {liveActivity.map((item: ActivityItem, i: number) => (
                                        <div key={i} className={`flex items-start gap-3 ${i === 0 ? 'text-white' : 'text-slate-500'}`}>
                                            <div className="min-w-[50px] text-[9px] pt-0.5 opacity-70 tabular-nums text-right">{item.time}</div>
                                            <div className={`mt-1.5 h-1 w-1 rounded-full shrink-0 z-10 ${i === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                                            <div className="flex-1 break-words leading-relaxed">
                                                <span className={`${i === 0 ? 'text-emerald-400' : 'text-slate-600'} mr-1.5`}>➜</span>
                                                {item.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#0B0F19] border-t border-white/5 py-1.5 px-4 flex justify-between items-center text-[9px] text-slate-500 uppercase tracking-wider font-medium shrink-0">
                                <span>Status: Active</span>
                                <span className="text-emerald-500">● LIVE</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
