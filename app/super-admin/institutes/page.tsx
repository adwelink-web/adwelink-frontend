import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Phone, MessageSquare, Store, UserPlus } from "lucide-react"
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

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* Main Scrollable Container */}
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">

                {/* Sticky Blurred Header Section */}
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center ring-1 ring-blue-500/30">
                                    <Store className="h-5 w-5 text-blue-500" />
                                </div>
                                Institutes
                                <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                    <span className="text-slate-400">{institutes.length} clients</span>
                                </span>
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage all your onboarded coaching institutes</p>
                        </div>

                        <Link href="/super-admin/onboard">
                            <Button className="bg-violet-500 text-white hover:bg-violet-600 shadow-lg shadow-violet-500/25 font-bold">
                                <UserPlus className="mr-2 h-4 w-4" /> Onboard New Client
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content Section */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                    {/* Institutes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {institutes.map((inst) => (
                            <Link key={inst.id} href={`/super-admin/institutes/${inst.id}`} className="block">
                                <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-blue-500/20 hover:scale-[1.02] transition-all h-full group">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div>
                                            <CardTitle className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{inst.name}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground font-medium">
                                                <MapPin className="h-3 w-3" />
                                                {inst.city || "No city"}
                                            </div>
                                        </div>
                                        <Badge variant={
                                            inst.current_plan === "domination" ? "default" :
                                                inst.current_plan === "growth" ? "secondary" :
                                                    inst.current_plan === "starter" ? "outline" :
                                                        "secondary"
                                        } className="uppercase text-[10px]">
                                            {inst.current_plan || "trial"}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Usage Bar */}
                                        <div className="mb-5 bg-white/5 p-3 rounded-lg border border-white/5">
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Message Usage</span>
                                                <span className="text-white font-mono font-bold">{inst.messages_used || 0} <span className="text-muted-foreground font-normal">/ {inst.message_limit || 50}</span></span>
                                            </div>
                                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full transition-all"
                                                    style={{ width: `${Math.min(((inst.messages_used || 0) / (inst.message_limit || 50)) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2.5 text-xs">
                                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                                <Phone className="h-3.5 w-3.5" />
                                                <span>{inst.helpline_number || "No helpline"}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                <span>WhatsApp: {inst.phone_id ? <span className="text-emerald-500 font-medium">Connected</span> : <span className="text-muted-foreground">Not setup</span>}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 pt-4 border-t border-white/5 flex gap-2">
                                            <Button variant="outline" size="sm" className="w-full text-xs h-8 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30">View Dashboard</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}

                        {institutes.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-gradient-to-br from-violet-500/5 to-transparent rounded-3xl border border-white/10 border-dashed">
                                <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white">No institutes found</h3>
                                <p className="text-muted-foreground text-sm mb-6">Get started by adding your first client.</p>
                                <Link href="/super-admin/onboard">
                                    <Button variant="outline" className="hover:bg-violet-500/10 hover:text-violet-400">
                                        <UserPlus className="mr-2 h-4 w-4" /> Onboard Client
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
