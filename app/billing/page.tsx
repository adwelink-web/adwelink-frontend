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
        <div className="h-full w-full overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Billing & subscription</h1>
                    <p className="text-slate-400">Manage your subscription, payment methods, and download invoices.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Current Plan */}
                    <Card className="bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/20 backdrop-blur-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-amber-500 flex items-center gap-2">
                                    <Sparkles className="h-5 w-5" /> Premium Plan
                                </CardTitle>
                                <span className="bg-amber-500/20 text-amber-500 text-[10px] uppercase font-bold px-2 py-1 rounded">Active</span>
                            </div>
                            <CardDescription className="text-amber-200/60 font-medium">Next billing date: Feb 01, 2026</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-4xl font-bold text-white">₹2,999<span className="text-base text-slate-500 font-normal">/mo</span></div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> All AI Agents (Aditi, Ishaan, Rohan)
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Priority Support & Data Export
                                </div>
                            </div>
                            <Button className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold py-6 rounded-xl">Upgrade My Workforce</Button>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <CreditCard className="h-5 w-5" /> Payment Method
                            </CardTitle>
                            <CardDescription>Default method for your monthly subscription.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-14 bg-slate-800 rounded flex items-center justify-center text-[10px] text-white font-bold uppercase ring-1 ring-white/10">VISA</div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Visa ending in •••• 4242</p>
                                        <p className="text-[10px] text-slate-500">Expires 12/26</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-white/5">Edit</Button>
                            </div>
                            <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/5 py-6 rounded-xl">
                                + Add New Method
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoice History */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <ReceiptText className="h-5 w-5" /> Invoice History
                        </CardTitle>
                        <CardDescription>View and download your past payments.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-slate-400">Invoice ID</th>
                                        <th className="px-6 py-3 text-left font-medium text-slate-400">Date</th>
                                        <th className="px-6 py-3 text-left font-medium text-slate-400">Amount</th>
                                        <th className="px-6 py-3 text-left font-medium text-slate-400">Status</th>
                                        <th className="px-6 py-3 text-right font-medium text-slate-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {invoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">{inv.id}</td>
                                            <td className="px-6 py-4 text-slate-400">{inv.date}</td>
                                            <td className="px-6 py-4 text-white">{inv.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                                                    <Download className="h-4 w-4" />
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
    )
}
