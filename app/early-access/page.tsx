"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Lock, Phone, Ticket, AlertCircle, ChevronRight } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function EarlyAccessPage() {
    const router = useRouter()
    const [code, setCode] = useState("")
    const [status, setStatus] = useState<"idle" | "verifying" | "error" | "success">("idle")

    const handleVerify = () => {
        if (!code) return
        setStatus("verifying")

        // Simulate API call
        setTimeout(() => {
            if (code === "ADWELINK_IND") {
                setStatus("success")
                // Success State: Redirect after short delay
                setTimeout(() => {
                    router.push("/login?demo=sharma")
                }, 1000)
            } else {
                setStatus("error")
            }
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-amber-500/30">

            {/* 🌌 Premium Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-amber-900/10 blur-[150px] rounded-full animate-pulse duration-[5000ms]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/10 blur-[150px] rounded-full animate-pulse duration-[7000ms]" />
            </div>

            {/* 💎 Glass Card Container */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">

                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[40px] p-6 md:p-8 shadow-2xl relative overflow-hidden">

                    {/* Inner Glow */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Header */}
                    <div className="text-center mb-8 md:mb-10">
                        <div className="inline-flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 mb-4 md:mb-6 shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]">
                            <Lock className="h-8 w-8 md:h-10 md:w-10 text-amber-500" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Restricted Access
                        </h1>
                        <p className="text-[11px] md:text-sm text-slate-400 font-medium">Invitation Required for Pilot 1.0</p>
                    </div>

                    {/* Input Area */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <Input
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.toUpperCase())
                                    setStatus("idle")
                                }}
                                placeholder="ENTER KEY"
                                className="relative bg-black border-white/10 text-center text-lg md:text-xl font-mono tracking-[0.15em] md:tracking-[0.2em] h-14 md:h-16 uppercase placeholder:text-slate-700 focus-visible:ring-0 focus-visible:border-amber-500/50 rounded-xl"
                            />
                        </div>

                        <Button
                            onClick={handleVerify}
                            disabled={status === "verifying" || !code}
                            className={`w-full h-14 rounded-xl font-bold text-base transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] ${status === "error" ? "bg-red-500 hover:bg-red-600 animate-shake" :
                                status === "success" ? "bg-emerald-500 hover:bg-emerald-600" :
                                    "bg-white text-black hover:bg-slate-200"
                                }`}
                        >
                            {status === "verifying" ? (
                                <span className="flex items-center gap-2">Verifying <span className="animate-pulse">...</span></span>
                            ) : status === "error" ? (
                                "ACCESS DENIED"
                            ) : status === "success" ? (
                                "ACCESS GRANTED"
                            ) : (
                                <span className="flex items-center gap-2">Unlock Access <ChevronRight className="h-4 w-4 opacity-50" /></span>
                            )}
                        </Button>
                    </div>

                    {/* Footer / Helper */}
                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="text-slate-500 hover:text-white hover:bg-white/5 text-xs uppercase tracking-widest transition-all">
                                    <AlertCircle className="h-3 w-3 mr-2" /> Don&apos;t have a Key?
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black/90 backdrop-blur-xl border border-white/10 text-white sm:max-w-md shadow-2xl rounded-[32px]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
                                            <Ticket className="h-5 w-5 text-amber-500" />
                                        </div>
                                        Get Access Key
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-400 pt-2 text-sm">
                                        This is a restricted pilot for 5 Institutes in Indore.
                                        Contact the Founder for an override key.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-6">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest px-1">Pilot Key Benefits</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                "₹0 Setup Fee: Permanent Free Setup",
                                                "Instant Access: Full Dashboard NOW",
                                                "Live Testing: Deploy Agents before Jan 10",
                                                "Founder Direct: Shape the product roadmap"
                                            ].map((benefit, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                                    {benefit}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button className="w-full h-14 bg-[#25D366] text-white hover:bg-[#128C7E] font-bold rounded-xl relative overflow-hidden group border-0 shadow-none" asChild>
                                            <a href="https://wa.me/918305105008?text=Hello%20Kashi,%20I%20want%20Early%20Access%20Key%20for%20Adwelink." target="_blank">
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                                <div className="relative flex items-center gap-2">
                                                    <Phone className="h-5 w-5" /> WhatsApp Request
                                                </div>
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                </div>

                {/* Back Link */}
                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <Link href="/" className="text-slate-500 text-xs font-medium hover:text-white transition-colors flex items-center justify-center gap-2 group">
                        <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Return to Home
                    </Link>
                </div>

            </div>
        </div>
    )
}
