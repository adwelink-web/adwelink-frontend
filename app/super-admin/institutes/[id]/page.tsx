import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

    const planColors: Record<string, string> = {
        trial: "bg-slate-500/20 text-slate-400 border-slate-500/20",
        starter: "bg-blue-500/20 text-blue-400 border-blue-500/20",
        growth: "bg-purple-500/20 text-purple-400 border-purple-500/20",
        domination: "bg-amber-500/20 text-amber-400 border-amber-500/20"
    }

    return (
        <div className="p-8">
            {/* Back Button */}
            <Link href="/super-admin/institutes" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Institutes
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        {institute.name}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${planColors[institute.current_plan || "trial"]}`}>
                            {institute.current_plan || "trial"}
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {institute.city || "No city"}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {institute.helpline_number || "No helpline"}</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-white/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Total Leads</p>
                                <p className="text-2xl font-bold text-white">{leadsCount}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Messages Used</p>
                                <p className="text-2xl font-bold text-white">{institute.messages_used || 0}/{institute.message_limit || 50}</p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase">WhatsApp</p>
                                <p className="text-lg font-bold text-white flex items-center gap-2">
                                    {institute.phone_id ? (
                                        <><CheckCircle className="h-4 w-4 text-emerald-400" /> Connected</>
                                    ) : (
                                        <><XCircle className="h-4 w-4 text-red-400" /> Not Setup</>
                                    )}
                                </p>
                            </div>
                            <Phone className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Created</p>
                                <p className="text-sm font-bold text-white">{institute.created_at ? new Date(institute.created_at).toLocaleDateString() : "N/A"}</p>
                            </div>
                            <Building2 className="h-8 w-8 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details & Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Institute Details */}
                <Card className="border-white/10">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500">Phone Number ID</p>
                                <p className="text-white font-mono text-xs mt-1">{institute.phone_id || "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Access Token</p>
                                <p className="text-white font-mono text-xs mt-1">{institute.access_token ? "••••••••" : "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Address</p>
                                <p className="text-white text-xs mt-1">{institute.address || "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Google Maps</p>
                                <p className="text-white text-xs mt-1">{institute.google_map_link ? "Set" : "Not set"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card className="border-white/10">
                    <CardHeader>
                        <CardTitle>Recent Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentLeads.map((lead: any) => (
                                <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <div>
                                        <p className="font-medium text-white text-sm">{lead.name || "Unknown"}</p>
                                        <p className="text-xs text-slate-500">{lead.phone}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${lead.status === "hot" ? "bg-red-500/20 text-red-400" :
                                        lead.status === "warm" ? "bg-amber-500/20 text-amber-400" :
                                            "bg-slate-500/20 text-slate-400"
                                        }`}>
                                        {lead.status || "new"}
                                    </span>
                                </div>
                            ))}
                            {recentLeads.length === 0 && (
                                <p className="text-slate-500 text-center py-4">No leads yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
