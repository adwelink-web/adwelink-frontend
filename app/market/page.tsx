import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, GraduationCap, Wallet, ShieldCheck } from "lucide-react"
import { HireAgentButton } from "@/components/market/hire-agent-button"

export default function AgentMarketPage() {
    // REAL BUSINESS DATA
    // Reflecting actual planned agents for Adwelink.
    const availableAgents = [
        {
            name: "Aditi",
            role: "Senior Counselor (Sales)",
            desc: "Your diligent Sales Employee. She handles inquiries, qualifies leads, and ensures admissions 24/7.",
            price: "₹4,999/mo",
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
            price: "₹6,999/mo",
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
            price: "₹2,999/mo",
            icon: Wallet,
            color: "text-slate-500", // Dimmed color
            bg: "bg-slate-500/10",
            hired: false,
            comingSoon: true
        }
    ]

    return (
        <div className="h-full w-full overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 md:p-8 min-h-0">
                {/* Header (Frozen) */}
                <div className="flex-none flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">AI Recruiting</h1>
                        <p className="text-slate-400">Build your Digital Workforce. Hire AI employees that work like humans.</p>
                    </div>
                </div>

                {/* Content Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pr-2 bg-transparent">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                        {availableAgents.map((agent) => {
                            if ((agent as any).comingSoon) {
                                return (
                                    <Card key={agent.name} className="bg-white/5 border-white/10 border-dashed flex flex-col items-center justify-center p-6 opacity-60 hover:opacity-100 transition-opacity min-h-[300px]">
                                        <agent.icon className="h-12 w-12 text-slate-500 mb-4" />
                                        <h3 className="text-slate-400 font-medium text-lg">{agent.name}</h3>
                                        {/* Date Removed as per user request (Flexible Timeline) */}
                                        <span className="mt-6 bg-slate-800 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Coming Soon
                                        </span>
                                    </Card>
                                )
                            }

                            return (
                                <Card key={agent.name} className={`bg-white/5 border-white/10 transition-colors ${agent.hired ? 'border-purple-500/30 bg-purple-500/5' : 'hover:bg-white/10'} min-h-[300px]`}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${agent.bg} ${agent.color}`}>
                                                <agent.icon className="h-6 w-6" />
                                            </div>
                                            {agent.hired && (
                                                <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                                    Hired
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-white text-xl">{agent.name}</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium">{agent.role}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <p className="text-sm text-slate-300 h-16 leading-relaxed">{agent.desc}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className="text-white font-bold text-lg">{agent.price}</span>
                                            {agent.hired ? (
                                                <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10" disabled>
                                                    Already Active
                                                </Button>
                                            ) : (
                                                <HireAgentButton agentName={agent.name} price={agent.price} />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}

                        {/* Generic Placeholder */}
                        <Card className="bg-white/5 border-white/10 border-dashed flex flex-col items-center justify-center p-6 opacity-40 hover:opacity-80 transition-opacity min-h-[300px]">
                            <ShieldCheck className="h-10 w-10 text-slate-600 mb-4" />
                            <h3 className="text-slate-500 font-medium">HR Manager</h3>
                            <p className="text-xs text-slate-700 text-center mt-2">Planned Logic (TBA)</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
