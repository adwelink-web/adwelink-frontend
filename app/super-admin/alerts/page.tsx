import { createAdminClient } from "@/lib/supabase-server"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react"

async function getAlerts() {
    const supabase = createAdminClient()
    const { data: alerts } = await supabase
        .from("alerts")
        .select(`
            *,
            institutes ( name )
        `)
        .order("created_at", { ascending: false })
    return alerts || []
}

export default async function AlertsPage() {
    const alerts = await getAlerts()

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center ring-1 ring-red-500/30">
                                    <Bell className="h-5 w-5 text-red-500" />
                                </div>
                                System Alerts
                                <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                    <span className="text-slate-400">{alerts.length} alerts</span>
                                </span>
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Monitor critical system events and warnings</p>
                        </div>
                    </div>
                </div>

                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-4">
                    {alerts.length === 0 ? (
                        <div className="text-center py-20 bg-gradient-to-br from-red-500/5 to-transparent rounded-3xl border border-white/10 border-dashed">
                            <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white">All systems operational</h3>
                            <p className="text-muted-foreground text-sm">No active alerts at this moment.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {alerts.map((alert) => (
                                <Card key={alert.id} className="bg-gradient-to-br from-white/5 to-transparent border-white/10 backdrop-blur-md shadow-lg hover:bg-white/10 transition-colors">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 p-2 rounded-lg ${alert.severity === 'critical' ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/30' :
                                                alert.severity === 'warning' ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/30' :
                                                    'bg-blue-500/20 text-blue-500 ring-1 ring-blue-500/30'
                                                }`}>
                                                {alert.severity === 'critical' ? <AlertCircle className="h-5 w-5" /> :
                                                    alert.severity === 'warning' ? <AlertTriangle className="h-5 w-5" /> :
                                                        <Bell className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold text-white mb-1">{alert.title}</CardTitle>
                                                <CardDescription className="text-slate-400">{alert.message}</CardDescription>
                                                {alert.institutes && (
                                                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="font-semibold text-white/50">Institute:</span>
                                                        {alert.institutes.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge variant={alert.is_read ? "secondary" : "destructive"} className="uppercase text-[10px]">
                                                {alert.is_read ? "Read" : "New"}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{new Date(alert.created_at || new Date()).toLocaleDateString()}</span>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
