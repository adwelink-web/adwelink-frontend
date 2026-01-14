"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Phone, Key, CheckCircle, ArrowRight, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

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
        <div className="p-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Onboard New Client</h1>
                <p className="text-muted-foreground mt-1">Setup a new institute in Adwelink</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                            }`}>
                            {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                        </div>
                        <span className={`text-sm ${step >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {s === 1 ? "Basic Info" : s === 2 ? "WhatsApp" : "Plan"}
                        </span>
                        {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Institute Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Institute Name *</Label>
                            <Input
                                placeholder="e.g., Indore Academy of Excellence"
                                value={formData.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>City</Label>
                                <Input
                                    placeholder="e.g., Indore"
                                    value={formData.city}
                                    onChange={(e) => updateField("city", e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>Helpline Number</Label>
                                <Input
                                    placeholder="e.g., 9876543210"
                                    value={formData.helpline_number}
                                    onChange={(e) => updateField("helpline_number", e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Address</Label>
                            <Input
                                placeholder="Full address"
                                value={formData.address}
                                onChange={(e) => updateField("address", e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        <Button
                            onClick={() => setStep(2)}
                            disabled={!formData.name}
                            className="w-full mt-4"
                        >
                            Next: WhatsApp Setup <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: WhatsApp */}
            {step === 2 && (
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-emerald-500" />
                            WhatsApp Business Setup
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-500">
                            <p className="font-bold mb-1">⚠️ Optional</p>
                            <p className="text-xs">Skip if client hasn't setup WhatsApp Business API yet. You can add later.</p>
                        </div>

                        <div>
                            <Label>WhatsApp Phone Number ID</Label>
                            <Input
                                placeholder="e.g., 123456789012345"
                                value={formData.phone_id}
                                onChange={(e) => updateField("phone_id", e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Access Token</Label>
                            <Input
                                type="password"
                                placeholder="Meta API Access Token"
                                value={formData.access_token}
                                onChange={(e) => updateField("access_token", e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        <div className="flex gap-4 mt-4">
                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                Back
                            </Button>
                            <Button onClick={() => setStep(3)} className="flex-1">
                                Next: Select Plan <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Plan */}
            {step === 3 && (
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-amber-500" />
                            Select Plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { id: "trial", name: "Trial", price: "₹0", limit: "50 messages" },
                            { id: "starter", name: "Starter", price: "₹7,999/mo", limit: "300 leads" },
                            { id: "growth", name: "Growth", price: "₹14,999/mo", limit: "1,000 leads" },
                            { id: "domination", name: "Domination", price: "₹29,999/mo", limit: "Unlimited*" },
                        ].map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => updateField("current_plan", plan.id)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.current_plan === plan.id
                                    ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                                    : "border-border/40 hover:border-border/80"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-foreground">{plan.name}</p>
                                        <p className="text-xs text-muted-foreground">{plan.limit}</p>
                                    </div>
                                    <p className="text-lg font-bold text-primary">{plan.price}</p>
                                </div>
                            </div>
                        ))}

                        {error && (
                            <p className="text-destructive text-sm text-center">{error}</p>
                        )}

                        <div className="flex gap-4 mt-4">
                            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Institute"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
                <Card className="border-emerald-500/30 bg-emerald-500/10">
                    <CardContent className="py-16 text-center">
                        <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Institute Created!</h2>
                        <p className="text-muted-foreground">{formData.name} is now onboarded.</p>
                        <p className="text-xs text-muted-foreground mt-4">Redirecting to institutes list...</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
