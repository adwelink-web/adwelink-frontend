"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    ArrowRight,
    Ticket,
    FileText,
    MessageSquare,
    User,
    CheckCircle
} from "lucide-react"
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
import Image from "next/image"
import { createClient } from "@/lib/supabase"

export default function TeaserLandingPage() {
    const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
    const [formData, setFormData] = useState({ name: "", contact: "" })

    const handleWaitlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setWaitlistStatus("submitting")

        try {
            const supabase = createClient()
            const { error } = await supabase
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .from('waitlist' as any)
                .insert([
                    {
                        full_name: formData.name,
                        contact: formData.contact,
                        source: 'teaser'
                    }
                ])

            if (error) throw error

            setWaitlistStatus("success")
            setFormData({ name: "", contact: "" })
        } catch (error) {
            console.error("Waitlist error:", error)
            setWaitlistStatus("error")
        }
    }

    return (
        <div className="min-h-[100dvh] bg-[#030712] text-white font-sans flex flex-col items-center relative selection:bg-cyan-500/30 overflow-x-hidden">

            {/* 🌌 Background: Premium Noise & Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-900/20 blur-[150px] rounded-full animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full" />
            </div>

            {/* 🧭 Navbar */}
            <nav className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex justify-between items-center relative z-20 shrink-0">
                <div className="relative h-8 w-24 md:w-36">
                    <Image src="/branding/adwelink.svg" alt="Adwelink" fill className="object-contain object-left" priority />
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/manifesto" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                        <FileText className="h-3.5 w-3.5" /> Vision
                    </Link>

                    <Link href="/early-access">
                        <Button className="h-9 px-3 md:px-5 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 hover:border-indigo-400 text-[10px] font-bold tracking-widest rounded-full uppercase transition-all duration-500">
                            <Ticket className="h-3 w-3 mr-2" /> Early Access
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* 🚀 Main Hero: "The Event" */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 pb-6 min-h-0">

                {/* Pilot Tag */}
                <div className="mb-6 animate-fade-in-up delay-100">
                    <span className="px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400 backdrop-blur-md uppercase tracking-wider font-bold">
                        Pilot Phase Is Live
                    </span>
                </div>

                {/* Hero Headline */}
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 animate-fade-in-up delay-200 leading-tight py-2">
                    Aditi is Coming.
                </h1>

                <p className="text-base md:text-xl text-slate-400 max-w-xl mx-auto mb-8 font-light animate-fade-in-up delay-300 px-4">
                    The first <strong className="text-white font-medium">WhatsApp-First Humanoid AI Employee</strong> for Indore. <br className="hidden md:block" />
                    <span className="text-white/60">Not a Chatbot. She works directly in your WhatsApp.</span>
                </p>

                {/* Primary CTA: Invite Code & Waitlist */}
                <div className="max-w-xs md:max-w-sm w-full flex flex-col items-center gap-3 animate-fade-in-up delay-500 px-6">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button suppressHydrationWarning className="w-full h-12 md:h-14 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group text-base shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                                Join Priority Waitlist <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black/90 backdrop-blur-2xl border border-white/10 text-white sm:max-w-[425px] rounded-[32px] p-8 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-bold tracking-tighter">Priority Waitlist</DialogTitle>
                                <DialogDescription className="text-slate-400 text-sm pt-2">
                                    Secure your spot for the Pilot Phase. We&apos;ll reach out when we&apos;re ready for your institute.
                                </DialogDescription>
                            </DialogHeader>

                            {waitlistStatus === "success" ? (
                                <div className="py-10 flex flex-col items-center text-center space-y-4">
                                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-bold">Registration Successful</h3>
                                    <p className="text-xs text-slate-500">Boro, aapka slot book ho gaya hai. <br />Hum jald hi WhatsApp karenge.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleWaitlistSubmit} className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <Input
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Enter your name"
                                                className="bg-white/5 border-white/10 pl-10 h-14 rounded-xl focus-visible:ring-1 focus-visible:ring-white/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">WhatsApp / Email</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                                <MessageSquare className="h-4 w-4" />
                                            </div>
                                            <Input
                                                required
                                                value={formData.contact}
                                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                placeholder="8305105008 or email@id"
                                                className="bg-white/5 border-white/10 pl-10 h-14 rounded-xl focus-visible:ring-1 focus-visible:ring-white/20"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={waitlistStatus === "submitting"}
                                        className="w-full h-14 bg-white text-black hover:bg-slate-200 font-bold rounded-xl transition-all"
                                    >
                                        {waitlistStatus === "submitting" ? "Registering..." : "Confirm My Priority Slot"}
                                    </Button>
                                    <p className="text-[10px] text-center text-slate-600">
                                        🔒 Private & Secure. No Spam.
                                    </p>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>

            </main>

            {/* 🗣️ Feedback Widget (Fixed Bottom Center) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in delay-1000">
                <Link href="/feedback">
                    <Button className="h-10 px-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 rounded-full text-xs font-medium text-slate-400 hover:text-white transition-all gap-2 shadow-2xl">
                        <MessageSquare className="h-4 w-4" /> Give Feedback
                    </Button>
                </Link>
            </div>

        </div>
    )
}
