import { createAdminClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Phone, MessageSquare, Store, UserPlus } from "lucide-react"
import Link from "next/link"
import { WorkspaceHeader } from "@/components/workspace-header"

async function getInstitutes() {
    const supabase = createAdminClient()

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
                <div className="sticky top-0 z-50 backdrop-blur-xl px-4 md:px-8 py-4 mb-2">
                    <WorkspaceHeader
                        title="Institutes"
                        subtitle="Manage all your onboarded coaching institutes"
                        icon={Store}
                        iconColor="text-primary"
                        className="max-w-7xl mx-auto"
                        badge={
                            <span className="flex items-center space-x-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                <span className="text-muted-foreground">{institutes.length} clients</span>
                            </span>
                        }
                    >
                        <Link href="/super-admin/onboard">
                            <Button className="font-bold shadow-lg shadow-primary/25">
                                <UserPlus className="mr-2 h-4 w-4" /> Onboard New Client
                            </Button>
                        </Link>
                    </WorkspaceHeader>
                </div>

                {/* Content Section */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                    {/* Institutes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {institutes.map((inst) => {
                            // Dynamic color based on plan for vibrancy
                            const planColor =
                                inst.current_plan === "domination" ? "violet" :
                                    inst.current_plan === "growth" ? "emerald" :
                                        inst.current_plan === "starter" ? "cyan" : "slate";

                            return (
                                <Link key={inst.id} href={`/super-admin/institutes/${inst.id}`} className="block">
                                    <Card className={`bg-gradient-to-br from-${planColor}-500/10 to-transparent border-${planColor}-500/20 backdrop-blur-md shadow-lg hover:border-${planColor}-500/40 hover:scale-[1.02] transition-all h-full group bg-card/50`}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                                            <div>
                                                <CardTitle className={`text-lg font-bold text-foreground group-hover:text-${planColor}-500 transition-colors`}>{inst.name}</CardTitle>
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
                                            <div className="mb-5 bg-muted/50 p-3 rounded-lg border border-border">
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Message Usage</span>
                                                    <span className="text-foreground font-mono font-bold">{inst.messages_used || 0} <span className="text-muted-foreground font-normal">/ {inst.message_limit || 50}</span></span>
                                                </div>
                                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-${planColor}-500 rounded-full transition-all`}
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
                                            <div className="mt-5 pt-4 border-t border-border flex gap-2">
                                                <Button variant="outline" size="sm" className={`w-full text-xs h-8 hover:bg-${planColor}-500/10 hover:text-${planColor}-500 hover:border-${planColor}-500/30`}>View Dashboard</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}

                        {institutes.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl border border-border border-dashed">
                                <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground">No institutes found</h3>
                                <p className="text-muted-foreground text-sm mb-6">Get started by adding your first client.</p>
                                <Link href="/super-admin/onboard">
                                    <Button variant="outline" className="hover:bg-primary/10 hover:text-primary">
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
