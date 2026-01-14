import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Phone, MessageSquare, Users, ArrowLeft, Key, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getInstituteDetails(id: string) {
    const supabase = await createServerClient()

    // Get institute
    const { data: institute } = await supabase
        .from("institutes")
        .select("*")
        .eq("id", id)
        .single()

    if (!institute) return null

    // Get leads count
    const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("institute_id", id)

    // Get recent leads
    const { data: recentLeads } = await supabase
        .from("leads")
        .select("*")
        .eq("institute_id", id)
        .order("created_at", { ascending: false })
        .limit(10)

    return { institute, leadsCount: leadsCount || 0, recentLeads: recentLeads || [] }
}

export default async function InstituteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getInstituteDetails(id)

    if (!data) {
        notFound()
    }

    const { institute, leadsCount, recentLeads } = data

    return (
        <div className="p-8">
            {/* Back Button */}
            <Link href="/super-admin/institutes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Institutes
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        {institute.name}
                        <Badge variant="outline" className="uppercase text-xs tracking-wider">
                            {institute.current_plan || "trial"}
                        </Badge>
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {institute.city || "No city"}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {institute.helpline_number || "No helpline"}</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Total Leads</p>
                                <p className="text-2xl font-bold text-foreground">{leadsCount}</p>
                            </div>
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Messages Used</p>
                                <p className="text-2xl font-bold text-foreground">{institute.messages_used || 0}/{institute.message_limit || 50}</p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-sky-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">WhatsApp</p>
                                <p className="text-lg font-bold text-foreground flex items-center gap-2">
                                    {institute.phone_id ? (
                                        <><CheckCircle className="h-4 w-4 text-emerald-500" /> Connected</>
                                    ) : (
                                        <><XCircle className="h-4 w-4 text-destructive" /> Not Setup</>
                                    )}
                                </p>
                            </div>
                            <Phone className="h-8 w-8 text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Created</p>
                                <p className="text-sm font-bold text-foreground">{institute.created_at ? new Date(institute.created_at).toLocaleDateString() : "N/A"}</p>
                            </div>
                            <Building2 className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details & Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Institute Details */}
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Phone Number ID</p>
                                <p className="text-foreground font-mono text-xs mt-1">{institute.phone_id || "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Access Token</p>
                                <p className="text-foreground font-mono text-xs mt-1">{institute.access_token ? "••••••••" : "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Address</p>
                                <p className="text-foreground text-xs mt-1">{institute.address || "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Google Maps</p>
                                <p className="text-foreground text-xs mt-1">{institute.google_map_link ? "Set" : "Not set"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Recent Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentLeads.map((lead: any) => (
                                <div key={lead.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/40 transition-colors">
                                    <div>
                                        <p className="font-medium text-foreground text-sm">{lead.name || "Unknown"}</p>
                                        <p className="text-xs text-muted-foreground">{lead.phone}</p>
                                    </div>
                                    <Badge variant={
                                        lead.status === "hot" ? "destructive" :
                                            lead.status === "warm" ? "secondary" :
                                                "outline"
                                    } className="text-[10px] uppercase">
                                        {lead.status || "new"}
                                    </Badge>
                                </div>
                            ))}
                            {recentLeads.length === 0 && (
                                <p className="text-muted-foreground text-center py-4">No leads yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
