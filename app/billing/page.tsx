import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard, Sparkles } from "lucide-react"

export default function BillingPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
                    <p className="text-slate-400">Manage your institute subscription.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {/* Current Plan */}
                <Card className="bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/20">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-amber-500 flex items-center gap-2">
                                <Sparkles className="h-5 w-5" /> Premium Plan
                            </CardTitle>
                            <span className="bg-amber-500/20 text-amber-500 text-xs px-2 py-1 rounded">Active</span>
                        </div>
                        <CardDescription className="text-amber-200/60">Next billing on Feb 5, 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-3xl font-bold text-white">₹2,999<span className="text-sm text-slate-400 font-normal">/mo</span></div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-300"><Check className="h-4 w-4 text-emerald-500" /> All 3 Core Agents</div>
                            <div className="flex items-center gap-2 text-sm text-slate-300"><Check className="h-4 w-4 text-emerald-500" /> Unlimited Leads</div>
                            <div className="flex items-center gap-2 text-sm text-slate-300"><Check className="h-4 w-4 text-emerald-500" /> Priority Support</div>
                        </div>
                        <Button className="w-full bg-amber-500 text-black hover:bg-amber-600">Manage Subscription</Button>
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <CreditCard className="h-5 w-5" /> Payment Methods
                        </CardTitle>
                        <CardDescription>Saved cards and billing details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-white/10 rounded bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-12 bg-slate-700 rounded flex items-center justify-center text-xs text-white">VISA</div>
                                <div className="flex flex-col">
                                    <span className="text-white text-sm">•••• 4242</span>
                                    <span className="text-xs text-slate-500">Expires 12/28</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">Edit</Button>
                        </div>
                        <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/5">+ Add New Method</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
