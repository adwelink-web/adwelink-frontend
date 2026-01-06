"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    BrainCircuit,
    MessageSquare,
    Zap,
    ChevronRight,
    Play,
    Sparkles,
    GraduationCap,
    Calculator,
    ArrowUpRight,
    XCircle,
    Clock,
    CheckCircle2,
    MessageCircle
} from "lucide-react"
import Link from "next/link"
import React from "react"
import Image from "next/image"

export default function LandingPage() {
    const [scrolled, setScrolled] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden">
            {/* 🌌 UI: Animated Background Elements (Original) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            {/* 🧭 Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="relative h-10 w-40">
                            <Image
                                src="/branding/adwelink.svg"
                                alt="Adwelink"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <Link href="#problem" className="hover:text-cyan-400 transition-colors">Why Adwelink?</Link>
                        <Link href="#workforce" className="hover:text-cyan-400 transition-colors">Our Team</Link>
                        <Link href="#comparison" className="hover:text-cyan-400 transition-colors">Difference</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">Sign In</Button>
                        </Link>
                        <Link href="/home">
                            <Button className="bg-white text-black hover:bg-cyan-50 font-semibold px-6 shadow-xl shadow-white/5 transition-all">
                                {mounted ? "Go to Home" : "Get Started"}
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 🚀 Hero Section (UI: Original | Content: V3 Hybrid) */}
            <section className="relative pt-44 pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
                        <Sparkles className="h-3 w-3" /> Accepting Pilot Institutes in Bhopal
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] lg:max-w-5xl mx-auto">
                        Don't Just Automate. <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">Hire an AI Employee.</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Meet <strong>Aditi</strong>, your new Admission Counselor. She talks like a human, remembers every student context, and works 24/7 on WhatsApp.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/dashboard">
                            <Button className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-cyan-500/20 hover:scale-105 transition-all group">
                                Hire Aditi for ₹4,999/mo <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-14 px-8 border-white/10 bg-white/5 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <Play className="h-3 w-3 fill-cyan-400 text-cyan-400" />
                            </div>
                            See Aditi In Action
                        </Button>
                    </div>

                    {/* Dashboard Preview (UI: Original - Persisted) */}
                    <div className="mt-24 relative max-w-6xl mx-auto group">
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent blur-[120px] opacity-0 group-hover:opacity-100 transition-all -z-10" />
                        <div className="rounded-[32px] border border-white/10 bg-[#0B0F19]/60 backdrop-blur-3xl p-4 shadow-2xl overflow-hidden">
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                                <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                                <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                                <div className="ml-4 h-6 w-64 bg-white/5 rounded-full" />
                            </div>
                            {/* UI Placeholder for Dashboard */}
                            <div className="w-full h-[600px] bg-[#020617] relative flex items-center justify-center border-t border-white/5">
                                <div className="text-center space-y-4">
                                    <div className="h-20 w-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-cyan-500/30 animate-pulse">
                                        <MessageSquare className="h-10 w-10 text-cyan-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Aditi is Active</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto">Handling 45 concurrent conversations...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ⚠️ The Problem Section (Content: V3 | Style: Original Cards) */}
            <section id="problem" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Why Institutes Bleed Revenue.</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Your staff is human. That is the problem. Adwelink fixes the "Human Bottleneck".</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "60% Lead Leakage", icon: XCircle, desc: "Parents inquire on WhatsApp, but counselors are busy or sleeping. Lead lost to competitor.", color: "text-red-400" },
                            { title: "Limited Availability", icon: Clock, desc: "Humans work 9 AM - 6 PM. Parents search at 9 PM. Who handles them? No one.", color: "text-orange-400" },
                            { title: "Inconsistent Tone", icon: Zap, desc: "One counselor is polite, another is rude. Your brand reputation shouldn't depend on staff mood.", color: "text-amber-400" }
                        ].map((feat, i) => (
                            <Card key={i} className="bg-white/5 border-white/5 hover:bg-white/[0.07] transition-all p-8 group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-cyan-400 to-blue-600 group-hover:h-full transition-all duration-500" />
                                <CardContent className="p-0">
                                    <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${feat.color}`}>
                                        <feat.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-white">{feat.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">{feat.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 👥 The Workforce (Content: V3 Descriptions) */}
            <section id="workforce" className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                        <div className="max-w-2xl">
                            <h2 className="text-5xl font-bold tracking-tighter mb-6">Not a Chatbot. An Employee.</h2>
                            <p className="text-slate-400 text-lg">Adwelink agents have personality, memory, and autonomy.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Agent 1: Aditi */}
                        <Card className="bg-[#0B0F19] border-white/10 overflow-hidden group shadow-2xl">
                            <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                    <div className="relative h-24 w-24">
                                        <Image src="/branding/adwelink_icon_square.svg" alt="Aditi Core" fill className="object-contain" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                    Active Now
                                </div>
                            </div>
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Aditi</h3>
                                        <p className="text-cyan-400 text-sm font-semibold">Senior Sales Counselor</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-white hidden lg:flex items-center justify-center text-black font-bold">A</div>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    "Cool Didi" personality. Friendly Hinglish tone. She creates FOMO without being pushy.
                                </p>
                                <ul className="space-y-2 mb-8">
                                    {["Infinite Memory Context", "Auto-Schedules Visits", "Follows up Forever"].map((u, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                                            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> {u}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/login">
                                    <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold">Hire Aditi</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Agent 2 & 3 (Rest retained from Original but slightly tweaked copy) */}
                        <Card className="bg-[#0B0F19]/40 border-white/5 overflow-hidden group opacity-60">
                            <div className="h-48 bg-slate-800/20 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <GraduationCap className="h-20 w-20 text-slate-600" />
                                </div>
                                <div className="absolute bottom-4 left-4 bg-blue-500/10 border border-white/5 text-blue-400 text-[10px] font-bold uppercase px-2 py-1 rounded">Q2 Launch</div>
                            </div>
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-slate-400">Ishaan</h3>
                                <p className="text-slate-500 text-sm font-semibold mb-4">Teacher Agent</p>
                                <p className="text-slate-500 text-sm mb-4">Solves student doubts using your study material instantly.</p>
                                <Button disabled className="w-full bg-transparent border border-white/5 text-slate-600">Waitlist</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0B0F19]/40 border-white/5 overflow-hidden group opacity-60">
                            <div className="h-48 bg-slate-800/20 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Calculator className="h-20 w-20 text-slate-600" />
                                </div>
                                <div className="absolute bottom-4 left-4 bg-blue-500/10 border border-white/5 text-blue-400 text-[10px] font-bold uppercase px-2 py-1 rounded">Q3 Launch</div>
                            </div>
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-slate-400">Rohan</h3>
                                <p className="text-slate-500 text-sm font-semibold mb-4">Finance Agent</p>
                                <p className="text-slate-500 text-sm mb-4">Accountant who sends polite fee reminders and tracks dues.</p>
                                <Button disabled className="w-full bg-transparent border border-white/5 text-slate-600">Waitlist</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 📊 Comparison Section (New Layout matching V3 Logic) */}
            <section id="comparison" className="py-24 px-6 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-[#0B0F19]/80 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold">The Aditi Difference</h2>
                            <p className="text-slate-400 mt-2">Why Chatbots Fail and Adwelink Succeeds.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="pb-6 text-sm font-medium text-slate-500 pl-4 w-1/3">Feature</th>
                                        <th className="pb-6 text-sm font-bold text-slate-400 w-1/3">Generic Chatbot</th>
                                        <th className="pb-6 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 w-1/3">Aditi (AI)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr>
                                        <td className="py-6 pl-4 text-slate-300 font-medium">Memory</td>
                                        <td className="py-6 text-slate-500">Zero (Session based)</td>
                                        <td className="py-6 text-white font-bold flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-cyan-400" /> Lifetime Context</td>
                                    </tr>
                                    <tr>
                                        <td className="py-6 pl-4 text-slate-300 font-medium">Tone</td>
                                        <td className="py-6 text-slate-500">Robotic / Scripted</td>
                                        <td className="py-6 text-white font-bold flex items-center gap-2"><MessageCircle className="h-4 w-4 text-cyan-400" /> "Cool Didi" Hinglish</td>
                                    </tr>
                                    <tr>
                                        <td className="py-6 pl-4 text-slate-300 font-medium">Proactive</td>
                                        <td className="py-6 text-slate-500">No (Waits for user)</td>
                                        <td className="py-6 text-white font-bold flex items-center gap-2"><Zap className="h-4 w-4 text-cyan-400" /> Follows Up Automotically</td>
                                    </tr>
                                    <tr>
                                        <td className="py-6 pl-4 text-slate-300 font-medium">Cost</td>
                                        <td className="py-6 text-slate-500">₹1,000 (Cheap & Useless)</td>
                                        <td className="py-6 text-white font-bold flex items-center gap-2"><div className="h-4 w-4 rounded-full bg-emerald-500/20" /> ₹4,999 (Revenue Generator)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🏢 Bottom CTA (Original) */}
            <section className="py-40 px-6 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full -z-10" />
                <h2 className="text-6xl font-black mb-8">Ready to Scale?</h2>
                <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto">Transform your institute with a digital workforce that never sleeps.</p>
                <Link href="/dashboard">
                    <Button className="h-16 px-12 bg-white text-black font-bold text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all">Hire Aditi Now</Button>
                </Link>
            </section>

            {/* 🏁 Footer (Original) */}
            <footer className="py-20 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-2">
                        <div className="relative h-8 w-32">
                            <Image src="/branding/adwelink_white.svg" alt="Adwelink" fill className="object-contain object-left opacity-80 hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">© 2026 Adwelink AI Workforce. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
