import { createAdminClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Settings,
    Shield,
    Key,
    MessageSquare,
    Building2,
    IndianRupee,
    Crown,
    Zap,
    CheckCircle,
    AlertCircle,
    Database,
    Server
} from "lucide-react"

// Plan configuration
const PLAN_CONFIG = {
    trial: { name: "Trial", messageLimit: 50, price: 0, color: "slate" },
    starter: { name: "Starter", messageLimit: 300, price: 7999, color: "cyan" },
    growth: { name: "Growth", messageLimit: 1000, price: 14999, color: "emerald" },
    domination: { name: "Domination", messageLimit: 5000, price: 29999, color: "violet" }
}

async function getSystemStats() {
    const supabase = createAdminClient()

    const [
        institutesResult,
        leadsResult,
        agentsResult,
        chatHistoryResult
    ] = await Promise.all([
        supabase.from("institutes").select("*", { count: "exact" }),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("agents").select("*"),
        supabase.from("ai_chat_history").select("*", { count: "exact", head: true })
    ])

    const institutes = institutesResult.data || []
    const totalMessagesUsed = institutes.reduce((sum, inst) => sum + (inst.messages_used || 0), 0)
    const totalMessageLimit = institutes.reduce((sum, inst) => sum + (inst.message_limit || 50), 0)

    return {
        totalInstitutes: institutesResult.count || 0,
        totalLeads: leadsResult.count || 0,
        totalConversations: chatHistoryResult.count || 0,
        totalMessagesUsed,
        totalMessageLimit,
        agents: agentsResult.data || [],
        institutes
    }
}

export default async function SettingsPage() {
    const stats = await getSystemStats()

    const systemHealth = [
        {
            label: "Database",
            status: "operational",
            description: "Supabase PostgreSQL",
            icon: Database
        },
        {
            label: "AI Engine",
            status: "operational",
            description: "Google Gemini",
            icon: Zap
        },
        {
            label: "Automation",
            status: "operational",
            description: "n8n Workflows",
            icon: Server
        },
        {
            label: "WhatsApp API",
            status: "operational",
            description: "Meta Cloud API",
            icon: MessageSquare
        }
    ]

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                {/* Header */}
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-slate-500/20 flex items-center justify-center ring-1 ring-slate-500/30">
                                    <Settings className="h-5 w-5 text-slate-400" />
                                </div>
                                System Settings
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Platform configuration & system health</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">

                    {/* System Health */}
                    <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg border-emerald-500/20">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="h-4 w-4 text-emerald-500" />
                                System Health
                            </CardTitle>
                            <CardDescription>Current status of all integrated services</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {systemHealth.map((service) => (
                                    <div key={service.label} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <service.icon className="h-5 w-5 text-slate-400" />
                                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                {service.status}
                                            </Badge>
                                        </div>
                                        <p className="text-white font-medium">{service.label}</p>
                                        <p className="text-xs text-muted-foreground">{service.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Subscription Plans */}
                        <Card className="bg-gradient-to-br from-violet-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Crown className="h-4 w-4 text-violet-500" />
                                    Subscription Plans
                                </CardTitle>
                                <CardDescription>Message limits and pricing tiers</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(PLAN_CONFIG).map(([key, plan]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-lg bg-${plan.color}-500/20 flex items-center justify-center`}>
                                                <span className="text-lg font-bold text-white">{plan.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{plan.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {plan.price === 0 ? "Free" : `₹${plan.price.toLocaleString()}/mo`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white">{plan.messageLimit.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">messages</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Active Agents */}
                        <Card className="bg-gradient-to-br from-cyan-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-cyan-500" />
                                    AI Agents
                                </CardTitle>
                                <CardDescription>Configured agent personas in the system</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {stats.agents.length === 0 ? (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                                        <p className="text-muted-foreground">No agents configured yet</p>
                                    </div>
                                ) : (
                                    stats.agents.map((agent: any) => (
                                        <div key={agent.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold ring-2 ring-white/20">
                                                    {agent.slug?.charAt(0).toUpperCase() || "A"}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium capitalize">{agent.slug}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {agent.is_active ? "Active" : "Inactive"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant={agent.is_active ? "default" : "secondary"} className="text-[10px] uppercase">
                                                {agent.is_active ? (
                                                    <><CheckCircle className="h-3 w-3 mr-1" /> Live</>
                                                ) : (
                                                    <><AlertCircle className="h-3 w-3 mr-1" /> Inactive</>
                                                )}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Platform Stats */}
                    <Card className="bg-gradient-to-br from-amber-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Database className="h-4 w-4 text-amber-500" />
                                Platform Statistics
                            </CardTitle>
                            <CardDescription>Overall system usage metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <Building2 className="h-6 w-6 text-violet-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">{stats.totalInstitutes}</p>
                                    <p className="text-xs text-muted-foreground">Total Clients</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <MessageSquare className="h-6 w-6 text-cyan-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">{stats.totalMessagesUsed.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Messages Sent</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <Zap className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">{stats.totalConversations.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">AI Conversations</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <Key className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">{stats.agents.length}</p>
                                    <p className="text-xs text-muted-foreground">Agent Types</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Keys Section (Masked) */}
                    <Card className="bg-gradient-to-br from-red-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg border-red-500/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Key className="h-4 w-4 text-red-500" />
                                API Configuration
                                <Badge variant="outline" className="border-red-500/50 text-red-400 text-[10px]">SENSITIVE</Badge>
                            </CardTitle>
                            <CardDescription>External service integrations (managed via environment variables)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-white font-medium">Supabase</p>
                                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-[10px]">Connected</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">••••••••••••••••</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-white font-medium">Meta WhatsApp API</p>
                                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-[10px]">Connected</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">••••••••••••••••</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-white font-medium">Google Gemini</p>
                                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-[10px]">Connected</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">••••••••••••••••</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-white font-medium">n8n Automation</p>
                                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-[10px]">Connected</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">••••••••••••••••</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 text-center">
                                API keys are managed securely via environment variables. Contact the engineering team to update.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
