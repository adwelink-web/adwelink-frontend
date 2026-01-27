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
    Menu,
    MapPin,
    Calendar,
    Briefcase,
    TrendingUp,
    Instagram,
    Linkedin,
    Mail
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
    SheetClose,
    SheetTitle,
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
    const [isLoginOpen, setIsLoginOpen] = useState(false)

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
                            <a href="#ams" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">AMS</a>
                            <a href="#pricing" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Pricing</a>
                            <a href="#offer" className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Offer</a>
                        </nav>

                        {/* CTA Button - Hydration Safe */}
                        <div className="hidden md:block">
                            {mounted && (
                                <Button onClick={() => setIsLoginOpen(true)} className={`rounded-full px-6 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ease-out hover:scale-105 active:scale-95 border border-white/10 hover:border-white/50 shadow-lg hover:shadow-white/20 ${isScrolled ? "bg-white/10 text-white hover:bg-white hover:text-black" : "bg-white/5 text-white hover:bg-white hover:text-black"}`}>
                                    Client Login
                                </Button>
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10" suppressHydrationWarning>
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-black border-l border-zinc-800 text-white w-[300px] p-0 shadow-2xl z-[100]">
                                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                                <div className="flex flex-col h-full bg-black">
                                    <div className="p-8 border-b border-zinc-800">
                                        <div className="relative h-10 w-36">
                                            <Image src="/branding/adwelink.svg" alt="Adwelink" fill className="object-contain object-left" priority />
                                        </div>
                                    </div>

                                    <nav className="flex flex-col gap-2 p-6 flex-1">
                                        {[
                                            { href: "#problem", label: "The Problem" },
                                            { href: "#solution", label: "The Solution" },
                                            { href: "#ams", label: "AMS System" },
                                            { href: "#pricing", label: "Investment" },
                                            { href: "#offer", label: "Pilot Offer" }
                                        ].map((link) => (
                                            <SheetClose asChild key={link.href}>
                                                <a
                                                    href={link.href}
                                                    className="relative flex items-center gap-4 py-4 px-4 rounded-xl text-lg font-medium text-slate-400 hover:text-white transition-all duration-300 group overflow-hidden border border-transparent hover:border-indigo-500/30 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-transparent hover:shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]"
                                                >
                                                    {/* Active Indicator Line (Hidden by default, appears on hover) */}
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />

                                                    {/* Neon Dot */}
                                                    <div className="h-2 w-2 rounded-full bg-zinc-700 group-hover:bg-indigo-400 group-hover:scale-125 group-hover:shadow-[0_0_8px_rgba(129,140,248,0.9)] transition-all duration-300 z-10" />

                                                    <span className="tracking-wide z-10 group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                                                </a>
                                            </SheetClose>
                                        ))}
                                    </nav>

                                    <div className="p-6 border-t border-zinc-800 bg-zinc-950/50">
                                        {mounted && (
                                            <SheetClose asChild>
                                                <div onClick={() => setIsLoginOpen(true)} className="relative group cursor-pointer w-full">
                                                    {/* Gradient Glow Effect */}
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-500"></div>

                                                    {/* Main Button Content */}
                                                    <div className="relative w-full h-14 bg-[#0B0F19] hover:bg-black rounded-xl flex items-center justify-center gap-3 text-white font-bold tracking-wider transition-all border border-white/10 group-hover:border-white/30">
                                                        <Lock className="h-4 w-4 text-indigo-400 group-hover:text-fuchsia-400 transition-colors duration-500" />
                                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-fuchsia-200 group-hover:from-white group-hover:to-white transition-all duration-500">
                                                            LOGIN TO DASHBOARD
                                                        </span>
                                                    </div>
                                                </div>
                                            </SheetClose>
                                        )}
                                        <p className="text-[10px] text-center text-zinc-600 mt-6 font-medium">
                                            Adwelink Systems Pvt Ltd. © 2024
                                        </p>
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
                            <PartnershipApplicationDialog>
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
                                            <span className="text-base font-semibold tracking-wide">Secure Founding Access</span>
                                            <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                                                <ArrowRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PartnershipApplicationDialog>
                        )}
                    </motion.div>
                </motion.section>

                {/* 💔 The Agitation: Director's Nightmare */}
                <motion.section
                    {...fadeInUp}
                    viewport={viewportConfig}
                    id="problem"
                    className="py-20 bg-black/40 border-y border-white/5 backdrop-blur-sm scroll-mt-12"
                >
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold text-red-500 mb-2 flex items-center gap-2 justify-center md:justify-start">
                                    <Siren className="h-6 w-6" /> Director&apos;s Nightmare
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
                                        <span>&quot;Hi Rahul, beta engineering karni hai kya?&quot; (Natural)</span>
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
                <section id="solution" className="py-24 relative overflow-hidden scroll-mt-12">
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

                {/* 💻 The AMS: Command Center */}
                <section id="ams" className="py-24 bg-white/5 border-t border-white/5 scroll-mt-12">
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
                                    Aditi does the work, but you stay in charge. Monitor every conversation, track performance, and verify results in real-time with our proprietary <strong>Agent Management System (AMS)</strong>.
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
                <section id="pricing" className="py-16 px-6 bg-[#0B0F19] scroll-mt-8">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeInUp} viewport={viewportConfig} className="text-center mb-16">
                            <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-2 block">Exclusive Access</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Partnership Investment Plans.</h2>
                            <p className="text-slate-400 max-w-xl mx-auto mb-4 italic">
                                *Pilot Phase limited to 10 Select Institutes. Currently vetting for quality partners.*
                            </p>
                            <p className="text-slate-400 max-w-xl mx-auto mb-4">
                                One-time Custom Setup: <span className="text-slate-500 line-through text-lg decoration-red-500 mr-2">₹15,000</span>
                                <span className="text-white font-bold text-xl">₹10,000</span>
                                <span className="block text-xs text-emerald-400 mt-1 font-bold uppercase tracking-wider">Exclusive for First 2 Invited Founding Partners</span>
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
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> <span className="text-white font-bold">500</span> Leads/mo</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> Aditi AI Employee</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> WhatsApp Integration</li>
                                </ul>
                                {mounted && (
                                    <PartnershipApplicationDialog>
                                        <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold" suppressHydrationWarning>Apply for Partnership</Button>
                                    </PartnershipApplicationDialog>
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
                                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" /> <span className="font-bold text-white">1,000 Leads/mo</span></li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" /> Aditi AI Employee (Pro)</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" /> Priority Support</li>
                                </ul>
                                {mounted && (
                                    <PartnershipApplicationDialog>
                                        <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25" suppressHydrationWarning>Request Priority Invite</Button>
                                    </PartnershipApplicationDialog>
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
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-purple-400 shrink-0" /> <span className="font-bold text-white">5,000</span> Leads/mo</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-purple-400 shrink-0" /> Aditi AI Employee (Enterprise)</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-purple-400 shrink-0" /> Priority Support</li>
                                </ul>
                                {mounted && (
                                    <PartnershipApplicationDialog>
                                        <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold" suppressHydrationWarning>Apply for Pro Access</Button>
                                    </PartnershipApplicationDialog>
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
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">The Ambassador Circle</h2>
                        <p className="text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Join the movement to modernize Indore&apos;s education sector. <strong>Nominate a peer institute</strong> and facilitate AI adoption to unlock exclusive operational privileges.
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

                {/* 📱 Live Demo: Show Don't Tell (New Section) */}


                {/* ⚡ Onboarding Timeline (New Section) */}
                <section className="py-20 px-6 bg-[#0B0F19] border-t border-white/5 mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-2 block">Zero Headache Setup</span>
                        <h2 className="text-3xl font-bold mb-4">48 Hours to Autopilot.</h2>
                        <p className="text-slate-400">No technical team needed. We plug Aditi into your system, and she starts working.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-500/20 -translate-y-1/2 hidden md:block" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            {/* Step 1 */}
                            <div className="bg-[#0B0F19] p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center group hover:border-indigo-500/50 transition-colors">
                                <div className="h-12 w-12 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xl mb-4 shadow-[0_0_20px_rgba(99,102,241,0.3)]">1</div>
                                <h3 className="text-lg font-bold text-white mb-2">Sync Data</h3>
                                <p className="text-sm text-slate-400">Share your brochure and faculty details. We configure Aditi to talk exactly like your best counselor.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-[#0B0F19] p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center group hover:border-purple-500/50 transition-colors">
                                <div className="h-12 w-12 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-xl mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">2</div>
                                <h3 className="text-lg font-bold text-white mb-2">AI Training</h3>
                                <p className="text-sm text-slate-400">Aditi learns your FAQs, batch timings, and fee structure. We test her rigorously for 24 hours.</p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-[#0B0F19] p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-colors">
                                <div className="h-12 w-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xl mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">3</div>
                                <h3 className="text-lg font-bold text-white mb-2">Go Live</h3>
                                <p className="text-sm text-slate-400">Aditi starts handling all incoming WhatsApp queries. Watch your dashboard fill up with qualified leads.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🎁 The "Godfather" Offer */}
                <section id="offer" className="py-24 px-6 bg-[#0B0F19] scroll-mt-12">
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
                            <p className="text-sm font-handwriting text-indigo-300 mb-8 bg-indigo-500/10 inline-block px-4 py-2 rounded-lg border border-indigo-500/20">
                                "My goal isn't to sell you software. It's to ensure your classrooms are full." <br />
                                <span className="font-bold text-white block mt-1 text-right">- Founder, Adwelink</span>
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
                                    <PartnershipApplicationDialog>
                                        <Button className="h-14 px-8 bg-white text-black hover:bg-slate-200 font-bold rounded-xl text-base transition-all shadow-xl">
                                            Apply for Partnership
                                        </Button>
                                    </PartnershipApplicationDialog>
                                )}
                                {mounted && (
                                    <PartnershipApplicationDialog>
                                        <Button variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 font-bold rounded-xl text-base transition-all" suppressHydrationWarning>
                                            Schedule a Demo
                                        </Button>
                                    </PartnershipApplicationDialog>
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
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                    <a href="https://instagram.com/adwelink_india" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-colors">
                                        <Instagram className="h-4 w-4" />
                                    </a>
                                    <a href="mailto:adwelink@gmail.com" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-bold text-white mb-4 text-sm">Quick Links</h4>
                                <ul className="space-y-3">
                                    <li><a href="#problem" className="text-slate-500 hover:text-white transition-colors text-sm">The Problem</a></li>
                                    <li><a href="#solution" className="text-slate-500 hover:text-white transition-colors text-sm">The Solution</a></li>
                                    <li><a href="#ams" className="text-slate-500 hover:text-white transition-colors text-sm">AMS</a></li>
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

                <ClientLoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
            </main>
        </div >
    )
}

function ClientLoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [code, setCode] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(false)

        // Mock Verification
        await new Promise(r => setTimeout(r, 1500))

        if (code.toUpperCase() === "ALPHA") {
            toast.success("Access Granted", { description: "Welcome back, Founding Partner." })
            router.push("/home")
        } else {
            setError(true)
            toast.error("Access Denied", { description: "Invalid Client Key." })
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0B0F19]/95 backdrop-blur-xl border border-white/10 text-white sm:max-w-md rounded-3xl p-8 shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto bg-white/5 h-16 w-16 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                        <Lock className="h-8 w-8 text-indigo-400" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">Client Access</DialogTitle>
                    <DialogDescription className="text-slate-400 text-center">
                        Enter your unique 10-digit access key to enter your workspace.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleVerify} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value)
                                    setError(false)
                                }}
                                placeholder="XXXX-XXXX"
                                className={`bg-black/40 border-white/10 text-center font-mono tracking-[0.5em] text-lg uppercase h-16 rounded-xl focus:ring-2 ring-indigo-500/50 transition-all ${error ? "border-red-500/50 text-red-400" : "focus:border-indigo-500"}`}
                                maxLength={10}
                            />
                            {loading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-red-400 text-center font-medium"
                            >
                                Invalid Access Key. Please contact support.
                            </motion.p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={loading || !code}
                        className="w-full bg-white text-black hover:bg-slate-200 font-bold rounded-xl h-14 shadow-lg shadow-white/5 transition-all text-base"
                    >
                        {loading ? "Verifying Credentials..." : "Enter Workspace"}
                    </Button>
                </form>
                <div className="text-center pt-2 border-t border-white/5">
                    <p className="text-[11px] text-slate-500">
                        Lost your key? <a href="mailto:support@adwelink.com" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">Contact Priority Support</a>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function PartnershipApplicationDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        whatsapp_number: "",
        institute_name: "",
        annual_admissions_scale: "",
        current_counseling_team_size: "",
        primary_admission_challenge: "",
        institute_address: "",
        preferred_visit_time: "",
        referral_source: ""
    })

    const totalSteps = 4

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async () => {
        setLoading(true)
        // Mock Submission - In real implementation, this goes to Supabase 'waitlist' table
        await new Promise(r => setTimeout(r, 1500))

        const supabase = createClient()
        const { error } = await supabase.from('waitlist').insert([
            {
                full_name: formData.full_name,
                contact: formData.whatsapp_number, // Mapping to existing 'contact' column for now
                source: formData.referral_source || 'Direct Application',
                // Note: Other fields will be added to metadata or new columns once DB migration is run
            }
        ])

        if (error) {
            toast.error("Application Failed", { description: "Please try again or contact support." })
        } else {
            toast.success("Application Received", { description: "Our Founder will contact you shortly." })
            setOpen(false)
            setStep(1)
            setFormData({
                full_name: "",
                email: "",
                whatsapp_number: "",
                institute_name: "",
                annual_admissions_scale: "",
                current_counseling_team_size: "",
                primary_admission_challenge: "",
                institute_address: "",
                preferred_visit_time: "",
                referral_source: ""
            })
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-[#0B0F19] border border-white/10 text-white sm:max-w-xl rounded-[32px] p-0 overflow-hidden">
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            {step === 1 && <span className="text-indigo-400">Step 1: Identity</span>}
                            {step === 2 && <span className="text-purple-400">Step 2: Scale</span>}
                            {step === 3 && <span className="text-emerald-400">Step 3: Intent</span>}
                            {step === 4 && <span className="text-amber-400">Step 4: Finalize</span>}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Adwelink is an Invite-Only platform. Complete your profile for Founder verification.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                        <Input
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            placeholder="e.g. Rahul Sharma"
                                            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-indigo-500/50 text-white placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Email</label>
                                        <Input
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="director@institute.com"
                                            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-indigo-500/50 text-white placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Number</label>
                                        <Input
                                            value={formData.whatsapp_number}
                                            onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                            placeholder="+91 98765 43210"
                                            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-indigo-500/50 text-white placeholder:text-slate-600"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institute Name</label>
                                        <Input
                                            value={formData.institute_name}
                                            onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
                                            placeholder="Global Institute of Management"
                                            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-purple-500/50 text-white placeholder:text-slate-600"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Admissions Scale</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["< 200", "200 - 500", "500 - 1000", "1000+"].map((scale) => (
                                                <div
                                                    key={scale}
                                                    onClick={() => setFormData({ ...formData, annual_admissions_scale: scale })}
                                                    className={`cursor-pointer h-12 flex items-center justify-center rounded-xl border transition-all font-medium text-sm ${formData.annual_admissions_scale === scale ? "bg-purple-500 text-white border-purple-500" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"}`}
                                                >
                                                    {scale} Students
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Admission Challenge</label>
                                        <div className="space-y-3">
                                            {[
                                                "Lead Leakage (Missed calls/queries)",
                                                "Counselor Inefficiency / Turnover",
                                                "Low Lead-to-Admission Conversion",
                                                "Inability to Scale Follow-ups"
                                            ].map((challenge) => (
                                                <div
                                                    key={challenge}
                                                    onClick={() => setFormData({ ...formData, primary_admission_challenge: challenge })}
                                                    className={`cursor-pointer p-3 rounded-xl border transition-all text-sm flex items-center gap-3 ${formData.primary_admission_challenge === challenge ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"}`}
                                                >
                                                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${formData.primary_admission_challenge === challenge ? "border-emerald-500 bg-emerald-500" : "border-slate-500"}`}>
                                                        {formData.primary_admission_challenge === challenge && <div className="h-2 w-2 bg-white rounded-full" />}
                                                    </div>
                                                    {challenge}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institute Address (For Visit)</label>
                                        <Input
                                            value={formData.institute_address}
                                            onChange={(e) => setFormData({ ...formData, institute_address: e.target.value })}
                                            placeholder="Vijay Nagar, Indore..."
                                            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-amber-500/50 text-white placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Who nominated you? (Optional)</label>
                                        <Input
                                            value={formData.referral_source}
                                            onChange={(e) => setFormData({ ...formData, referral_source: e.target.value })}
                                            placeholder="Enter Ambassador Institute Name"
                                            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-amber-500/50 text-white placeholder:text-slate-600"
                                        />
                                        <p className="text-[10px] text-slate-500">Nominations fast-track the vetting process.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={step === 1 || loading}
                            className={`text-slate-400 hover:text-white ${step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                        >
                            Back
                        </Button>

                        {step < totalSteps ? (
                            <Button
                                onClick={handleNext}
                                className="bg-white text-black hover:bg-slate-200 font-bold px-8 rounded-xl"
                            >
                                Next Step
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !formData.full_name || !formData.whatsapp_number}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 rounded-xl hover:opacity-90 transition-opacity"
                            >
                                {loading ? "Securely Submitting..." : "Submit Application"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/5 w-full">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
