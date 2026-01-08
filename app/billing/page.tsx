"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, Sparkles, ReceiptText, ShieldCheck } from "lucide-react"

export default function BillingPage() {
    const invoices = [
        { id: "INV-001", date: "Dec 01, 2025", amount: "₹2,999", status: "Paid" },
        { id: "INV-002", date: "Jan 01, 2026", amount: "₹2,999", status: "Paid" },
    ]

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* 🌌 Ambient Background Glows - Optimized */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-violet-600/5 blur-[80px] rounded-full" />
            </div>

            {/* Fixed Container - No Page Scroll */}
            <div className="flex-1 w-full h-full relative z-10 max-w-7xl mx-auto flex flex-col">

                {/* Sticky Blurred Header Section */}
                <div className="flex-shrink-0 backdrop-blur-xl px-4 md:px-8 py-6 mb-2">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
                                <CreditCard className="h-8 w-8 text-amber-500" />
                                Billing & Subscription
                                <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                    </span>
                                    <span className="text-emerald-400">Active</span>
                                </span>
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your subscription, payment methods, and download invoices.</p>
                        </div>
                        <Button className="w-full md:w-auto bg-amber-500 text-black hover:bg-amber-600 shadow-lg shadow-amber-500/25 font-bold">
                            <Download className="mr-2 h-4 w-4" /> Download Invoice
                        </Button>
                    </div>
                </div>

                {/* Content Section - Fixed Layout */}
                <div className="flex-1 px-4 md:px-8 pb-4 flex flex-col gap-4 min-h-0">
                    {/* Top Row - Compact Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
                        {/* Current Plan - Compact */}
                        <Card className="bg-gradient-to-br from-amber-500/[0.08] to-transparent border-amber-500/20 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border-amber-500/10">
                            <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-amber-500 flex items-center gap-2 text-base">
                                        <Sparkles className="h-4 w-4" /> Premium Plan
                                    </CardTitle>
                                    <span className="bg-amber-500/20 text-amber-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Active</span>
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-white">₹2,999<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                                    <span className="text-xs text-amber-200/60">Next: Feb 01, 2026</span>
                                </div>
                                <div className="flex gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" /> All AI Agents</span>
                                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" /> Priority Support</span>
                                </div>
                                <Button className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold h-9 rounded-lg text-sm">Upgrade</Button>
                            </CardContent>
                        </Card>

                        {/* Payment Method - Compact */}
                        <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border-violet-500/10">
                            <CardHeader className="py-3">
                                <CardTitle className="text-white flex items-center gap-2 text-base">
                                    <CreditCard className="h-4 w-4" /> Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-3 space-y-3">
                                <div className="flex items-center justify-between p-3 bg-black/20 border border-white/10 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-12 bg-slate-800 rounded flex items-center justify-center text-[9px] text-white font-bold uppercase ring-1 ring-white/10">VISA</div>
                                        <div>
                                            <p className="text-sm font-medium text-white">•••• 4242</p>
                                            <p className="text-[10px] text-slate-500">Exp 12/26</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-white/5 h-7 text-xs">Edit</Button>
                                </div>
                                <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/5 h-9 rounded-lg text-sm">
                                    + Add New Method
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Invoice History - Fills Remaining Height with Internal Scroll */}
                    <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border-violet-500/10 flex-1 flex flex-col min-h-0">
                        <CardHeader className="flex-shrink-0 py-3">
                            <CardTitle className="text-white flex items-center gap-2 text-base">
                                <ReceiptText className="h-4 w-4" /> Invoice History
                            </CardTitle>
                            <CardDescription className="text-xs">View and download your past payments.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden min-h-0">
                            <div className="overflow-y-auto custom-scrollbar h-full">
                                <table className="w-full text-sm">
                                    <thead className="bg-white/5 border-b border-white/5 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-2 text-left font-medium text-slate-400 text-xs">Invoice ID</th>
                                            <th className="px-6 py-2 text-left font-medium text-slate-400 text-xs">Date</th>
                                            <th className="px-6 py-2 text-left font-medium text-slate-400 text-xs">Amount</th>
                                            <th className="px-6 py-2 text-left font-medium text-slate-400 text-xs">Status</th>
                                            <th className="px-6 py-2 text-right font-medium text-slate-400 text-xs">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {invoices.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-3 text-white font-medium text-sm">{inv.id}</td>
                                                <td className="px-6 py-3 text-slate-400 text-sm">{inv.date}</td>
                                                <td className="px-6 py-3 text-white text-sm">{inv.amount}</td>
                                                <td className="px-6 py-3">
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white h-7 w-7">
                                                        <Download className="h-3 w-3" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
