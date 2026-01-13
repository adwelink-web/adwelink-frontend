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
        trial: "bg-slate-500/20 text-slate-400",
        starter: "bg-blue-500/20 text-blue-400",
        growth: "bg-purple-500/20 text-purple-400",
        domination: "bg-amber-500/20 text-amber-400"
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Institutes</h1>
                    <p className="text-slate-500 mt-1">{institutes.length} total clients</p>
                </div>
                <Link href="/super-admin/onboard">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        + Onboard New Client
                    </Button>
                </Link>
            </div>

            {/* Institutes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {institutes.map((inst) => (
                    <Card key={inst.id} className="border-white/10 hover:border-purple-500/30 transition-colors">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-lg text-white">{inst.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                    <MapPin className="h-3 w-3" />
                                    {inst.city || "No city"}
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${planColors[inst.current_plan || "trial"]}`}>
                                {inst.current_plan || "trial"}
                            </span>
                        </CardHeader>
                        <CardContent>
                            {/* Usage Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Message Usage</span>
                                    <span className="text-white font-mono">{inst.messages_used || 0}/{inst.message_limit || 50}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                                        style={{ width: `${Math.min(((inst.messages_used || 0) / (inst.message_limit || 50)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Phone className="h-3 w-3" />
                                    <span>{inst.helpline_number || "No helpline"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>WhatsApp: {inst.phone_id ? "✅ Connected" : "❌ Not setup"}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                                <Link href={`/super-admin/institutes/${inst.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full text-xs">View Details</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {institutes.length === 0 && (
                    <div className="col-span-full text-center py-16">
                        <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500">No institutes yet</p>
                        <Link href="/super-admin/onboard" className="text-purple-400 text-sm hover:text-purple-300 mt-2 block">
                            Onboard your first client →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
