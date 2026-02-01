"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    CheckCircle,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Sparkles,
    Zap,
    Building,
    MapPin,
    Smartphone
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function OnboardPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        director_name: "",
        admin_email: "", // User Login
        email: "", // Institute Contact
        website: "",
        city: "",
        address: "",
        google_map_link: "",
        helpline_number: "",
        phone_id: "",
        access_token: "",
        current_plan: "trial"
    })

    const totalSteps = 4

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    const handleSubmit = async () => {
        setLoading(true)
        setError("")

        try {
            const response = await fetch('/api/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to onboard institute")
            }

            setStep(5)
            setTimeout(() => router.push("/super-admin/institutes"), 2200)

        } catch (err: any) {
            setError(err.message || "Failed to create institute")
            setLoading(false)
        }
    }

    // Validation
    const isStep1Valid = formData.name && formData.director_name && formData.admin_email
    const isStep2Valid = formData.city && formData.helpline_number
    const isStep3Valid = formData.phone_id && formData.access_token

    return (
        <div className="h-full w-full flex items-center justify-center relative bg-[#050505] text-white font-sans overflow-hidden">

            {/* 🌌 Premium Ambient Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Back Link */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/super-admin/institutes" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-medium tracking-wide uppercase hover:underline decoration-indigo-500 underline-offset-4">
                    <ArrowLeft className="h-3 w-3" />
                    Command Center
                </Link>
            </div>

            <div className="w-full max-w-[440px] px-4 relative z-10">
                <AnimatePresence mode="wait">
                    {step === 5 ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            className="bg-black/60 border border-emerald-500/30 rounded-3xl p-8 text-center backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                                <CheckCircle className="h-10 w-10 text-black" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">System Online</h2>
                            <p className="text-emerald-400/80 text-sm font-medium">Initializing Dashboard...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="group relative"
                        >
                            {/* Card Container - Compact & Premium */}
                            <div className="bg-[#0f0f11]/80 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden relative">

                                {/* Header Stencil */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50" />

                                {/* Header */}
                                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                            {step === 1 && <Building className="h-4 w-4 text-white" />}
                                            {step === 2 && <MapPin className="h-4 w-4 text-white" />}
                                            {step === 3 && <Smartphone className="h-4 w-4 text-white" />}
                                            {step === 4 && <Zap className="h-4 w-4 text-white" />}
                                        </div>
                                        <div>
                                            <h1 className="text-sm font-bold text-white tracking-wide">
                                                {step === 1 && "Institute Profile"}
                                                {step === 2 && "Location Data"}
                                                {step === 3 && "Connectivity"}
                                                {step === 4 && "Select Plan"}
                                            </h1>
                                            <p className="text-[10px] text-slate-400 font-medium">STEP {step} OF {totalSteps}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                                        <motion.div
                                            className="h-full bg-indigo-500 box-shadow-[0_0_10px_indigo]"
                                            initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
                                            animate={{ width: `${(step / totalSteps) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">

                                    {/* Step 1: Identity */}
                                    {step === 1 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                            <div className="group/input relative">
                                                <Label className="text-[10px] text-indigo-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Institute Name</Label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => updateField("name", e.target.value)}
                                                    placeholder="e.g. Acme Academy"
                                                    className="h-10 bg-black/40 border-white/10 text-sm focus:border-indigo-500 focus:bg-indigo-950/20 focus:ring-0 transition-all rounded-xl placeholder:text-slate-600"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-[10px] text-indigo-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Director Name</Label>
                                                    <Input
                                                        value={formData.director_name}
                                                        onChange={(e) => updateField("director_name", e.target.value)}
                                                        placeholder="Name"
                                                        className="h-10 bg-black/40 border-white/10 text-sm focus:border-indigo-500 focus:bg-indigo-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-[10px] text-indigo-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Admin Login Email <span className="text-indigo-400">*</span></Label>
                                                    <Input
                                                        value={formData.admin_email}
                                                        onChange={(e) => updateField("admin_email", e.target.value)}
                                                        placeholder="Login Email"
                                                        className="h-10 bg-black/40 border-white/10 text-sm focus:border-indigo-500 focus:bg-indigo-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-[10px] text-indigo-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Institute Email (Public)</Label>
                                                    <Input
                                                        value={formData.email}
                                                        onChange={(e) => updateField("email", e.target.value)}
                                                        placeholder="contact@institute.com"
                                                        className="h-10 bg-black/40 border-white/10 text-sm focus:border-indigo-500 focus:bg-indigo-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-[10px] text-indigo-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Website</Label>
                                                    <Input
                                                        value={formData.website}
                                                        onChange={(e) => updateField("website", e.target.value)}
                                                        placeholder="https://"
                                                        className="h-10 bg-black/40 border-white/10 text-sm focus:border-indigo-500 focus:bg-indigo-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Location */}
                                    {step === 2 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-[10px] text-purple-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">City</Label>
                                                    <Input
                                                        value={formData.city}
                                                        onChange={(e) => updateField("city", e.target.value)}
                                                        placeholder="City"
                                                        className="h-10 bg-black/40 border-white/10 text-sm focus:border-purple-500 focus:bg-purple-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-[10px] text-purple-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Helpline</Label>
                                                    <Input
                                                        value={formData.helpline_number}
                                                        onChange={(e) => updateField("helpline_number", e.target.value)}
                                                        placeholder="+91..."
                                                        className="h-10 bg-black/40 border-white/10 text-sm focus:border-purple-500 focus:bg-purple-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-[10px] text-purple-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Full Address</Label>
                                                <Input
                                                    value={formData.address}
                                                    onChange={(e) => updateField("address", e.target.value)}
                                                    placeholder="Address"
                                                    className="h-10 bg-black/40 border-white/10 text-sm focus:border-purple-500 focus:bg-purple-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-[10px] text-purple-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Maps Link</Label>
                                                <Input
                                                    value={formData.google_map_link}
                                                    onChange={(e) => updateField("google_map_link", e.target.value)}
                                                    placeholder="https://"
                                                    className="h-10 bg-black/40 border-white/10 text-sm focus:border-purple-500 focus:bg-purple-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Tech */}
                                    {step === 3 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">

                                            <div>
                                                <Label className="text-[10px] text-indigo-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Phone Number ID</Label>
                                                <Input
                                                    value={formData.phone_id}
                                                    onChange={(e) => updateField("phone_id", e.target.value)}
                                                    placeholder="100234..."
                                                    className="h-10 bg-black/40 border-white/10 text-sm font-mono focus:border-indigo-500 focus:bg-indigo-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-[10px] text-indigo-300/80 uppercase font-bold tracking-wider mb-1.5 block ml-1">Access Token</Label>
                                                <Input
                                                    type="password"
                                                    value={formData.access_token}
                                                    onChange={(e) => updateField("access_token", e.target.value)}
                                                    placeholder="EAAG..."
                                                    className="h-10 bg-black/40 border-white/10 text-sm font-mono focus:border-indigo-500 focus:bg-indigo-950/20 transition-all rounded-xl placeholder:text-slate-600"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 4: Plan */}
                                    {step === 4 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                                            {[
                                                { id: "trial", name: "TRIAL", price: "Free", limit: "50 Leads", bg: "hover:bg-slate-900/50" },
                                                { id: "starter", name: "STARTER", price: "₹9,999", limit: "500 Leads/mo", bg: "hover:bg-cyan-900/20" },
                                                { id: "growth", name: "GROWTH", price: "₹14,999", limit: "1,000 Leads/mo", bg: "hover:bg-emerald-900/20", rec: true },
                                                { id: "domination", name: "DOMINATION", price: "₹29,999", limit: "5,000 Leads/mo", bg: "hover:bg-purple-900/20" },
                                            ].map((plan) => (
                                                <div
                                                    key={plan.id}
                                                    onClick={() => updateField("current_plan", plan.id)}
                                                    className={`cursor-pointer border rounded-xl p-3 flex items-center justify-between transition-all duration-300 group ${formData.current_plan === plan.id
                                                        ? "bg-gradient-to-r from-white/10 to-transparent border-white/40 shadow-lg shadow-white/5 scale-[1.02]"
                                                        : `bg-black/20 border-white/5 ${plan.bg}`
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${formData.current_plan === plan.id ? "bg-white border-white" : "border-slate-700 bg-transparent"}`}>
                                                            {formData.current_plan === plan.id && <div className="h-1.5 w-1.5 bg-black rounded-full" />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className={`text-xs font-bold tracking-wide transition-colors ${formData.current_plan === plan.id ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>{plan.name}</p>
                                                                {plan.rec && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">BEST</span>}
                                                            </div>
                                                            <p className="text-[10px] text-slate-500 font-medium">{plan.limit}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-sm font-bold transition-colors ${formData.current_plan === plan.id ? "text-white" : "text-slate-500"}`}>{plan.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {error && <div className="text-red-400 text-xs text-center bg-red-950/30 p-2 rounded-lg border border-red-500/20">{error}</div>}
                                        </motion.div>
                                    )}

                                    {/* Footer */}
                                    <div className="pt-2 flex justify-between items-center">
                                        <Button
                                            variant="ghost"
                                            onClick={prevStep}
                                            disabled={step === 1 || loading}
                                            className={`text-slate-500 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold tracking-wide ${step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                                        >
                                            BACK
                                        </Button>

                                        {step < 4 ? (
                                            <Button
                                                onClick={nextStep}
                                                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
                                                className="bg-white text-black hover:bg-slate-100 text-[10px] font-bold uppercase tracking-widest px-8 h-10 rounded-full transition-all duration-300 shadow-lg shadow-white/5 active:scale-95 border border-white/20"
                                            >
                                                Next
                                            </Button>
                                        ) : (
                                            <div className="relative group cursor-pointer" onClick={handleSubmit}>
                                                {/* Gradient Glow */}
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>

                                                <Button
                                                    disabled={loading}
                                                    className="relative h-12 px-8 bg-[#0B0F19] hover:bg-[#0f1422] text-white border border-white/10 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                                                >
                                                    {/* Shimmer Effect */}
                                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

                                                    {/* Tech Grid Background inside button */}
                                                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]"></div>

                                                    <span className="relative z-20 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Deploy System"}
                                                        {!loading && (
                                                            <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                                                                <ArrowRight className="h-2 w-2" />
                                                            </div>
                                                        )}
                                                    </span>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    )
}
