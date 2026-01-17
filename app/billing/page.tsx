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

            {/* Main Grid - Adwelink Standard Layout */}
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4 z-10">

                {/* Left Column */}
                <div className="flex flex-col gap-4 min-h-0">

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
                                <Button className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold h-7 text-[10px] rounded-md shadow-lg shadow-amber-500/20">
                                    <Zap className="mr-1.5 h-3 w-3" /> Upgrade
                                </Button>
                            </CardContent>
                        </Card>

                        {/* 2. Usage Card */}
                        <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg border-violet-500/20 h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                                    <MessageSquare className="h-4 w-4 text-violet-500" />
                                    Usage
                                </CardTitle>
                                <span className={`text-[10px] font-bold ${usagePercent > 80 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {usagePercent}%
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-end justify-between leading-none mt-1">
                                    <span className="text-xl font-bold text-white">{messagesUsed.toLocaleString('en-IN')}</span>
                                    <span className="text-slate-500 text-[10px] mb-0.5">/ {messageLimit.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${usagePercent}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500">Resets on 1st of month</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 3. Payment Methods (Full Width) */}
                    <Card className="flex-1 bg-gradient-to-br from-blue-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg flex flex-col min-h-0">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white/[0.02] border-b border-white/5">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                                    <CreditCard className="h-4 w-4 text-blue-500" />
                                    Payment Methods
                                </CardTitle>
                                <CardDescription className="text-xs">Manage your cards & UPI</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
                            <div className="p-3 space-y-2">
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-[#0B0F19] flex items-center justify-center text-[9px] font-bold text-emerald-500 border border-white/10 shadow-inner">UPI</div>
                                        <div>
                                            <p className="text-xs font-semibold text-white">UPI / Apps</p>
                                            <p className="text-[10px] text-slate-500">Connected</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-[9px] h-4 bg-emerald-500/10 text-emerald-500 border-none">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-[#0B0F19] flex items-center justify-center text-[9px] font-bold text-blue-500 border border-white/10 shadow-inner">NET</div>
                                        <div>
                                            <p className="text-xs font-semibold text-white">Net Banking</p>
                                            <p className="text-[10px] text-slate-500">Not Connected</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-6 text-[10px] text-slate-400 hover:text-white p-2">Add</Button>
                                </div>
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-[#0B0F19] flex items-center justify-center text-[9px] font-bold text-amber-500 border border-white/10 shadow-inner">CARD</div>
                                        <div>
                                            <p className="text-xs font-semibold text-white">Debit / Credit</p>
                                            <p className="text-[10px] text-slate-500">Not Connected</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-6 text-[10px] text-slate-400 hover:text-white p-2">Add</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: History (Re-styled to Match Super Admin Table) */}
                <Card className="flex flex-col bg-gradient-to-br from-emerald-500/5 to-transparent border-white/10 backdrop-blur-md shadow-lg min-h-0 h-full">
                    <CardHeader className="flex flex-row items-center justify-between pb-0 pt-4 px-4 flex-none">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                                <ReceiptText className="h-4 w-4 text-emerald-500" />
                                Payment History
                            </CardTitle>
                            <CardDescription className="text-xs">Recent transactions and invoices</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400">
                            Recent
                        </Badge>
                    </CardHeader>

                    <CardContent className="p-0 flex-1 min-h-0 overflow-hidden relative mt-4">
                        <ScrollArea className="h-full w-full">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#0B0F19] z-20 shadow-sm border-b border-white/5">
                                    <tr>
                                        <th className="pl-6 py-3 text-xs font-bold text-white/70 bg-[#0B0F19]">Date</th>
                                        <th className="py-3 text-xs font-bold text-white/70 bg-[#0B0F19]">Amount</th>
                                        <th className="py-3 text-xs font-bold text-white/70 bg-[#0B0F19]">Status</th>
                                        <th className="pr-6 py-3 text-right text-xs font-bold text-white/70 bg-[#0B0F19]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground text-xs">
                                                No payments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                                <td className="pl-6 py-3">
                                                    <div className="font-medium text-white text-xs">{formatDate(payment.payment_date)}</div>
                                                    <div className="text-[10px] text-slate-500 uppercase">{payment.payment_method || "UPI"}</div>
                                                </td>
                                                <td className="py-3 text-white font-medium text-xs">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="py-3">
                                                    <Badge variant={
                                                        payment.status === 'success' || payment.status === 'completed' ? 'default' :
                                                            payment.status === 'pending' ? 'secondary' : 'destructive'
                                                    } className={`text-[10px] uppercase h-5 px-1.5 ${payment.status === 'success' || payment.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''
                                                        }`}>
                                                        {payment.status === 'success' || payment.status === 'completed' ? 'Paid' : payment.status}
                                                    </Badge>
                                                </td>
                                                <td className="pr-6 py-3 text-right">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-white/10">
                                                        <Download className="h-3.5 w-3.5" />
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
