"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Phone, Key, CheckCircle, ArrowRight, Loader2, UserPlus, ArrowLeft } from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function OnboardPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        helpline_number: "",
        address: "",
        phone_id: "",
        access_token: "",
        current_plan: "trial"
    })

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError("")

        try {
            const supabase = createClient()

            const { error: insertError } = await supabase
                .from("institutes")
                .insert([{
                    name: formData.name,
                    city: formData.city,
                    helpline_number: formData.helpline_number,
                    address: formData.address,
                    phone_id: formData.phone_id || null,
                    access_token: formData.access_token || null,
                    current_plan: formData.current_plan as "trial" | "starter" | "growth" | "domination",
                    message_limit: formData.current_plan === "starter" ? 300 :
                        formData.current_plan === "growth" ? 1000 :
                            formData.current_plan === "domination" ? 5000 : 50,
                    messages_used: 0
                }])

            if (insertError) throw insertError

            // Success!
            setStep(4)
            setTimeout(() => {
                router.push("/super-admin/institutes")
            }, 2000)

        } catch (err: any) {
            setError(err.message || "Failed to create institute")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* Main Scrollable Container */}
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">

                {/* Sticky Blurred Header Section */}
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#0B0F19]/80 px-4 md:px-8 py-4 mb-2">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        {/* Back Button */}
                        <Link href="/super-admin/institutes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back to Institutes
                        </Link>

                        <WorkspaceHeader
                            title="Onboard New Client"
                            subtitle="Setup a new institute in Adwelink"
                            icon={UserPlus}
                            iconColor="text-amber-500"
                            className="p-0" // Remove padding since container has padding
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="pb-20 px-4 md:px-8 max-w-2xl mx-auto space-y-6">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 py-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30 ring-2 ring-violet-500/50" : "bg-white/5 text-muted-foreground border border-white/10"
                                    }`}>
                                    {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                                </div>
                                <span className={`text-sm hidden sm:block ${step >= s ? "text-white font-medium" : "text-muted-foreground"}`}>
                                    {s === 1 ? "Basic Info" : s === 2 ? "WhatsApp" : "Plan"}
                                </span>
                                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-violet-500" : "bg-white/10"}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Building2 className="h-5 w-5 text-blue-500" />
                                    Institute Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-slate-300">Institute Name *</Label>
                                    <Input
                                        placeholder="e.g., Indore Academy of Excellence"
                                        value={formData.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        className="mt-1 bg-white/5 border-white/10 focus:border-blue-500/50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">City</Label>
                                        <Input
                                            placeholder="e.g., Indore"
                                            value={formData.city}
                                            onChange={(e) => updateField("city", e.target.value)}
                                            className="mt-1 bg-white/5 border-white/10 focus:border-blue-500/50"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Helpline Number</Label>
                                        <Input
                                            placeholder="e.g., 9876543210"
                                            value={formData.helpline_number}
                                            onChange={(e) => updateField("helpline_number", e.target.value)}
                                            className="mt-1 bg-white/5 border-white/10 focus:border-blue-500/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-slate-300">Address</Label>
                                    <Input
                                        placeholder="Full address"
                                        value={formData.address}
                                        onChange={(e) => updateField("address", e.target.value)}
                                        className="mt-1 bg-white/5 border-white/10 focus:border-blue-500/50"
                                    />
                                </div>

                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!formData.name}
                                    className="w-full mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/25"
                                >
                                    Next: WhatsApp Setup <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: WhatsApp */}
                    {step === 2 && (
                        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Phone className="h-5 w-5 text-emerald-500" />
                                    WhatsApp Business Setup
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm">
                                    <p className="font-bold text-amber-400 flex items-center gap-2">⚠️ Optional</p>
                                    <p className="text-xs text-amber-200/70 mt-1">Skip if client hasn't setup WhatsApp Business API yet. You can add later.</p>
                                </div>

                                <div>
                                    <Label className="text-slate-300">WhatsApp Phone Number ID</Label>
                                    <Input
                                        placeholder="e.g., 123456789012345"
                                        value={formData.phone_id}
                                        onChange={(e) => updateField("phone_id", e.target.value)}
                                        className="mt-1 bg-white/5 border-white/10 focus:border-emerald-500/50"
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-300">Access Token</Label>
                                    <Input
                                        type="password"
                                        placeholder="Meta API Access Token"
                                        value={formData.access_token}
                                        onChange={(e) => updateField("access_token", e.target.value)}
                                        className="mt-1 bg-white/5 border-white/10 focus:border-emerald-500/50"
                                    />
                                </div>

                                <div className="flex gap-4 mt-4">
                                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 hover:bg-white/5">
                                        Back
                                    </Button>
                                    <Button onClick={() => setStep(3)} className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/25">
                                        Next: Select Plan <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Plan */}
                    {step === 3 && (
                        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-white/10 backdrop-blur-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Key className="h-5 w-5 text-amber-500" />
                                    Select Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { id: "trial", name: "Trial", price: "₹0", limit: "50 messages", color: "slate" },
                                    { id: "starter", name: "Starter", price: "₹7,999/mo", limit: "300 leads", color: "cyan" },
                                    { id: "growth", name: "Growth", price: "₹14,999/mo", limit: "1,000 leads", color: "emerald" },
                                    { id: "domination", name: "Domination", price: "₹29,999/mo", limit: "Unlimited*", color: "violet" },
                                ].map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => updateField("current_plan", plan.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${formData.current_plan === plan.id
                                            ? "border-violet-500 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/30"
                                            : "border-white/10 bg-white/5 hover:border-white/20"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-white">{plan.name}</p>
                                                <p className="text-xs text-muted-foreground">{plan.limit}</p>
                                            </div>
                                            <p className={`text-lg font-bold ${formData.current_plan === plan.id ? "text-violet-400" : "text-white"}`}>{plan.price}</p>
                                        </div>
                                    </div>
                                ))}

                                {error && (
                                    <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>
                                )}

                                <div className="flex gap-4 mt-4">
                                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1 hover:bg-white/5">
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/25"
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Institute"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                            <CardContent className="py-16 text-center">
                                <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20">
                                    <CheckCircle className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Institute Created!</h2>
                                <p className="text-muted-foreground">{formData.name} is now onboarded.</p>
                                <p className="text-xs text-emerald-400 mt-4 animate-pulse">Redirecting to institutes list...</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
