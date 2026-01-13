import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search } from "lucide-react"

async function getAllLeads() {
    const supabase = await createServerClient()

    const { data: leads } = await supabase
        .from("leads")
        .select(`
            *,
            institutes (name)
        `)
        .order("created_at", { ascending: false })

    return leads || []
}

export default async function AllLeadsPage() {
    const leads = await getAllLeads()

    const statusColors: Record<string, string> = {
        hot: "bg-red-500/20 text-red-400",
        warm: "bg-amber-500/20 text-amber-400",
        cold: "bg-blue-500/20 text-blue-400",
        converted: "bg-emerald-500/20 text-emerald-400",
        lost: "bg-slate-500/20 text-slate-400"
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">All Leads</h1>
                <p className="text-slate-500 mt-1">{leads.length} total leads across all institutes</p>
            </div>

            {/* Table Card */}
            <Card className="border-white/10">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Name</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Phone</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Institute</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Course</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Status</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Score</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead: any) => (
                                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium text-white">{lead.name || "Unknown"}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-400 font-mono">{lead.phone}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-400">{lead.institutes?.name || "Unknown"}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-400">{lead.interested_course || "-"}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[lead.status] || "bg-slate-500/20 text-slate-400"}`}>
                                                {lead.status || "new"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-sm font-bold ${(lead.lead_score || 0) >= 70 ? "text-emerald-400" :
                                                (lead.lead_score || 0) >= 40 ? "text-amber-400" :
                                                    "text-slate-500"
                                                }`}>
                                                {lead.lead_score || 0}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-slate-500">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {leads.length === 0 && (
                            <div className="text-center py-16">
                                <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-500">No leads yet</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
