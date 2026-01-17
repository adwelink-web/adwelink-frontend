import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, Sparkles, ReceiptText, ShieldCheck, MessageSquare, Zap, AlertCircle, Plus } from "lucide-react"
import { getBillingData } from "./actions"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

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

    return (
        <div className="h-full w-full overflow-hidden flex flex-col p-4 gap-4 max-w-7xl mx-auto">

            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-amber-600/5 blur-[80px] rounded-full" />
            </div>

            {/* Header - Compact */}
            <div className="flex-none flex items-center justify-between z-10">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-amber-500" />
                        Billing & Subscription
                        <Badge className={`h-5 px-1.5 text-[10px] ${subscriptionStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {subscriptionStatus === 'active' ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                    </h2>
                    <p className="text-muted-foreground text-xs">Manage your plan and invoices.</p>
                </div>
            </div>

            {/* Main Grid - Compact Layout */}
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4 z-10">

                {/* Left Column: Plan & Usage */}
                <div className="flex flex-col gap-4 min-h-0">

                    {/* 1. Plan Card */}
                    <Card className="flex-none bg-gradient-to-br from-amber-500/[0.08] to-transparent border-amber-500/20 backdrop-blur-xl shadow-lg rounded-xl overflow-hidden">
                        <CardHeader className="py-3 px-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-amber-500 flex items-center gap-2 text-sm uppercase tracking-wide font-bold">
                                    <Sparkles className="h-4 w-4" />
                                    {currentPlan} Plan
                                </CardTitle>
                                <div className="text-xl font-bold text-white leading-none">
                                    {formatCurrency(PLAN_PRICES[currentPlan] || 0)}
                                    <span className="text-xs text-slate-500 font-normal ml-1">/mo</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 grid grid-cols-2 gap-2">
                            {(PLAN_FEATURES[currentPlan] || []).map((feature, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                                    <span className="truncate">{feature}</span>
                                </div>
                            ))}
                            <div className="col-span-2 mt-2">
                                <Button size="sm" className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold h-8 text-xs rounded-lg uppercase tracking-wider">
                                    <Zap className="mr-1.5 h-3 w-3" /> Upgrade Plan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Usage Card */}
                    <Card className="flex-none bg-gradient-to-br from-violet-500/[0.08] to-transparent border-violet-500/20 backdrop-blur-xl shadow-lg rounded-xl overflow-hidden">
                        <CardHeader className="py-3 px-4 border-b border-white/5">
                            <CardTitle className="text-white flex items-center justify-between text-sm uppercase tracking-wide font-bold">
                                <span className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-violet-500" /> Message Usage
                                </span>
                                <span className={`text-xs ${usagePercent > 80 ? 'text-red-400' : 'text-emerald-400'}`}>{usagePercent}%</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-end justify-between leading-none">
                                <span className="text-2xl font-bold text-white">{messagesUsed.toLocaleString('en-IN')}</span>
                                <span className="text-slate-500 text-xs mb-1">of {messageLimit.toLocaleString('en-IN')} limit</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                            {usagePercent > 80 && (
                                <div className="flex items-center gap-1.5 text-red-400 text-[10px] bg-red-500/5 p-1.5 rounded border border-red-500/10">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>Limit Reached! Upgrade now.</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 3. Payment Methods (Compact) */}
                    <Card className="flex-1 bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden min-h-0 flex flex-col">
                        <CardHeader className="py-3 px-4 border-b border-white/5 bg-white/[0.02]">
                            <CardTitle className="text-slate-200 flex items-center gap-2 text-xs uppercase tracking-wider font-bold">
                                <CreditCard className="h-3 w-3" /> Payment Methods
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
                            <div className="p-3 space-y-2">
                                {/* UPI */}
                                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-[#0B0F19] flex items-center justify-center text-[9px] font-bold text-emerald-500 border border-white/10">UPI</div>
                                        <div>
                                            <p className="text-xs font-semibold text-white">UPI / Apps</p>
                                            <p className="text-[10px] text-slate-500">PhonePe, GPay</p>
                                        </div>
                                    </div>
                                    <Plus className="h-4 w-4 text-slate-500 group-hover:text-white" />
                                </div>
                                {/* Bank */}
                                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-[#0B0F19] flex items-center justify-center text-[9px] font-bold text-blue-500 border border-white/10">NET</div>
                                        <div>
                                            <p className="text-xs font-semibold text-white">Net Banking</p>
                                            <p className="text-[10px] text-slate-500">All Banks</p>
                                        </div>
                                    </div>
                                    <Plus className="h-4 w-4 text-slate-500 group-hover:text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Invoice History (Full Height) */}
                <Card className="flex flex-col bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden min-h-0 h-full">
                    <CardHeader className="py-3 px-4 border-b border-white/5 bg-white/[0.02] flex-none">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-slate-200 flex items-center gap-2 text-xs uppercase tracking-wider font-bold">
                                <ReceiptText className="h-3 w-3" /> Payment History
                            </CardTitle>
                            <span className="text-[10px] text-slate-500">Last 12 months</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0 overflow-hidden relative">
                        <ScrollArea className="h-full w-full">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#0B0F19] z-10 text-[10px] uppercase text-slate-500 font-semibold border-b border-white/5">
                                    <tr>
                                        <th className="px-4 py-2 bg-[#0B0F19]">Date</th>
                                        <th className="px-4 py-2 bg-[#0B0F19]">Amount</th>
                                        <th className="px-4 py-2 bg-[#0B0F19]">Status</th>
                                        <th className="px-4 py-2 bg-[#0B0F19] text-right">Rec.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                                No payments yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap">
                                                    {formatDate(payment.payment_date)}
                                                </td>
                                                <td className="px-4 py-2.5 text-white font-medium">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${payment.status === 'success' || payment.status === 'completed'
                                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                        }`}>
                                                        {payment.status === 'success' || payment.status === 'completed' ? 'Paid' : 'Failed'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-500 hover:text-white hover:bg-white/10">
                                                        <Download className="h-3 w-3" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </ScrollArea>
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
    )
}
