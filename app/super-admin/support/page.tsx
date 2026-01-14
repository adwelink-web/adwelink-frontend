import { createServerClient } from "@/lib/supabase-server"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, MessageSquare, AlertCircle } from "lucide-react"

async function getTickets() {
    const supabase = await createServerClient()
    const { data: tickets } = await supabase
        .from("support_tickets")
        .select(`
            *,
            institutes ( name )
        `)
        .order("created_at", { ascending: false })
    return tickets || []
}

export default async function SupportPage() {
    const tickets = await getTickets()

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center ring-1 ring-orange-500/30">
                                    <HelpCircle className="h-5 w-5 text-orange-500" />
                                </div>
                                Support Tickets
                                <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                    <span className="text-slate-400">{tickets.length} tickets</span>
                                </span>
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage client support requests and issues</p>
                        </div>
                    </div>
                </div>

                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                    {tickets.length === 0 ? (
                        <div className="text-center py-20 bg-gradient-to-br from-orange-500/5 to-transparent rounded-3xl border border-white/10 border-dashed">
                            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white">No tickets found</h3>
                            <p className="text-muted-foreground text-sm">Great! No open issues to resolve.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tickets.map((ticket) => (
                                <Card key={ticket.id} className="bg-gradient-to-br from-white/5 to-transparent border-white/10 backdrop-blur-md shadow-lg hover:bg-white/10 transition-colors">
                                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        ticket.status === 'open' ? 'destructive' :
                                                            ticket.status === 'in_progress' ? 'default' :
                                                                'secondary'
                                                    }
                                                    className="uppercase text-[10px]"
                                                >
                                                    {ticket.status}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={`uppercase text-[10px] ${ticket.priority === 'urgent' ? 'border-red-500 text-red-500' :
                                                        ticket.priority === 'high' ? 'border-orange-500 text-orange-500' :
                                                            'border-slate-500 text-slate-500'
                                                        }`}
                                                >
                                                    {ticket.priority} Priority
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-base font-bold text-white">{ticket.subject}</CardTitle>
                                            {ticket.institutes && (
                                                <CardDescription className="text-xs text-muted-foreground">
                                                    Client: <span className="text-white/70">{ticket.institutes.name}</span>
                                                </CardDescription>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                                            Opened {new Date(ticket.created_at || new Date()).toLocaleDateString()}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="text-sm text-slate-300">
                                        {ticket.description}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
