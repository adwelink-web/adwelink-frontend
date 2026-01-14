import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
                <p className="text-muted-foreground mt-1">{leads.length} total leads across all institutes</p>
            </div>

            {/* Table Card */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/40">
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Institute</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead: any) => (
                                <TableRow key={lead.id} className="border-border/40 hover:bg-muted/5">
                                    <TableCell>
                                        <p className="font-medium text-foreground">{lead.name || "Unknown"}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-muted-foreground font-mono text-xs">{lead.phone}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-muted-foreground text-sm">{lead.institutes?.name || "Unknown"}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-muted-foreground text-sm">{lead.interested_course || "-"}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            lead.status === "hot" ? "destructive" :
                                                lead.status === "warm" ? "secondary" : // or a custom warning variant if available
                                                    lead.status === "converted" ? "default" :
                                                        "outline"
                                        } className="uppercase text-[10px]">
                                            {lead.status || "new"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-sm font-bold ${(lead.lead_score || 0) >= 70 ? "text-emerald-500" :
                                            (lead.lead_score || 0) >= 40 ? "text-amber-500" :
                                                "text-muted-foreground"
                                            }`}>
                                            {lead.lead_score || 0}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {leads.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Users className="h-8 w-8 text-muted-foreground/50" />
                                            <p>No leads yet</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
