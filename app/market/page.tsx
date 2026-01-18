import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, GraduationCap, Wallet, ShieldCheck } from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { HireAgentButton } from "@/components/market/hire-agent-button"

export default function AgentMarketPage() {
    // REAL BUSINESS DATA
    // Reflecting actual planned agents for Adwelink.
    const availableAgents = [
        {
            name: "Aditi",
            role: "Senior Counselor (Sales)",
            desc: "Your diligent Sales Employee. She handles inquiries, qualifies leads, and ensures admissions 24/7.",
            icon: BrainCircuit,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            status: "Active", // Aditi is already hired/active
            hired: true
        },
        {
            name: "Rahul Sir",
            role: "Academic Head (Tutor)",
            desc: "Your AI Faculty Member. He is a trainable teacher who conducts classes and solves student doubts in your style.",
            icon: GraduationCap,
            color: "text-slate-500", // Dimmed color
            bg: "bg-slate-500/10",
            hired: false,
            comingSoon: true
        },
        {
            name: "Accountant",
            role: "Fee Recovery Specialist",
            desc: "He tracks student payments and intelligently follows up with parents to recover pending fees without being rude.",
            icon: Wallet,
            color: "text-slate-500", // Dimmed color
            bg: "bg-slate-500/10",
            hired: false,
            comingSoon: true
        }
    ]

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* 🌌 Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full" />
            </div>

            {/* Header - Fixed at top */}
            <WorkspaceHeader
                title="AI Recruiting"
                subtitle="Build your Digital Workforce. Hire AI employees that work like humans."
                icon={BrainCircuit}
                iconColor="text-purple-500"
                className="px-4 md:px-8 py-6 z-20 shrink-0 max-w-7xl mx-auto w-full"
                badge={
                    <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                        <span className="text-emerald-400">3 Agents Available</span>
                    </span>
                }
            >
                <Button className="w-full md:w-auto bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/25 font-bold">
                    <BrainCircuit className="mr-2 h-4 w-4" /> View Hired Agents
                </Button>
            </WorkspaceHeader>

            {/* Main Scrollable Container */}
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                {/* Scrollable Content Section */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {availableAgents.map((agent) => {
                            if ('comingSoon' in agent && agent.comingSoon) {
                                return (
                                    <Card key={agent.name} className="bg-white/[0.02] border-white/10 border-dashed backdrop-blur-sm flex flex-col items-center justify-center p-4 opacity-60 hover:opacity-100 transition-all min-h-[180px] group rounded-xl">
                                        <agent.icon className="h-8 w-8 text-slate-500 mb-2" />
                                        <h3 className="text-slate-400 font-medium text-sm">{agent.name}</h3>
                                        <span className="mt-3 bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Coming Soon
                                        </span>
                                    </Card>
                                )
                            }

                            return (
                                <Card key={agent.name} className={`bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-md shadow-xl border-white/10 transition-all ${agent.hired ? 'border-purple-500/20 bg-purple-500/[0.08]' : 'hover:border-white/20 hover:scale-[1.02]'} min-h-[180px] rounded-xl overflow-hidden`}>
                                    <CardHeader className="py-3 px-4">
                                        <div className="flex justify-between items-start">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${agent.bg} ${agent.color}`}>
                                                <agent.icon className="h-4 w-4" />
                                            </div>
                                            {agent.hired && (
                                                <span className="bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                                    Hired
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-white text-base">{agent.name}</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium text-xs">{agent.role}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="py-2 px-4 space-y-3">
                                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{agent.desc}</p>
                                        <div className="flex items-center justify-end pt-2 border-t border-white/5">
                                            {agent.hired ? (
                                                <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 h-7 text-xs" disabled>
                                                    Active
                                                </Button>
                                            ) : (
                                                <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white h-7 text-xs">
                                                    Hire Now
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}

                        {/* Generic Placeholder */}
                        <Card className="bg-white/5 border-white/10 border-dashed flex flex-col items-center justify-center p-4 opacity-40 hover:opacity-80 transition-opacity min-h-[180px] rounded-xl">
                            <ShieldCheck className="h-8 w-8 text-slate-600 mb-2" />
                            <h3 className="text-slate-500 font-medium text-sm">HR Manager</h3>
                            <p className="text-[10px] text-slate-700 text-center mt-1">TBA</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
