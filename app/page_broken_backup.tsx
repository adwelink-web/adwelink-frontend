"use client"

import { Button } from "@/components/ui/button"
import {
    ChevronRight,
    Star,
    CheckCircle,
    Zap,
    Siren,
    Phone,
    Lock,
    Users,
    ArrowRight,
    Hand,
    Menu
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Animation Constants
const viewportConfig = { once: false, margin: "-100px" } as const

const transitionConfig = { duration: 0.6, ease: "easeOut" as const }

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: transitionConfig
}

const fadeInUpVariants = {
    initial: { opacity: 0, y: 30 },
    whileInView: {
        opacity: 1,
        y: 0,
        transition: transitionConfig
    }
}

const staggerContainerVariants = {
    initial: { opacity: 0 },
    whileInView: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

export default function RootLandingPage() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [showIntro, setShowIntro] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const timer = setTimeout(() => setShowIntro(false), 3800)
        return () => clearTimeout(timer)
    }, [])

    React.useEffect(() => {
        const scrollContainer = document.getElementById("public-scroll-container")
        const handleScroll = () => {
            if (scrollContainer) {
                setIsScrolled(scrollContainer.scrollTop > 20)
            }
        }

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll)
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll)
            }
        }
    }, [])

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            {/* 🎬 Cinematic Intro Overlay */}
            <AnimatePresence>
                {showIntro && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none overflow-hidden"
                    >
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-900/20 blur-[150px] rounded-full animate-pulse duration-[8000ms]" />
                            <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full" />
                        </div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, filter: "blur(20px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            className="text-center relative z-10"
                        >
                            <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 text-white drop-shadow-2xl">
                                Aditi is Coming.
                            </h1>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🌌 Background: Premium Noise & Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-900/20 blur-[150px] rounded-full animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full" />
            </div>

            {/* 🧭 Navbar */}
            <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${isScrolled ? "bg-white/1 border-white/10 py-3 shadow-2xl backdrop-blur-xl" : "bg-transparent border-transparent py-5"}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="relative h-8 w-28 md:w-36">
                        <Image src="/branding/adwelink.svg" alt="Adwelink" fill className="object-contain object-left" priority />
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#problem" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Problem</a>
                            <a href="#solution" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Solution</a>
                            <a href="#aems" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">AEMS</a>
                            <a href="#pricing" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Pricing</a>
                            <a href="#offer" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Offer</a>
                        </nav>

                        <div className="hidden md:block">
                            {mounted && (
                                <AccessCodeDialog>
                                    <Button className={`rounded-full px-6 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ease-out hover:scale-105 active:scale-95 border border-white/10 hover:border-white/50 shadow-lg hover:shadow-white/20 ${isScrolled ? "bg-white/10 text-white hover:bg-white hover:text-black" : "bg-white/5 text-white hover:bg-white hover:text-black"}`}>
                                        Client Login
                                    </Button>
                                </AccessCodeDialog>
                            )}
                        </div>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10" suppressHydrationWarning>
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-[#0B0F19] border-l border-white/10 text-white w-[300px] p-6 pt-12">
                                <div className="flex flex-col gap-10 h-full">
                                    <div className="relative h-10 w-36">
                                        <Image src="/branding/adwelink.svg" alt="Adwelink" fill className="object-contain object-left" priority />
                                    </div>
                                    <nav className="flex flex-col gap-6">
                                        <a href="#problem" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3">Problem</a>
                                        <a href="#solution" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3">Solution</a>
                                        <a href="#aems" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3">AEMS System</a>
                                        <a href="#pricing" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3">Pricing</a>
                                        <a href="#offer" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3">Pilot Offer</a>
                                    </nav>
                                    <div className="mt-auto mb-8">
                                        {mounted && (
                                            <AccessCodeDialog>
                                                <div className="w-full bg-white text-black hover:bg-slate-200 font-bold h-14 text-base rounded-xl shadow-lg flex items-center justify-center cursor-pointer">
                                                    Login to Dashboard
                                                </div>
                                            </AccessCodeDialog>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <main className="relative z-10 w-full">

                {/* 🚀 Hero Section */}
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="pt-40 pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
                        <span className="px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <Star className="h-3 w-3 fill-emerald-400" />
                            Trusted by Indore&apos;s Top Institutes
                        </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.95]">
                        Scale Admissions. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400">Autopilot Growth.</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        <strong>Hire Aditi</strong>, your new AI Admission Counselor. She works 24/7, engages leads instantly, and qualifies students like a human expert.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 items-center">
                        {mounted && (
                            <AccessCodeDialog>
                                <div className="relative group cursor-pointer">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
                                    <div className="relative h-14 px-8 bg-[#0B0F19] hover:bg-[#0f1422] text-white border border-white/10 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-[1.02] shadow-2xl flex items-center justify-center">
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
                                        <div className="relative flex items-center gap-3 z-20">
                                            <span className="text-base font-semibold tracking-wide">Enter Workspace</span>
                                            <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                                                <ArrowRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccessCodeDialog>
                        )}
                    </motion.div>
                </motion.section>

                {/* Additional Sections (Problem, Solution, etc.) */}
                <motion.section {...fadeInUp} viewport={viewportConfig} id="problem" className="py-20 bg-black/40 border-y border-white/5 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-6 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-red-500 mb-2 flex items-center gap-2 justify-center md:justify-start">
                            <Siren className="h-6 w-6" /> The Challenge
                        </h3>
                        <p className="text-3xl font-bold text-white mb-4">The Leaky Bucket Problem</p>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                            Your marketing generates leads, but operational inefficiencies kill them. Missed calls, delayed responses, and lack of follow-up are costing you enrollments every day.
                        </p>
                    </div>
                </motion.section>

                {/* Comparison Section */}
                <section className="py-24 px-6 bg-[#0B0F19]">
                    <div className="max-w-4xl mx-auto">
                        <motion.div {...fadeInUp} viewport={viewportConfig} className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Stop Using Chatbots.<br />Start Hiring AI.</h2>
                            <p className="text-slate-400">Aditi isn&apos;t a script. She is a trained professional who knows how to sell.</p>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Card: Chatbot */}
                            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/50 opacity-70">
                                <h3 className="text-xl font-bold text-slate-400 mb-6">Standard Chatbot</h3>
                                <ul className="space-y-4 text-slate-500 text-sm">
                                    <li>× &quot;Press 1 for Fees&quot; (Robotic)</li>
                                    <li>× Dumb FAQs only. No intent.</li>
                                    <li>× Cannot follow up autonomously.</li>
                                </ul>
                            </div>
                            {/* Card: Aditi */}
                            <div className="p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 relative overflow-hidden group hover:border-indigo-500/60 transition-colors">
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Hired</div>
                                <h3 className="text-xl font-bold text-white mb-6">Aditi (AI Employee)</h3>
                                <ul className="space-y-4 text-indigo-200 text-sm">
                                    <li><CheckCircle className="h-4 w-4 text-emerald-400 inline mr-2" /> &quot;Hi Rahul, interested in CS?&quot;</li>
                                    <li><CheckCircle className="h-4 w-4 text-emerald-400 inline mr-2" /> Persuades & handles objections.</li>
                                    <li><CheckCircle className="h-4 w-4 text-emerald-400 inline mr-2" /> Follows up for months.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution Section */}
                <section id="solution" className="py-24 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Your 24/7 Admissions Team.</h2>
                            <p className="text-slate-400">Aditi handles the grunt work, so you focus on education.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">
                                <Zap className="h-7 w-7 text-indigo-400 mb-6" />
                                <h3 className="text-xl font-bold mb-3">Instant Engagement</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Responds in under 3 seconds, 24/7. Capture interest at peak intent.</p>
                            </div>
                            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">
                                <CheckCircle className="h-7 w-7 text-purple-400 mb-6" />
                                <h3 className="text-xl font-bold mb-3">Intelligent Nurturing</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Manages schedules, fee queries, and lifecycle without fatigue.</p>
                            </div>
                            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">
                                <Phone className="h-7 w-7 text-emerald-400 mb-6" />
                                <h3 className="text-xl font-bold mb-3">WhatsApp Native</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Lives where students live. Zero friction, zero app downloads.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AEMS Section */}
                <section id="aems" className="py-24 bg-white/5 border-t border-white/5">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="w-full md:w-1/2">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Complete Control.<br />Zero Chaos.</h2>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">Monitor every conversation and verify results in real-time with our <strong>AI Employee Management System (AEMS)</strong>.</p>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <Users className="h-6 w-6 text-emerald-400 shrink-0" />
                                        <div><h4 className="font-bold text-white mb-1">Live Transparency</h4><p className="text-xs text-slate-400">See exactly what Aditi is saying. Nothing is hidden.</p></div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Hand className="h-6 w-6 text-amber-400 shrink-0" />
                                        <div><h4 className="font-bold text-white mb-1">Seamless Handover</h4><p className="text-xs text-slate-400">Take control anytime. AI pauses when you type.</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 aspect-video bg-[#0B0F19] rounded-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col p-6">
                                <div className="h-4 w-1/2 bg-white/10 rounded mb-4 animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/5 rounded" />
                                    <div className="h-2 w-4/6 bg-white/5 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Offer Section */}
                <section id="offer" className="py-24 px-6 bg-[#0B0F19]">
                    <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-[32px] p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-6 py-1 rotate-45 translate-x-[30%] translate-y-[50%]">INVITE ONLY</div>
                        <h2 className="text-4xl font-bold mb-4">Personal Onboarding.</h2>
                        <p className="text-slate-400 mb-8 font-light">Adwelink is in Invite-Only Mode. We personally visit your campus for setup.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {mounted && (
                                <AccessCodeDialog>
                                    <Button className="h-14 px-8 bg-white text-black hover:bg-slate-200 font-bold rounded-xl text-base shadow-xl">Enter Workspace</Button>
                                </AccessCodeDialog>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 border-t border-white/5 bg-[#030712]">
                    <div className="max-w-6xl mx-auto px-6 text-center md:text-left flex flex-col items-center md:items-start">
                        <div className="relative h-10 w-36 mb-4">
                            <Image src="/branding/adwelink.svg" alt="Adwelink" fill className="object-contain" />
                        </div>
                        <p className="text-slate-500 text-sm max-w-sm mb-8">AI Employees for Education. Helping institutes scale admissions autonomously.</p>
                        <p className="text-slate-600 text-xs text-center w-full mt-8 pt-8 border-t border-white/5">© 2026 Adwelink Technologies Pvt. Ltd. All rights reserved.</p>
                    </div>
                </footer>

            </main>
        </div>
    )
}

function AccessCodeDialog({ children }: { children: React.ReactNode }) {
    const [code, setCode] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(false)

        try {
            const response = await fetch('/api/invites/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            })

            const result = await response.json()

            if (response.ok && result.success) {
                toast.success("Access Granted", { description: "Welcome to the future." })
                router.push("/login")
            } else {
                setError(true)
                toast.error("Access Denied", { description: result.error || "Invalid Invite Code." })
            }
        } catch (err) {
            toast.error("System Error", { description: "Please try again later." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-[#0B0F19] border border-white/10 text-white sm:max-w-md rounded-3xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2"><Lock className="h-5 w-5 text-indigo-400" /> Private Access</DialogTitle>
                    <DialogDescription className="text-slate-400 pt-1 text-sm leading-relaxed">Adwelink is strictly invite-only. Enter your Founder Invite Code to proceed.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleVerify} className="space-y-4 py-4">
                    <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ENTER-CODE" className={`bg-white/5 border-white/10 text-center font-mono tracking-[0.5em] text-lg uppercase h-14 rounded-xl ${error ? "border-red-500/50 text-red-400" : ""}`} />
                    <Button type="submit" disabled={loading || !code} className="w-full bg-white text-black font-bold rounded-xl h-12">{loading ? "Verifying..." : "Unlock Workspace"}</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
