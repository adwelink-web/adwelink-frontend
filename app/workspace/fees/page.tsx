import { WalletCards, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FeesPage() {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto h-[80vh] flex items-center justify-center">
            <div className="relative w-full max-w-lg">
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm overflow-hidden group">
                    {/* Locked Banner */}
                    <div className="absolute top-0 right-0 bg-white/5 px-3 py-1 rounded-bl-xl border-b border-l border-white/5">
                        <Lock className="h-4 w-4 text-slate-500" />
                    </div>

                    <div className="mb-6 flex justify-center">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-500/50 transition-colors">
                            <WalletCards className="h-10 w-10 text-emerald-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Munim Ji (Finance Agent)</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        Our advanced financial AI is currently in <span className="text-emerald-400 font-semibold">Beta Testing</span>.
                        <br />
                        Soon, "Munim Ji" will handle your fee collection, generate invoices, and track revenue automatically.
                    </p>

                    <div className="flex items-center justify-center gap-3">
                        <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white pointer-events-none opacity-50">
                            View Roadmap
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 gap-2">
                            <Sparkles className="h-4 w-4" /> Get Early Access
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
