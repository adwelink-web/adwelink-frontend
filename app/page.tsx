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
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase"

export default function LandingPage() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
    const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
    const [formData, setFormData] = useState({ name: "", contact: "" })

    // Countdown to Jan 10, 2026
    useEffect(() => {
        const target = new Date("2026-01-10T00:00:00").getTime()
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const diff = target - now
            if (diff < 0) {
                clearInterval(timer)
                return
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                secs: Math.floor((diff % (1000 * 60)) / 1000)
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleWaitlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setWaitlistStatus("submitting")

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('waitlist' as any)
                .insert([
                    {
                        full_name: formData.name,
                        contact: formData.contact,
                        source: 'landing'
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
        <div className="min-h-[100dvh] bg-black text-white font-sans flex flex-col items-center relative selection:bg-cyan-500/30 overflow-x-hidden">

            {/* 🌌 Background: Subtle Starfield / Noise */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />
                <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-indigo-900/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full" />
            </div>

            {/* 🧭 Navbar: Primary Logo & Location */}
            <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 shrink-0">
                <div className="relative h-9 md:h-10 w-32 md:w-40 bg-white/5 rounded-full px-4 border border-white/5 backdrop-blur-md flex items-center justify-center">
                    {/* Primary Logo Used Here - Wrapped in subtle background for contrast if needed */}
                    <Image src="/branding/adwelink.svg" alt="Adwelink" width={120} height={30} className="object-contain" priority />
                </div>

                <div className="flex items-center gap-3 md:gap-4 text-xs font-medium uppercase tracking-widest text-slate-500">
                    <Link href="/manifesto" className="flex items-center gap-1 hover:text-white transition-colors">
                        <FileText className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Our</span> Vision
                    </Link>

                    <Link href="/early-access">
                        <Button variant="outline" className="h-8 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 text-[10px] font-bold tracking-widest px-3 rounded-full uppercase">
                            <Ticket className="h-3 w-3 mr-2" /> Enter Code for Early Access
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* 🚀 Main Hero: "The Event" */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 pb-6 min-h-0">

                {/* Release Tag */}
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-slate-400 backdrop-blur-md uppercase tracking-wider">
                        Release v1.0 • Jan 10
                    </span>
                </div>

                {/* Hero Headline */}
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 leading-[0.9]">
                    Aditi is Coming.
                </h1>

                <p className="text-base md:text-xl text-slate-400 max-w-xl mx-auto mb-8 font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 px-4">
                    The first <strong className="text-white font-medium">WhatsApp-First Humanoid AI Employee</strong> for Indore. <br className="hidden md:block" />
                    <span className="text-white/60">Not a Chatbot. She works directly in your WhatsApp.</span>
                </p>

                {/* Primary CTA: Invite Code & Waitlist */}
                <div className="max-w-xs md:max-w-sm w-full flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 px-6">
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
                                    Secure your spot for the Jan 10 Launch. We&apos;ll reach out when we&apos;re ready for your institute.
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

                {/* 🕒 Footer Countdown */}
                <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 md:gap-x-12 gap-y-6 text-center">
                    {[
                        { l: "DAYS", v: timeLeft.days },
                        { l: "HRS", v: timeLeft.hours },
                        { l: "MINS", v: timeLeft.mins },
                        { l: "SECS", v: timeLeft.secs },
                    ].map((t, i) => (
                        <div key={i} className="flex flex-col min-w-[60px]">
                            <span className="text-2xl md:text-xl font-mono font-bold text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{String(t.v).padStart(2, '0')}</span>
                            <span className="text-[10px] text-slate-600 font-bold tracking-widest">{t.l}</span>
                        </div>
                    ))}
                </div>

            </main>

            {/* 🗣️ Feedback Widget (Fixed Bottom Center) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-1000">
                <Link href="/feedback">
                    <Button className="h-10 px-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 rounded-full text-xs font-medium text-slate-400 hover:text-white transition-all gap-2 shadow-2xl">
                        <MessageSquare className="h-4 w-4" /> Give Feedback
                    </Button>
                </Link>
            </div>

        </div>
    )
}
