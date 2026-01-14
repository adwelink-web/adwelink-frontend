import { createServerClient } from "@/lib/supabase-server"
import { BarChart3, TrendingUp, Users } from "lucide-react"

export default async function AnalyticsPage() {
    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center ring-1 ring-cyan-500/30">
                                    <BarChart3 className="h-5 w-5 text-cyan-500" />
                                </div>
                                Analytics
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Business performance metrics</p>
                        </div>
                    </div>
                </div>
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto text-center py-20 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics Dashboard Coming Soon</p>
                </div>
            </div>
        </div>
    )
}
