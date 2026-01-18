"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Activity, BrainCircuit, Users, Sparkles, TrendingUp, Zap, ShieldCheck, ChevronLeft, ChevronRight, GraduationCap, Wallet, MessageSquare, Power } from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"

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
    chatsHandled?: { value: string; count: number }
    activityFeed?: ActivityItem[]
    userName?: string
    businessName?: string
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
    const [activeAgentIndex, setActiveAgentIndex] = useState(0)

    // Agent Carousel Data
    const agents = [
        {
            name: "Aditi",
            role: "AI Counselor",
            icon: BrainCircuit,
            color: "violet",
            status: "active",
            efficiency: "--",
            latency: "--"
        },
        {
            name: "Teacher",
            role: "AI Tutor",
            icon: GraduationCap,
            color: "blue",
            status: "coming-soon"
        },
        {
            name: "Accountant",
            role: "Fee Recovery",
            icon: Wallet,
            color: "amber",
            status: "coming-soon"
        }
    ]

    const currentAgent = agents[activeAgentIndex]

    const nextAgent = () => {
        setActiveAgentIndex((prev) => (prev + 1) % agents.length)
    }

    const prevAgent = () => {
        setActiveAgentIndex((prev) => (prev - 1 + agents.length) % agents.length)
    }

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
            setDateString(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }))
        }
        updateTime()
        const timer = setInterval(updateTime, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleSelect = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (currentAgent.status !== "active") return
        setLoading("Aditi")
        document.cookie = `activeAgent=Aditi; path=/; max-age=604800`
        window.location.href = "/workspace"
    }

    const liveActivity = stats?.activityFeed || []

    return (
        <div className="h-full w-full bg-[#030712] relative overflow-hidden flex flex-col font-sans selection:bg-violet-500/30">

            {/* 🌌 Background VFX - Page-specific gradient (glows are global in sidebar-wrapper) */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-violet-900/10 to-transparent pointer-events-none" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

            {/* 🚀 COMPACT ONE-SCREEN INTERFACE */}
            <div className="relative z-10 flex-1 flex flex-col p-4 lg:p-6 h-full max-w-[1600px] mx-auto w-full min-h-0">

                {/* Signature Header */}
                <WorkspaceHeader
                    title="AMS Command Center"
                    subtitle="Your AI Workforce is ready. Select an agent to begin."
                    icon={Activity}
                    iconColor="text-emerald-500"
                    className="mb-3 shrink-0"
                    badge={
                        <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-normal whitespace-nowrap">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            </span>
                            <span className="text-emerald-400">System Online</span>
                        </span>
                    }
                >
                    <div className="flex items-center gap-3">
                        {/* Kill Switch */}
                        <button
                            onClick={() => {
                                if (confirm('⚠️ KILL SWITCH: Are you sure you want to stop the agent immediately?')) {
                                    alert('Agent stopped. (Feature coming soon)')
                                }
                            }}
                            className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all group"
                            title="Kill Switch - Stop Agent"
                        >
                            <Power className="h-4 w-4 group-hover:animate-pulse" />
                        </button>

                        <div className="text-right hidden sm:block">
                            <div className="text-base font-bold text-white tabular-nums tracking-tight leading-none">{currentTime}</div>
                            <div className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">{dateString}</div>
                        </div>
                    </div>
                </WorkspaceHeader>

                {/* MAIN CONTENT GRID - FLEX 1 TO FILL SPACE */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">

                    {/* COL 1: Agent Carousel */}
                    <div className="lg:col-span-4 flex flex-col h-full min-h-0">
                        {/* Agent Card */}
                        <div
                            onClick={() => handleSelect()}
                            className={`w-full max-h-[520px] h-full bg-gradient-to-b from-white/[0.03] to-transparent border rounded-2xl p-1 relative overflow-hidden group flex flex-col min-h-0 transition-all ${currentAgent.status === "active"
                                ? "border-white/10 cursor-pointer hover:border-violet-500/30"
                                : "border-white/5"
                                }`}
                        >
                            {/* LEFT/RIGHT ARROWS - Minimal, show on mobile, hover on PC */}
                            <button
                                onClick={(e) => { e.stopPropagation(); prevAgent(); }}
                                className="absolute left-1 top-1/2 -translate-y-1/2 z-50 h-6 w-6 flex items-center justify-center transition-all lg:opacity-0 lg:group-hover:opacity-100 hover:scale-125 active:scale-95"
                            >
                                <ChevronLeft className="h-4 w-4 text-white/70 hover:text-white drop-shadow-lg" />
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); nextAgent(); }}
                                className="absolute right-1 top-1/2 -translate-y-1/2 z-50 h-6 w-6 flex items-center justify-center transition-all lg:opacity-0 lg:group-hover:opacity-100 hover:scale-125 active:scale-95"
                            >
                                <ChevronRight className="h-4 w-4 text-white/70 hover:text-white drop-shadow-lg" />
                            </button>

                            {/* Dynamic BG Color */}
                            <div className={`absolute inset-0 ${currentAgent.color === "violet" ? "bg-violet-600/5 group-hover:bg-violet-600/10" :
                                currentAgent.color === "amber" ? "bg-amber-600/5" :
                                    "bg-blue-600/5"
                                } transition-colors`}></div>

                            {/* Coming Soon Overlay */}
                            {currentAgent.status === "coming-soon" && (
                                <div className="absolute inset-0 z-30 backdrop-blur-md bg-black/60 flex flex-col items-center justify-center">
                                    <div className="text-4xl font-black text-white/90 uppercase tracking-widest mb-2">Coming Soon</div>
                                    <p className="text-sm text-slate-400 mb-4">{currentAgent.name} is under development</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); router.push('/feedback'); }}
                                        className="px-4 py-2 flex items-center gap-2 text-white border border-white/20 hover:border-white/40 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-xs"
                                    >
                                        <MessageSquare className="h-3 w-3" />
                                        Give Feedback
                                    </button>
                                </div>
                            )}

                            {/* Inner Glass */}
                            <div className="h-full w-full bg-[#05060A]/80 backdrop-blur-xl rounded-xl border border-white/5 p-5 flex flex-col relative overflow-hidden min-h-0">

                                {/* Header */}
                                <div className="flex justify-between items-start z-10 shrink-0">
                                    <div>
                                        <h2 className="text-lg font-bold text-white leading-none">{currentAgent.name}</h2>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">{currentAgent.role}</p>
                                    </div>
                                    {currentAgent.status === "active" ? (
                                        <div className="px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Zap className="h-2 w-2 fill-current" /> Active
                                        </div>
                                    ) : (
                                        <div className="px-1.5 py-0.5 rounded border border-slate-500/30 bg-slate-500/10 text-slate-400 text-[8px] font-bold uppercase tracking-wider">
                                            Soon
                                        </div>
                                    )}
                                </div>

                                {/* Main Visual */}
                                <div className="flex-1 relative flex items-center justify-center min-h-0 py-2">
                                    <div className="relative h-32 w-32 lg:h-40 lg:w-40 group-hover:scale-105 transition-transform duration-500">
                                        <div className={`absolute inset-0 ${currentAgent.color === "violet" ? "bg-violet-500" :
                                            currentAgent.color === "amber" ? "bg-amber-500" :
                                                "bg-blue-500"
                                            } blur-[50px] opacity-20 animate-pulse`}></div>
                                        {/* Rings */}
                                        <div className={`absolute inset-0 border ${currentAgent.color === "violet" ? "border-violet-500/30" :
                                            currentAgent.color === "amber" ? "border-amber-500/30" :
                                                "border-blue-500/30"
                                            } rounded-full animate-[spin_10s_linear_infinite]`} />
                                        <div className={`absolute inset-3 border ${currentAgent.color === "violet" ? "border-violet-400/20" :
                                            currentAgent.color === "amber" ? "border-amber-400/20" :
                                                "border-blue-400/20"
                                            } rounded-full animate-[spin_15s_linear_infinite_reverse]`} />
                                        {/* Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className={`h-20 w-20 bg-[#0B0F19] rounded-full border ${currentAgent.color === "violet" ? "border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]" :
                                                currentAgent.color === "amber" ? "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]" :
                                                    "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                                } flex items-center justify-center`}>
                                                <currentAgent.icon className={`h-10 w-10 ${currentAgent.color === "violet" ? "text-violet-400" :
                                                    currentAgent.color === "amber" ? "text-amber-400" :
                                                        "text-blue-400"
                                                    }`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Stats & Action */}
                                <div className="w-full z-10 shrink-0 space-y-3">
                                    {currentAgent.status === "active" ? (
                                        <>
                                            {/* Metrics Hidden as per request */}
                                            {/* <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 hover:border-violet-500/30 transition-colors">
                                                    <div className="text-[8px] text-slate-400 uppercase tracking-wider mb-0.5">Efficiency</div>
                                                    <div className="text-base font-bold text-white leading-none">{currentAgent.efficiency}</div>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 hover:border-violet-500/30 transition-colors">
                                                    <div className="text-[8px] text-slate-400 uppercase tracking-wider mb-0.5">Latency</div>
                                                    <div className="text-base font-bold text-emerald-400 leading-none">{currentAgent.latency}</div>
                                                </div>
                                            </div> */}
                                            <Button
                                                onClick={(e) => handleSelect(e)}
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
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-slate-500 text-xs">This agent is not yet available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COL 2: Metrics & Feed - 8 Cols - AGENT SPECIFIC */}
                    <div className="hidden lg:flex lg:col-span-8 flex-col gap-4 h-full min-h-0">

                        {currentAgent.status === "active" ? (
                            <>
                                {/* 1. Compact HUD Strip - ADITI */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-auto md:h-[120px] shrink-0">
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
                                            <div className="text-2xl font-black text-white tracking-tighter">{stats?.leads?.value || 0}</div>
                                            <div className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">Total Leads</div>
                                        </div>
                                    </div>

                                    {/* Card 2: Chats Handled by Aditi */}
                                    <div
                                        onClick={() => router.push('/workspace')}
                                        className="bg-[#0B0F19]/50 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-4 flex flex-col justify-between hover:bg-[#0B0F19]/80 transition-colors cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className="absolute right-0 top-0 p-12 bg-violet-600/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-violet-600/20 transition-all"></div>
                                        <div className="flex justify-between items-start z-10">
                                            <div className="p-1.5 bg-violet-500/10 rounded-md border border-violet-500/20 text-violet-400">
                                                <BrainCircuit className="h-3.5 w-3.5" />
                                            </div>
                                            <Zap className="h-2.5 w-2.5 text-amber-400 animate-pulse" />
                                        </div>
                                        <div className="z-10">
                                            <div className="text-2xl font-black text-white tracking-tighter">
                                                {stats?.chatsHandled?.value || "0"}
                                            </div>
                                            <div className="text-[9px] font-medium text-violet-400 uppercase tracking-wide flex items-center gap-1">
                                                Chats Handled
                                                <span className="bg-violet-500/20 text-violet-300 px-1 rounded text-[7px] border border-violet-500/20">ADITI</span>
                                            </div>
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
                            </>
                        ) : (
                            <>
                                {/* COMING SOON CARDS - For Accountant/Teacher */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[120px] shrink-0">
                                    {/* Card 1: Agent-specific placeholder */}
                                    <div className="bg-[#0B0F19]/50 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                                        <div className={`absolute right-0 top-0 p-16 ${currentAgent.color === "amber" ? "bg-amber-600/10" : "bg-blue-600/10"} blur-[60px] rounded-full pointer-events-none`}></div>
                                        <div className={`p-2 ${currentAgent.color === "amber" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"} rounded-md border mb-2`}>
                                            {currentAgent.name === "Accountant" ? <Wallet className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                                        </div>
                                        <div className="text-lg font-bold text-white/50">Coming Soon</div>
                                        <div className="text-[10px] text-slate-500">{currentAgent.name === "Accountant" ? "Fee Recovery" : "Student Progress"}</div>
                                    </div>

                                    {/* Card 2: Agent-specific placeholder */}
                                    <div className="bg-[#0B0F19]/50 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                                        <div className={`absolute right-0 top-0 p-16 ${currentAgent.color === "amber" ? "bg-amber-600/10" : "bg-blue-600/10"} blur-[60px] rounded-full pointer-events-none`}></div>
                                        <div className={`p-2 ${currentAgent.color === "amber" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"} rounded-md border mb-2`}>
                                            {currentAgent.name === "Accountant" ? <TrendingUp className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                                        </div>
                                        <div className="text-lg font-bold text-white/50">Coming Soon</div>
                                        <div className="text-[10px] text-slate-500">{currentAgent.name === "Accountant" ? "Collections" : "Attendance"}</div>
                                    </div>
                                </div>

                                {/* 3. Coming Soon Log */}
                                <div className="flex-1 bg-[#05060A] border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-center relative min-h-0">
                                    <div className={`absolute inset-0 ${currentAgent.color === "amber" ? "bg-amber-600/5" : "bg-blue-600/5"}`}></div>
                                    <div className={`p-4 ${currentAgent.color === "amber" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"} rounded-full border mb-4`}>
                                        <currentAgent.icon className="h-8 w-8" />
                                    </div>
                                    <div className="text-2xl font-black text-white/60 uppercase tracking-widest mb-1">Coming Soon</div>
                                    <p className="text-sm text-slate-500">{currentAgent.name} analytics & logs</p>
                                    <p className="text-[10px] text-slate-600 mt-2">This module is under development</p>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
