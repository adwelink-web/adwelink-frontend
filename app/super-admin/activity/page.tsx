import { createAdminClient } from "@/lib/supabase-server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, User, ShieldCheck } from "lucide-react"

async function getActivityLog() {
    const supabase = createAdminClient()
    const { data: logs } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
    return logs || []
}

export default async function ActivityPage() {
    const logs = await getActivityLog()

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-slate-500/20 flex items-center justify-center ring-1 ring-slate-500/30">
                                    <Activity className="h-5 w-5 text-slate-400" />
                                </div>
                                Activity Log
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Audit trail of all administrative actions</p>
                        </div>
                    </div>
                </div>

                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="space-y-4">
                        {logs.length === 0 ? (
                            <div className="text-center py-20 bg-gradient-to-br from-slate-500/5 to-transparent rounded-3xl border border-white/10 border-dashed">
                                <ShieldCheck className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white">No activity recorded</h3>
                                <p className="text-muted-foreground text-sm">System logs will appear here.</p>
                            </div>
                        ) : (
                            <div className="relative border-l border-white/10 ml-4 space-y-8">
                                {logs.map((log) => (
                                    <div key={log.id} className="relative pl-8">
                                        <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border border-slate-500 bg-slate-950" />
                                        <Card className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition-colors">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="border-slate-500/50 text-slate-400 uppercase text-[10px]">
                                                            {log.action}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(log.created_at || new Date()).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-white">
                                                        {log.details ? JSON.stringify(log.details) : "No details provided"}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                                        <User className="h-3 w-3" />
                                                        {log.actor_email || "System"} • {log.ip_address || "Unknown IP"}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
