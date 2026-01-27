import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, Sparkles, ReceiptText, ShieldCheck, MessageSquare, Zap, AlertCircle, Plus, Clock, Building2, Phone, MapPin } from "lucide-react"
import { getBillingData } from "./actions"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WorkspaceHeader } from "@/components/workspace-header"

// Plan pricing in INR
const PLAN_PRICES: Record<string, number> = {
    free: 0,
    starter: 999,
    growth: 2999,
    premium: 4999,
    enterprise: 9999
}

const PLAN_FEATURES: Record<string, string[]> = {
    free: ["100 msgs", "1 Agent"],
    starter: ["1k msgs", "All Agents", "Email Support"],
    growth: ["5k msgs", "All Agents", "Priority"],
    premium: ["15k msgs", "All Agents", "Dedicated"],
    enterprise: ["Unlimited", "All Agents", "24/7"]
}

export default async function BillingPage() {
    const { institute, payments } = await getBillingData()

    const currentPlan = institute?.current_plan || "free"
    const subscriptionStatus = institute?.subscription_status || "active"
    const messageLimit = institute?.message_limit || 100
    const messagesUsed = institute?.messages_used || 0
    const usagePercent = Math.min(100, Math.round((messagesUsed / messageLimit) * 100))

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "-"
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const monthlyRevenue = 45000 // Placeholder
    // const subscriptionStatus = 'active' // This was already declared above, keeping the existing one.

    const usage = {
        requests: messagesUsed,
        limit: messageLimit,
        nextReset: "2024-07-01" // Placeholder
    }

    return (
        <div className="md:h-[calc(100vh-40px)] h-auto w-full md:overflow-hidden overflow-y-auto flex flex-col relative max-w-7xl mx-auto">
            {/* Background Gradients - Fixed position relative to the scrollable container */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Header - Sticky */}
            <div className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 mb-2 flex-none">
                <WorkspaceHeader
                    title="Billing & Subscription"
                    subtitle="Manage your plan and invoices."
                    icon={CreditCard}
                    iconColor="text-amber-500"
                    badge={
                        <Badge className={`h-5 px-1.5 text-[10px] ${subscriptionStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {subscriptionStatus === 'active' ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                    }
                />
            </div>

            {/* Main Content - Scrollable Area with Padding */}
            <div className="flex-1 space-y-4 p-4 pb-20 md:pb-4 md:p-8 z-10">
                {/* Main Grid - Adwelink Standard Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Left Column */}
                    <div className="flex flex-col gap-4 md:min-h-0 min-h-auto">

                        {/* Top Row: Plan & Usage (Side by Side) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* 1. Plan Card */}
                            <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-amber-500/20 h-full">
                                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                                            <Sparkles className="h-4 w-4 text-amber-500" />
                                            {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
                                        </CardTitle>
                                        <CardDescription className="text-[10px]">Active subscription</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="border-amber-500/20 text-amber-500 bg-amber-500/10 text-[10px] px-1.5 hidden lg:flex">
                                        {formatCurrency(PLAN_PRICES[currentPlan] || 0)}/mo
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 mb-3">
                                        {(PLAN_FEATURES[currentPlan] || []).slice(0, 2).map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[10px] text-slate-300">
                                                <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                                                <span className="truncate">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button size="sm" className="w-full h-7 text-[10px] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-lg shadow-amber-900/20">
                                        Upgrade Plan
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* 2. Usage Card */}
                            <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-violet-500/20 h-full">
                                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                                            <MessageSquare className="h-4 w-4 text-violet-500" />
                                            Usage
                                        </CardTitle>
                                        <CardDescription className="text-[10px]">Current billing cycle</CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 text-[10px] px-1.5">
                                        {Math.round((usage.requests / usage.limit) * 100)}%
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-slate-400">
                                                <span>Requests</span>
                                                <span className="text-white">{usage.requests.toLocaleString()} / {usage.limit.toLocaleString()}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min((usage.requests / usage.limit) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <div className="flex flex-row items-center justify-between text-[10px] text-slate-400 bg-white/5 p-1.5 rounded-lg border border-white/5">
                                                <span>Next Reset</span>
                                                <span className="text-white font-medium flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-slate-500" /> 12 Days
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 3. Institute Details (User Requested Simplification - "User/Institute Details") */}
                        <Card className="md:flex-1 md:h-auto h-auto min-h-[250px] bg-gradient-to-br from-blue-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg flex flex-col">
                            <CardHeader className="flex flex-col gap-4 pb-4">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                                            <Building2 className="h-4 w-4 text-blue-500" />
                                            Institute Details
                                        </CardTitle>
                                        <CardDescription className="text-xs">Your registered billing information</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 px-6 pb-6">
                                {/* Simple Manual Payment / Details Display */}
                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Institute Name</p>
                                            <p className="text-sm font-medium text-white">{institute?.name || "Unknown Institute"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Location</p>
                                            <p className="text-sm font-medium text-white">{institute?.city || "Unknown City"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Helpline / Contact</p>
                                            <p className="text-sm font-medium text-white">{institute?.helpline_number || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <p className="text-[10px] text-amber-200/80 mb-1 font-bold flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> Manual Payment Note:
                                    </p>
                                    <p className="text-[10px] text-amber-200/60">
                                        We currently accept manual UPI payments. Please contact admin support for upgrades or billing queries.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: History (Re-styled to Match Super Admin Table) */}
                    <Card className="flex flex-col bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg md:min-h-0 md:h-full h-[500px]">
                        <CardHeader className="flex flex-col gap-4 pb-0 pt-4 px-4 flex-none">
                            <div className="flex flex-row items-center justify-between w-full">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                                        <ReceiptText className="h-4 w-4 text-emerald-500" />
                                        Payment History
                                    </CardTitle>
                                    <CardDescription className="text-xs">Recent transactions and invoices</CardDescription>
                                </div>
                                <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400 mr-2">
                                    Recent
                                </Badge>
                            </div>

                        </CardHeader>

                        <CardContent className="p-0 flex flex-col flex-1 min-h-0 relative">
                            {/* Simple Text Header */}
                            <div className="flex-none -mt-4 z-20 mx-6 mb-2">
                                <div className="grid grid-cols-12 px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider shadow-sm">
                                    <div className="col-span-4 pl-2">Date</div>
                                    <div className="col-span-3">Amount</div>
                                    <div className="col-span-3">Status</div>
                                    <div className="col-span-2 text-right pr-2">#</div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-2 space-y-1">
                                {payments.length === 0 ? (
                                    <div className="px-6 py-8 text-center text-muted-foreground text-xs">
                                        No payments found.
                                    </div>
                                ) : (
                                    payments.map((payment) => (
                                        <div key={payment.id} className="grid grid-cols-12 items-center p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer text-xs">
                                            <div className="col-span-4 pl-2">
                                                <div className="font-medium text-white">{formatDate(payment.payment_date)}</div>
                                                <div className="text-[10px] text-slate-500 uppercase">{payment.payment_method || "UPI"}</div>
                                            </div>
                                            <div className="col-span-3 text-white font-medium">
                                                {formatCurrency(payment.amount ?? 0)}
                                            </div>
                                            <div className="col-span-3">
                                                <Badge variant={
                                                    payment.status === 'success' || payment.status === 'completed' ? 'default' :
                                                        payment.status === 'pending' ? 'secondary' : 'destructive'
                                                } className={`text-[9px] uppercase h-5 px-1.5 ${payment.status === 'success' || payment.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''
                                                    }`}>
                                                    {payment.status === 'success' || payment.status === 'completed' ? 'Paid' : payment.status}
                                                </Badge>
                                            </div>
                                            <div className="col-span-2 text-right pr-2">
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-white/10">
                                                    <Download className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tiny Footer */}
                <div className="flex-none text-center">
                    <p className="text-[10px] text-slate-600">
                        Need help? email <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">support@adwelink.com</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
