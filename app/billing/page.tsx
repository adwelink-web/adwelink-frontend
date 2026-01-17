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

            {/* Main Grid - Ultra Compact Layout */}
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 z-10 text-xs">

                {/* Left Column: Plan & Usage */}
                <div className="flex flex-col gap-3 min-h-0">

                    {/* 1. Plan Card */}
                    <Card className="flex-none bg-gradient-to-br from-amber-500/[0.08] to-transparent border-amber-500/20 backdrop-blur-xl shadow-lg rounded-xl overflow-hidden">
                        <CardHeader className="py-2 px-3 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-amber-500 flex items-center gap-1.5 text-xs uppercase tracking-wide font-bold">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    {currentPlan} Plan
                                </CardTitle>
                                <div className="text-lg font-bold text-white leading-none">
                                    {formatCurrency(PLAN_PRICES[currentPlan] || 0)}
                                    <span className="text-[10px] text-slate-500 font-normal ml-0.5">/mo</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
                                {(PLAN_FEATURES[currentPlan] || []).map((feature, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                                        <ShieldCheck className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                                        <span className="truncate">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <Button size="sm" className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold h-7 text-[10px] rounded-md uppercase tracking-wider">
                                <Zap className="mr-1 h-3 w-3" /> Upgrade
                            </Button>
                        </CardContent>
                    </Card>

                    {/* 2. Usage Card */}
                    <Card className="flex-none bg-gradient-to-br from-violet-500/[0.08] to-transparent border-violet-500/20 backdrop-blur-xl shadow-lg rounded-xl overflow-hidden">
                        <CardHeader className="py-2 px-3 border-b border-white/5">
                            <CardTitle className="text-white flex items-center justify-between text-xs uppercase tracking-wide font-bold">
                                <span className="flex items-center gap-1.5">
                                    <MessageSquare className="h-3.5 w-3.5 text-violet-500" /> Message Usage
                                </span>
                                <span className={`text-[10px] ${usagePercent > 80 ? 'text-red-400' : 'text-emerald-400'}`}>{usagePercent}%</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 space-y-2">
                            <div className="flex items-end justify-between leading-none">
                                <span className="text-xl font-bold text-white">{messagesUsed.toLocaleString('en-IN')}</span>
                                <span className="text-slate-500 text-[10px]">/ {messageLimit.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                            {usagePercent > 80 && (
                                <div className="flex items-center gap-1 text-red-400 text-[10px] bg-red-500/5 p-1 rounded border border-red-500/10 justify-center">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>Limit Reached!</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 3. Payment Methods (Ultra Compact) */}
                    <Card className="flex-1 bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden min-h-0 flex flex-col">
                        <CardHeader className="py-2 px-3 border-b border-white/5 bg-white/[0.02]">
                            <CardTitle className="text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
                                <CreditCard className="h-3 w-3" /> Payment Methods
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
                            <div className="p-2 space-y-1.5">
                                {[
                                    { label: 'UPI / Apps', sub: 'PhonePe, GPay', color: 'text-emerald-500', code: 'UPI' },
                                    { label: 'Net Banking', sub: 'All Banks', color: 'text-blue-500', code: 'NET' },
                                    //{ label: 'Cards', sub: 'Credit/Debit', color: 'text-amber-500', code: 'CARD' } // Removed 3rd to make it super fit or keep tiny? Let's keep 2 visible without scroll mostly.
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-6 w-6 rounded bg-[#0B0F19] flex items-center justify-center text-[8px] font-bold ${item.color} border border-white/10`}>{item.code}</div>
                                            <div>
                                                <p className="text-[10px] font-semibold text-white leading-none">{item.label}</p>
                                                <p className="text-[9px] text-slate-500 leading-none mt-0.5">{item.sub}</p>
                                            </div>
                                        </div>
                                        <Plus className="h-3 w-3 text-slate-500 group-hover:text-white" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Invoice History (Full Height, Compact Table) */}
                <Card className="flex flex-col bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden min-h-0 h-full">
                    <CardHeader className="py-2 px-3 border-b border-white/5 bg-white/[0.02] flex-none">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
                                <ReceiptText className="h-3 w-3" /> History
                            </CardTitle>
                            <span className="text-[9px] text-slate-500">Recent</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0 overflow-hidden relative">
                        <ScrollArea className="h-full w-full">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#0B0F19] z-10 text-[9px] uppercase text-slate-500 font-semibold border-b border-white/5">
                                    <tr>
                                        <th className="px-3 py-1.5 bg-[#0B0F19]">Date</th>
                                        <th className="px-3 py-1.5 bg-[#0B0F19]">Amount</th>
                                        <th className="px-3 py-1.5 bg-[#0B0F19]">Status</th>
                                        <th className="px-3 py-1.5 bg-[#0B0F19] text-right">#</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-[10px]">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                                                No payments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-3 py-2 text-slate-300 whitespace-nowrap">
                                                    {formatDate(payment.payment_date)}
                                                </td>
                                                <td className="px-3 py-2 text-white font-medium">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-1 py-0.5 rounded text-[8px] font-bold uppercase ${payment.status === 'success' || payment.status === 'completed'
                                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                        }`}>
                                                        {payment.status === 'success' || payment.status === 'completed' ? 'Paid' : 'Failed'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <Button size="icon" variant="ghost" className="h-5 w-5 text-slate-500 hover:text-white hover:bg-white/10">
                                                        <Download className="h-2.5 w-2.5" />
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
