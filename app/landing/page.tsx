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

export default function ClientLandingPage() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [showIntro, setShowIntro] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const timer = setTimeout(() => setShowIntro(false), 3800) // Slightly longer to allow shimmer to pass
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
                            <h1
                                className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 text-white drop-shadow-2xl"
                            >
                                Aditi is Coming.
                            </h1>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🌌 Background: Premium Noise & Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-[grid-pan_20s_linear_infinite]" />
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-900/20 blur-[150px] rounded-full animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full" />
            </div>

            {/* 🧭 Navbar (Animated Glass) */}
            <header
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${isScrolled ? "bg-white/1 border-white/10 py-3 shadow-2xl backdrop-blur-xl" : "bg-transparent border-transparent py-5"}`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    {/* Left Side: Logo */}
                    <div className="relative h-8 w-28 md:w-36">
                        <Image src="/branding/adwelink.svg" alt="Adwelink" fill className="object-contain object-left" priority />
                    </div>

                    {/* Right Side: Navigation + CTA Button */}
                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Navigation Links (Desktop) */}
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#problem" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Problem</a>
                            <a href="#solution" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Solution</a>
                            <a href="#aems" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">AEMS</a>
                            <a href="#pricing" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Pricing</a>
                            <a href="#offer" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Offer</a>
                        </nav>

                        {/* CTA Button - Hydration Safe */}
                        <div className="hidden md:block">
                            {mounted && (
                                <AccessCodeDialog>
                                    <Button className={`rounded-full px-6 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ease-out hover:scale-105 active:scale-95 border border-white/10 hover:border-white/50 shadow-lg hover:shadow-white/20 ${isScrolled ? "bg-white/10 text-white hover:bg-white hover:text-black" : "bg-white/5 text-white hover:bg-white hover:text-black"}`}>
                                        Client Login
                                    </Button>
                                </AccessCodeDialog>
                            )}
                        </div>

                        {/* Mobile Menu */}
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
                                        <a href="#problem" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3 group">
                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors"></span>
                                            Problem
                                        </a>
                                        <a href="#solution" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3 group">
                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors"></span>
                                            Solution
                                        </a>
                                        <a href="#aems" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3 group">
                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors"></span>
                                            AEMS System
                                        </a>
                                        <a href="#pricing" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3 group">
                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors"></span>
                                            Pricing
                                        </a>
                                        <a href="#offer" className="text-lg font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-3 group">
                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors"></span>
                                            Pilot Offer
                                        </a>
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

                {/* 🚀 Hero Section: The Hook */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="pt-40 pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto"
                >

                    {/* Trust Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <span className="px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <Star className="h-3 w-3 fill-emerald-400" />
                            Trusted by Indore&apos;s Top Institutes
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.95]"
                    >
                        Scale Admissions. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400">Autopilot Growth.</span>
                    </motion.h1>

                    {/* Subhead */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
                    >
                        <strong>Hire Aditi</strong>, your new AI Admission Counselor. She works 24/7, engages leads instantly, and qualifies students like a human expert.
                    </motion.p>


                    {/* CTA Buttons - Premium Design */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 items-center"
                    >
                        {mounted && (
                            <AccessCodeDialog>
                                <div className="relative group cursor-pointer">
                                    {/* Button Container */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative h-14 px-8 bg-[#0B0F19] hover:bg-[#0f1422] text-white border border-white/10 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-[1.02] shadow-2xl flex items-center justify-center">

                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

                                        {/* Tech Grid Background inside button */}
                                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]"></div>

                                        {/* Content */}
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

                {/* 💔 The Agitation: Director's Nightmare */}
                <motion.section
                    {...fadeInUp}
                    viewport={viewportConfig}
                    id="problem"
                    className="py-20 bg-black/40 border-y border-white/5 backdrop-blur-sm"
                >
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold text-red-500 mb-2 flex items-center gap-2 justify-center md:justify-start">
                                    <Siren className="h-6 w-6" /> The Challenge
                                </h3>
                                <p className="text-3xl font-bold text-white mb-4">The &quot;Leaky Bucket&quot; Problem</p>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Your marketing generates leads, but operational inefficiencies kill them. Missed calls, delayed responses, and lack of follow-up are costing you enrollments every day.
                                </p>
                            </div>

                            {/* Pain Points */}
                            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl"
                                >
                                    <h4 className="font-bold text-red-400 mb-2">1. Missed Opportunities</h4>
                                    <p className="text-xs text-slate-400">60% of student queries happen after hours. If you don&apos;t answer instantly, you lose them to competitors.</p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl"
                                >
                                    <h4 className="font-bold text-red-400 mb-2">2. Inconsistent Follow-ups</h4>
                                    <p className="text-xs text-slate-400">Manual follow-ups are prone to human error. Human counselors fatigue; AI never does.</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* 🆚 The Comparison: Bot vs Employee */}
                <section className="py-24 px-6 bg-[#0B0F19]">
                    <div className="max-w-4xl mx-auto">
                        <motion.div {...fadeInUp} viewport={viewportConfig} className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Stop Using Chatbots.<br />Start Hiring AI.</h2>
                            <p className="text-slate-400">Aditi isn&apos;t a script. She is a trained professional who knows how to sell.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                            {/* VS Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-black text-white border-4 border-[#030712] z-10 hidden md:flex"
                            >
                                VS
                            </motion.div>

                            {/* Standard Chatbot */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 0.7, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/50"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-slate-500" />
                                        <div className="h-2 w-2 rounded-full bg-slate-500 mx-1" />
                                        <div className="h-2 w-2 rounded-full bg-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-400">Standard Chatbot</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-500 text-sm">
                                        <span className="text-red-500 text-lg leading-none">×</span>
                                        <span>&quot;Press 1 for Fees&quot; (Robotic)</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-500 text-sm">
                                        <span className="text-red-500 text-lg leading-none">×</span>
                                        <span>Dumb FAQs only. No intent.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-500 text-sm">
                                        <span className="text-red-500 text-lg leading-none">×</span>
                                        <span>Cannot follow up on its own.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-500 text-sm">
                                        <span className="text-red-500 text-lg leading-none">×</span>
                                        <span>Frustrates students.</span>
                                    </li>
                                </ul>
                            </motion.div>

                            {/* Aditi (AI Employee) */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 relative overflow-hidden group hover:border-indigo-500/60 transition-colors"
                            >
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                                    HIRED
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <Star className="h-5 w-5 text-white fill-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Aditi (AI Employee)</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-indigo-200 text-sm">
                                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>&quot;Hi Rahul, interested in CS?&quot; (Human)</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-indigo-200 text-sm">
                                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Persuades & handles objections.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-indigo-200 text-sm">
                                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Follows up for months automatically.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-indigo-200 text-sm">
                                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Closes deals like a pro.</span>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ✨ The Solution: Aditi */}
                <section id="solution" className="py-24 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[200px] rounded-full pointer-events-none" />

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <motion.div {...fadeInUp} viewport={viewportConfig} className="text-center mb-16">
                            <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-2 block">The Solution</span>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Your 24/7 Admissions Team.</h2>
                            <p className="text-slate-400">Aditi empowers your institute with enterprise-grade AI that handles the grunt work, so you focus on education.</p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainerVariants}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {/* Card 1 */}
                            <motion.div variants={fadeInUpVariants} className="p-8 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl hover:border-indigo-500/50 transition-colors group">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 mb-6 group-hover:scale-110 transition-transform">
                                    <Zap className="h-7 w-7 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Instant Engagement</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Aditi responds in under 3 seconds, 24/7. Capture student interest at the peak moment of intent, significantly increasing conversion rates.
                                </p>
                            </motion.div>

                            {/* Card 2 */}
                            <motion.div variants={fadeInUpVariants} className="p-8 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl hover:border-indigo-500/50 transition-colors group">
                                <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform">
                                    <CheckCircle className="h-7 w-7 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Intelligent Nurturing</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    From scheduling campus visits to answering fee queries, Aditi manages the entire lifecycle. No lead is ever left behind.
                                </p>
                            </motion.div>

                            {/* Card 3 */}
                            <motion.div variants={fadeInUpVariants} className="p-8 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl hover:border-indigo-500/50 transition-colors group">
                                <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform">
                                    <Phone className="h-7 w-7 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">WhatsApp Native</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Zero friction. Aditi lives where your students live—on WhatsApp. No app downloads required, ensuring maximum reach.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* 💻 The AEMS: Command Center */}
                <section id="aems" className="py-24 bg-white/5 border-t border-white/5">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row gap-16 items-center">

                            {/* Visual (Abstract Representation of Dashboard) */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full md:w-1/2 relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 blur-xl rounded-xl group-hover:opacity-30 transition-opacity duration-700" />
                                <div className="relative aspect-video bg-[#0B0F19] rounded-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                                    {/* Mock Header */}
                                    <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                                        <div className="h-2 w-2 rounded-full bg-red-500/50" />
                                        <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                                        <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                                    </div>
                                    {/* Mock Content */}
                                    <div className="p-6 flex-1 flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <div className="h-24 w-1/3 bg-white/5 rounded-lg animate-pulse" />
                                            <div className="h-24 w-1/3 bg-white/5 rounded-lg animate-pulse delay-75" />
                                            <div className="h-24 w-1/3 bg-white/5 rounded-lg animate-pulse delay-150" />
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-lg border border-white/5 p-4">
                                            <div className="h-4 w-1/2 bg-white/10 rounded mb-4" />
                                            <div className="space-y-2">
                                                <div className="h-2 w-full bg-white/5 rounded" />
                                                <div className="h-2 w-5/6 bg-white/5 rounded" />
                                                <div className="h-2 w-4/6 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Stats Badge */}
                                    <div className="absolute bottom-6 right-6 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-lg shadow-xl">
                                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Live Conversion</p>
                                        <p className="text-2xl font-bold text-white">12% <span className="text-xs font-normal text-emerald-400">↑</span></p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Copy */}
                            <motion.div
                                {...fadeInUp}
                                viewport={viewportConfig}
                                className="w-full md:w-1/2"
                            >
                                <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-2 block">The Command Center</span>
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Complete Control.<br />Zero Chaos.</h2>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                    Aditi does the work, but you stay in charge. Monitor every conversation, track performance, and verify results in real-time with our proprietary <strong>AI Employee Management System (AEMS)</strong>.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="mt-1 h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <Users className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Live Transparency</h4>
                                            <p className="text-xs text-slate-400">See exactly what Aditi is saying to your students. Nothing is hidden.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="mt-1 h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                                            <Hand className="h-4 w-4 text-amber-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Seamless Handover</h4>
                                            <p className="text-xs text-slate-400">Take control anytime. Aditi pauses instantly when you type, letting you handle sensitive queries personally.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="mt-1 h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                                            <Lock className="h-4 w-4 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Lead Ownership</h4>
                                            <p className="text-xs text-slate-400">Export your data anytime. Your leads belong to you, not us.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </section>

                {/* 🔒 Risk Reversal & Trust */}
                <section className="py-20 bg-white/5 border-y border-white/5">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-white/10 text-xs font-mono text-slate-400 mb-8">
                            <Lock className="h-3 w-3" /> Enterprise Grade Security
                        </div>
                        <h2 className="text-3xl font-bold mb-6">Your Data. Your Control.</h2>
                        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                            We know data is the lifeblood of an institute. Your leads are stored in an isolated, encrypted database with strict privacy controls.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Encrypted</span>
                            <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Private</span>
                            <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Daily Backups</span>
                        </div>
                    </div>
                </section>

                {/* 💰 Pricing Section */}
                <section id="pricing" className="py-24 px-6 bg-[#0B0F19]">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeInUp} viewport={viewportConfig} className="text-center mb-16">
                            <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-2 block">Exclusive Access</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Founding Partner Members.</h2>
                            <p className="text-slate-400 max-w-xl mx-auto mb-4">
                                One-time Custom Setup: <span className="text-slate-500 line-through text-lg decoration-red-500 mr-2">₹25,000</span>
                                <span className="text-white font-bold text-xl">₹10,000</span>
                                <span className="block text-xs text-emerald-400 mt-1 font-bold uppercase tracking-wider">Includes Personal Visit By Founder</span>
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainerVariants}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {/* Starter */}
                            <motion.div variants={fadeInUpVariants} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors group">
                                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-3xl font-bold">₹9,999</span>
                                    <span className="text-slate-500 text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 text-sm text-slate-400">
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> <span className="text-white font-bold">500</span> Lead Processing</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> Aditi AI Employee</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> WhatsApp Integration</li>
                                </ul>
                                {mounted && (
                                    <AccessCodeDialog>
                                        <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold" suppressHydrationWarning>Request Access</Button>
                                    </AccessCodeDialog>
                                )}
                            </motion.div>

                            {/* Growth */}
                            <motion.div variants={fadeInUpVariants} className="p-8 rounded-[32px] bg-gradient-to-b from-indigo-900/20 to-transparent border border-indigo-500/50 relative transform hover:-translate-y-2 transition-transform duration-300 shadow-2xl">
                                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">MOST POPULAR</div>
                                <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold text-indigo-400">₹14,999</span>
                                    <span className="text-slate-500 text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 text-sm text-slate-300">
                                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" /> <span className="font-bold text-white">1,000 Lead Processing</span></li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" /> Aditi AI Employee (Pro)</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" /> Priority Support</li>
                                </ul>
                                {mounted && (
                                    <AccessCodeDialog>
                                        <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25" suppressHydrationWarning>Request Invite</Button>
                                    </AccessCodeDialog>
                                )}
                            </motion.div>

                            {/* Enterprise */}
                            <motion.div variants={fadeInUpVariants} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors group">
                                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-3xl font-bold">₹29,999</span>
                                    <span className="text-slate-500 text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 text-sm text-slate-400">
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-purple-400 shrink-0" /> <span className="font-bold text-white">5,000</span> Lead Processing</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-purple-400 shrink-0" /> Aditi AI Employee (Enterprise)</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-purple-400 shrink-0" /> Priority Support</li>
                                </ul>
                                {mounted && (
                                    <AccessCodeDialog>
                                        <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold" suppressHydrationWarning>Contact Sales</Button>
                                    </AccessCodeDialog>
                                )}
                                <p className="text-[10px] text-slate-600 mt-4 text-center italic">*Fair usage policy applies. Introductory pricing.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* 🤝 Strategic Partner Program (Formerly Referral) */}
                <section className="py-20 px-6 bg-gradient-to-b from-[#0B0F19] to-indigo-950/20 border-t border-white/5">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-6 inline-block">
                            Ecosystem Alliance
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Strategic Partner Program</h2>
                        <p className="text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Join the movement to modernize Indore&apos;s education sector. Facilitate AI adoption among peer institutes and unlock exclusive operational privileges.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                            {/* Tier 1 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors">
                                <div className="absolute top-0 right-0 bg-slate-700 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl">TIER 1 PARTNER</div>
                                <div className="text-3xl font-bold text-white mb-2">3 Institutes Onboarded</div>
                                <p className="text-lg text-indigo-300 font-bold mb-2">1 Month Fee Waiver</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Starter Plan (₹10k Value)</p>
                            </div>
                            {/* Tier 2 */}
                            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 relative overflow-hidden ring-1 ring-indigo-500/50 hover:scale-[1.02] transition-transform shadow-2xl">
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">GOLD PARTNER</div>
                                <div className="text-3xl font-bold text-white mb-2">5 Institutes Onboarded</div>
                                <p className="text-lg text-emerald-400 font-bold mb-2">1 Month Fee Waiver</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Growth Plan (₹15k Value)</p>
                                <div className="mt-4 inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold">
                                    PREMIUM STATUS
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🎁 The "Godfather" Offer */}
                <section id="offer" className="py-24 px-6 bg-[#0B0F19]">
                    <div className="max-w-3xl mx-auto relative group">
                        {/* Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 opacity-20 blur-xl rounded-[40px] group-hover:opacity-30 transition-opacity duration-1000" />

                        <div className="relative bg-[#0B0F19] border border-white/10 rounded-[32px] p-8 md:p-12 text-center overflow-hidden">

                            {/* Ribbon */}
                            <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-6 py-1 translate-x-[30%] translate-y-[50%] rotate-45 shadow-lg">
                                INVITE ONLY
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Personal Onboarding.</h2>
                            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                                Adwelink is currently operating in an <span className="text-white font-bold">Invite-Only Mode</span>. I personally visit your campus to set up Aditi exactly according to your needs.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10 text-left text-sm text-slate-300">
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Founder-Led Onboarding</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Priority Support</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Full Dashboard Access</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Exclusive Early Features</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {mounted && (
                                    <AccessCodeDialog>
                                        <Button className="h-14 px-8 bg-white text-black hover:bg-slate-200 font-bold rounded-xl text-base transition-all shadow-xl">
                                            Enter Workspace
                                        </Button>
                                    </AccessCodeDialog>
                                )}
                                {mounted && (
                                    <AccessCodeDialog>
                                        <Button variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 font-bold rounded-xl text-base transition-all" suppressHydrationWarning>
                                            Schedule a Demo
                                        </Button>
                                    </AccessCodeDialog>
                                )}
                            </div>

                            <p className="mt-6 text-xs text-slate-500">
                                Currently accepting applications from Indore-based institutes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 border-t border-white/5 bg-[#030712]">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-center md:text-left">
                            {/* Brand Column */}
                            <div className="md:col-span-2 flex flex-col items-center md:items-start">
                                <div className="relative h-10 w-36 mb-4">
                                    <Image src="/branding/adwelink.svg" alt="Adwelink" fill className="object-contain object-left" />
                                </div>
                                <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
                                    AI Employees for Education. Helping institutes scale admissions with human-like, autonomous AI employees.
                                </p>
                                <div className="flex gap-4 justify-center md:justify-start">
                                    <a href="https://linkedin.com/in/adwelink-india-1700b2333" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-colors">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                    </a>
                                    <a href="https://instagram.com/adwelink_india" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-colors">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    </a>
                                    <a href="mailto:adwelink@gmail.com" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-colors">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-bold text-white mb-4 text-sm">Quick Links</h4>
                                <ul className="space-y-3">
                                    <li><a href="#problem" className="text-slate-500 hover:text-white transition-colors text-sm">The Problem</a></li>
                                    <li><a href="#solution" className="text-slate-500 hover:text-white transition-colors text-sm">The Solution</a></li>
                                    <li><a href="#aems" className="text-slate-500 hover:text-white transition-colors text-sm">AEMS Dashboard</a></li>
                                    <li><a href="#offer" className="text-slate-500 hover:text-white transition-colors text-sm">Pilot Program</a></li>
                                </ul>
                            </div>


                        </div>

                        {/* Bottom Bar */}
                        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                            <p className="text-slate-600 text-xs">© 2026 Adwelink Technologies Pvt. Ltd. All rights reserved.</p>
                            <div className="flex gap-6 text-xs text-slate-600">
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>

            </main>
        </div >
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

        // Mock Verification (Replace with real DB check later)
        // Hardcoded Master Code: "ALPHA"
        await new Promise(r => setTimeout(r, 1000)) // Fake delay for drama

        if (code.toUpperCase() === "ALPHA") {
            toast.success("Access Granted", { description: "Welcome to the future." })
            router.push("/login") // Or wherever you want them to go
        } else {
            setError(true)
            toast.error("Access Denied", { description: "Invalid Invite Code." })
        }
        setLoading(false)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-[#0B0F19] border border-white/10 text-white sm:max-w-md rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Lock className="h-5 w-5 text-indigo-400" /> Private Access
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Adwelink is strictly invite-only. Enter your Founder Invite Code to proceed.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleVerify} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="ENTER-CODE"
                            className={`bg-white/5 border-white/10 text-center font-mono tracking-[0.5em] text-lg uppercase h-14 ${error ? "border-red-500/50 text-red-400" : "focus:border-indigo-500/50"}`}
                            maxLength={10}
                        />
                        {error && <p className="text-xs text-red-400 text-center animate-pulse">Invalid Code. Ask for an invite.</p>}
                    </div>
                    <Button type="submit" disabled={loading || !code} className="w-full bg-white text-black hover:bg-slate-200 font-bold rounded-xl h-12">
                        {loading ? "Verifying..." : "Unlock Workspace"}
                    </Button>
                </form>
                <div className="text-center">
                    <p className="text-[10px] text-slate-500">Don't have a code? <a href="mailto:adwelink@gmail.com" className="text-indigo-400 hover:underline">Request via Email</a></p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
