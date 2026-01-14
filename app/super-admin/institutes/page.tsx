import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"

async function getInstitutes() {
    const supabase = await createServerClient()

    const { data: institutes } = await supabase
        .from("institutes")
        .select("*")
        .order("created_at", { ascending: false })

    return institutes || []
}

export default async function InstitutesPage() {
    const institutes = await getInstitutes()

    const planColors: Record<string, string> = {
        trial: "bg-primary/10 text-primary border-primary/20",
        starter: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        growth: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        domination: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Institutes</h1>
                    <p className="text-muted-foreground mt-1">{institutes.length} total clients</p>
                </div>
                <Link href="/super-admin/onboard">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                        <Building2 className="mr-2 h-4 w-4" /> Onboard New Client
                    </Button>
                </Link>
            </div>

            {/* Institutes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {institutes.map((inst) => (
                    <Card key={inst.id} className="bg-white/[0.02] border-white/10 hover:border-primary/30 transition-all hover:bg-white/[0.04] group">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{inst.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground font-medium">
                                    <MapPin className="h-3 w-3" />
                                    {inst.city || "No city"}
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${planColors[inst.current_plan || "trial"]}`}>
                                {inst.current_plan || "trial"}
                            </span>
                        </CardHeader>
                        <CardContent>
                            {/* Usage Bar */}
                            <div className="mb-5 bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Message Usage</span>
                                    <span className="text-foreground font-mono font-bold">{inst.messages_used || 0} <span className="text-muted-foreground font-normal">/ {inst.message_limit || 50}</span></span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                                        style={{ width: `${Math.min(((inst.messages_used || 0) / (inst.message_limit || 50)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2.5 text-xs">
                                <div className="flex items-center gap-2.5 text-slate-400">
                                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                                    <span>{inst.helpline_number || "No helpline"}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-400">
                                    <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                                    <span>WhatsApp: {inst.phone_id ? <span className="text-emerald-400 font-medium">Connected</span> : <span className="text-slate-600">Not setup</span>}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-5 pt-4 border-t border-white/5 flex gap-2">
                                <Link href={`/super-admin/institutes/${inst.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full text-xs h-8 border-white/10 hover:bg-white/5 hover:text-white">View Dashboard</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {institutes.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
                        <Building2 className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-400">No institutes found</h3>
                        <p className="text-slate-500 text-sm mb-6">Get started by adding your first client.</p>
                        <Link href="/super-admin/onboard">
                            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                                Onboard Client
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
