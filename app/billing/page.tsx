import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, Sparkles, ReceiptText, ShieldCheck, MessageSquare, Zap, AlertCircle } from "lucide-react"
import { getBillingData } from "./actions"
import { Badge } from "@/components/ui/badge"

// Plan pricing in INR
const PLAN_PRICES: Record<string, number> = {
    free: 0,
    starter: 999,
    growth: 2999,
    premium: 4999,
    enterprise: 9999
}

const PLAN_FEATURES: Record<string, string[]> = {
    free: ["100 messages/month", "1 AI Agent"],
    starter: ["1,000 messages/month", "All AI Agents", "Email Support"],
    growth: ["5,000 messages/month", "All AI Agents", "Priority Support", "Analytics"],
    premium: ["15,000 messages/month", "All AI Agents", "Dedicated Support", "Custom Training"],
    enterprise: ["Unlimited messages", "All AI Agents", "24/7 Support", "Custom Integrations"]
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
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-amber-600/5 blur-[80px] rounded-full" />
            </div>

            <div className="flex-1 w-full h-full relative z-10 overflow-y-auto custom-scrollbar">
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <CreditCard className="h-8 w-8 text-amber-500" />
                                बिलिंग और सब्सक्रिप्शन
                                <Badge className={`${subscriptionStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {subscriptionStatus === 'active' ? '✓ सक्रिय' : '⚠ निष्क्रिय'}
                                </Badge>
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">
                                अपना प्लान, भुगतान और इनवॉइस यहाँ देखें
                            </p>
                        </div>
                    </div>

                    {/* Current Plan & Usage */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Current Plan Card */}
                        <Card className="bg-gradient-to-br from-amber-500/[0.08] to-transparent border-amber-500/20 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-amber-500 flex items-center gap-2 text-lg">
                                        <Sparkles className="h-5 w-5" />
                                        {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
                                    </CardTitle>
                                    <Badge className="bg-amber-500/20 text-amber-500 text-[10px] uppercase font-bold">
                                        {subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold text-white">
                                        {formatCurrency(PLAN_PRICES[currentPlan] || 0)}
                                        <span className="text-sm text-slate-500 font-normal">/माह</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {(PLAN_FEATURES[currentPlan] || []).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold h-10 rounded-lg">
                                    <Zap className="mr-2 h-4 w-4" /> प्लान अपग्रेड करें
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Message Usage Card */}
                        <Card className="bg-gradient-to-br from-violet-500/[0.08] to-transparent border-violet-500/20 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white flex items-center gap-2 text-lg">
                                    <MessageSquare className="h-5 w-5 text-violet-500" />
                                    मैसेज उपयोग
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <span className="text-3xl font-bold text-white">{messagesUsed.toLocaleString('en-IN')}</span>
                                        <span className="text-slate-500 text-sm"> / {messageLimit.toLocaleString('en-IN')}</span>
                                    </div>
                                    <span className={`text-sm font-semibold ${usagePercent > 80 ? 'text-red-400' : usagePercent > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {usagePercent}% used
                                    </span>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${usagePercent}%` }}
                                    />
                                </div>
                                {usagePercent > 80 && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        आपकी लिमिट लगभग ख़त्म! अभी अपग्रेड करें।
                                    </div>
                                )}
                                <div className="pt-2 border-t border-white/10">
                                    <p className="text-xs text-slate-500">
                                        रीसेट: हर महीने की 1 तारीख़ को
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Methods - Indian Options */}
                    <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <CreditCard className="h-5 w-5" />
                                भुगतान के तरीके
                            </CardTitle>
                            <CardDescription>UPI, नेट बैंकिंग, या कार्ड से भुगतान करें</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* UPI */}
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500 font-bold text-xs">
                                            UPI
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">UPI</p>
                                            <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full border-white/10 text-slate-300 hover:bg-white/5 text-xs">
                                        + जोड़ें
                                    </Button>
                                </div>

                                {/* Net Banking */}
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-500 font-bold text-xs">
                                            NET
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">नेट बैंकिंग</p>
                                            <p className="text-[10px] text-slate-500">सभी बैंक</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full border-white/10 text-slate-300 hover:bg-white/5 text-xs">
                                        + जोड़ें
                                    </Button>
                                </div>

                                {/* Card */}
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500 font-bold text-xs">
                                            💳
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">डेबिट/क्रेडिट कार्ड</p>
                                            <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full border-white/10 text-slate-300 hover:bg-white/5 text-xs">
                                        + जोड़ें
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoice History */}
                    <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <ReceiptText className="h-5 w-5" />
                                भुगतान इतिहास
                            </CardTitle>
                            <CardDescription>पिछले भुगतान और इनवॉइस</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-white/5 border-b border-white/5">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-medium text-slate-400 text-xs">तारीख़</th>
                                            <th className="px-6 py-3 text-left font-medium text-slate-400 text-xs">राशि</th>
                                            <th className="px-6 py-3 text-left font-medium text-slate-400 text-xs">तरीका</th>
                                            <th className="px-6 py-3 text-left font-medium text-slate-400 text-xs">स्थिति</th>
                                            <th className="px-6 py-3 text-right font-medium text-slate-400 text-xs">रसीद</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {payments.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                    अभी तक कोई भुगतान नहीं हुआ
                                                </td>
                                            </tr>
                                        ) : (
                                            payments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-3 text-slate-300 text-sm">
                                                        {formatDate(payment.payment_date)}
                                                    </td>
                                                    <td className="px-6 py-3 text-white font-medium">
                                                        {formatCurrency(payment.amount)}
                                                    </td>
                                                    <td className="px-6 py-3 text-slate-400 text-sm capitalize">
                                                        {payment.payment_method || "UPI"}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <Badge className={`text-[10px] ${payment.status === 'completed' || payment.status === 'success'
                                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                                : payment.status === 'pending'
                                                                    ? 'bg-amber-500/10 text-amber-500'
                                                                    : 'bg-red-500/10 text-red-500'
                                                            }`}>
                                                            {payment.status === 'completed' || payment.status === 'success' ? '✓ सफल' :
                                                                payment.status === 'pending' ? '⏳ प्रतीक्षा' : '✗ असफल'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white h-7 w-7">
                                                            <Download className="h-3 w-3" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support */}
                    <div className="text-center pb-8">
                        <p className="text-sm text-slate-500">
                            भुगतान में समस्या? हमसे संपर्क करें: <span className="text-white">support@adwelink.com</span>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
