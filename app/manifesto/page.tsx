"use client"

import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Bot,
    BrainCircuit,
    MessageSquare,
    Zap,
    Quote,
    Lock
} from "lucide-react"
import Link from "next/link"
import React from "react"
import Image from "next/image"

export default function ManifestoPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">

            {/* 🌌 Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 blur-[150px] rounded-full" />
            </div>

            {/* 🧭 Navbar */}
            <nav className="w-full max-w-6xl mx-auto px-6 py-6 md:py-8 flex items-center gap-4 relative z-20">
                <Link href="/" className="hover:opacity-70 transition-opacity">
                    <Button variant="ghost" className="text-slate-400 pl-0 hover:text-white hover:bg-transparent text-xs">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hype
                    </Button>
                </Link>
            </nav>

            {/* 📜 Content */}
            <main className="w-full max-w-6xl mx-auto px-6 pb-20 relative z-10">

                {/* Section 1: Hero Split (Text Left, Visual Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">

                    {/* Left: Text */}
                    <div className="text-center lg:text-left">
                        <span className="text-cyan-400 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">The Vision</span>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Why we are building <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Humanoids, not Bots.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            The &quot;Chatbot Era&quot; failed us. Institutes need empathy, not scripts. They need memory, not sessions. They need an Employee.
                        </p>
                    </div>

                    {/* Right: Visual (Holographic Card) */}
                    <div className="flex justify-center lg:justify-end animate-in fade-in zoom-in duration-1000 delay-300">
                        <div className="relative w-full max-w-sm aspect-[3/4] md:aspect-square perspective-1000 group">
                            {/* Glow behind */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700" />

                            {/* The Glass Card */}
                            <div className="relative w-full h-full bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[40px] backdrop-blur-2xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-700 group-hover:rotate-y-12 bg-black/40">

                                {/* Card Header */}
                                <div className="flex justify-start">
                                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                                        <Image src="/branding/adwelink_icon_square.svg" alt="Aditi" fill className="object-cover" />
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div>
                                    <h3 className="text-3xl font-bold mb-2">Aditi (Humanoid)</h3>
                                    <p className="text-cyan-400 text-sm mb-6 font-mono tracking-wider">HUMANOID SALES AGENT</p>

                                    {/* Specs */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs py-2 border-b border-white/10">
                                            <span className="text-slate-500">Availability</span>
                                            <span className="text-emerald-400 font-mono">24/7/365</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs py-2 border-b border-white/10">
                                            <span className="text-slate-500">Memory</span>
                                            <span className="text-cyan-400 font-mono">Infinite</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs py-2 border-b border-white/10">
                                            <span className="text-slate-500">Launch</span>
                                            <span className="text-white font-mono">15.01.26</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer: Locked Line */}
                                <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 bg-white/5 p-3 rounded-lg border border-white/5">
                                    <Lock className="h-3 w-3" />
                                    <span>Restricted Access. Pilot Only.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ⚖️ Comparison Section (Moved from Home) */}
                <section className="mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">

                        {/* Left: Chatbot (Old) */}
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-left">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center">
                                    <Bot className="h-6 w-6 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-300">Generic Chatbot</h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">OBSOLETE TECHNOLOGY</p>
                                </div>
                            </div>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="h-6 w-px bg-red-500/20 mx-2" />
                                    <div>
                                        <strong className="block text-slate-400 text-sm mb-1">Session Memory</strong>
                                        <p className="text-slate-600 text-xs">Forgets the student the moment tab closes.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="h-6 w-px bg-red-500/20 mx-2" />
                                    <div>
                                        <strong className="block text-slate-400 text-sm mb-1">Robotic Tone</strong>
                                        <p className="text-slate-600 text-xs">&quot;Press 1 for Fees&quot;. Feels fake and cold.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="h-6 w-px bg-red-500/20 mx-2" />
                                    <div>
                                        <strong className="block text-slate-400 text-sm mb-1">Reactive</strong>
                                        <p className="text-slate-600 text-xs">Waits for user to ask. Never follows up.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Right: Humanoid (New) */}
                        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-cyan-950/20 to-black border border-cyan-500/20 text-left relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                    <BrainCircuit className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Adwelink Humanoid</h3>
                                    <p className="text-[10px] text-cyan-400 uppercase tracking-widest">NEXT GEN EMPLOYEES</p>
                                </div>
                            </div>
                            <ul className="space-y-6 px-1">
                                <li className="flex gap-4">
                                    <div className="h-6 w-px bg-cyan-500 mx-1 shadow-[0_0_10px_cyan]" />
                                    <div>
                                        <strong className="block text-white text-[13px] mb-1">Lifetime Memory</strong>
                                        <p className="text-slate-400 text-[11px] leading-relaxed">Remembers talks from 6 months ago. Just like a human.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="h-6 w-px bg-cyan-500 mx-1 shadow-[0_0_10px_cyan]" />
                                    <div>
                                        <strong className="block text-white text-[13px] mb-1">Emotional Intelligence</strong>
                                        <p className="text-slate-400 text-[11px] leading-relaxed">Uses &quot;Hinglish&quot;, empathy, and slang. Connects.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="h-6 w-px bg-cyan-500 mx-1 shadow-[0_0_10px_cyan]" />
                                    <div>
                                        <strong className="block text-white text-[13px] mb-1">Proactive Agent</strong>
                                        <p className="text-slate-400 text-[11px] leading-relaxed">Chases leads, schedules calls, and closes deals automatically.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Founder Note */}
                <div className="border-t border-white/10 pt-16 md:pt-20">
                    <Quote className="h-8 w-8 text-cyan-500 mb-6 opacity-50" />
                    <p className="text-xl md:text-3xl text-white font-light leading-snug mb-8">
                        &quot;We didn&apos;t just want to build software. We wanted to build a colleague. Someone who cares about your admissions as much as you do.&quot;
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white rounded-full overflow-hidden relative">
                            {/* Placeholder for Founder Image if available, else logo */}
                            <Image src="/branding/adwelink_icon_square.svg" alt="Founder" fill className="object-cover" />
                        </div>
                        <div>
                            <div className="text-white font-bold">Kashi Das Mongre</div>
                            <div className="text-slate-500 text-sm">Founder, Adwelink</div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
