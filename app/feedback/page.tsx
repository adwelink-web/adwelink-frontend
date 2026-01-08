"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star, UserCircle2, Mail, Building2, MessageSquare, Sparkles, CheckCircle2, Send, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"

export default function FeedbackPage() {
    const router = useRouter()
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            alert("Please select a rating before submitting.")
            return
        }
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSubmitted(true)
        setLoading(false)
    }

    if (submitted) {
        return (
            <div className="h-screen w-full bg-[#07090D] text-white font-sans flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="relative z-10 space-y-6 max-w-sm animate-in fade-in zoom-in duration-500">
                    <div className="h-20 w-20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-violet-500/30 shadow-2xl shadow-violet-500/10">
                        <Rocket className="h-10 w-10 text-violet-400" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Thank You!</h1>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Your feedback is invaluable to us. We will use your insights to further enhance our AI workforce.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Button
                            onClick={() => router.back()}
                            className="bg-white text-black hover:bg-slate-200 font-bold px-10 h-12 rounded-2xl text-sm transition-all shadow-xl shadow-white/5"
                        >
                            Back to Workspace
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full bg-[#07090D] text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-violet-500/30">

            {/* 🌌 Premium Ambient Glows */}
            <div className="fixed top-[-10%] left-[-5%] h-[50%] w-[50%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
            <div className="fixed bottom-[-10%] right-[-5%] h-[50%] w-[50%] bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Back Button - Floating Top Left */}
            <div className="absolute top-8 left-8 z-50">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                </button>
            </div>

            <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:px-6">

                {/* 1. Left Column: Vision Content */}
                <div className="space-y-10 hidden lg:block">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-400 font-bold uppercase tracking-widest shadow-lg shadow-violet-500/5">
                        <Sparkles className="h-4 w-4" /> Feedback Portal
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-6xl font-extrabold tracking-tighter text-white leading-[1.05]">
                            Shape the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
                                Better AI Workforce.
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
                            Your insights directly influence how Adwelink agents evolve. Tell us what we should build next.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-4">
                        <div className="space-y-2">
                            <div className="h-1 w-12 bg-violet-500 rounded-full" />
                            <h4 className="text-white font-bold text-sm">Direct Entry</h4>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Foundation Access</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-1 w-12 bg-fuchsia-500 rounded-full" />
                            <h4 className="text-white font-bold text-sm">Rapid Updates</h4>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Weekly Rolling</p>
                        </div>
                    </div>
                </div>

                {/* 2. Right Column: Premium Form Card */}
                <div className="w-full max-w-lg mx-auto lg:mx-0">
                    <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border border-white/10 border-violet-500/20 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-[32px] overflow-hidden">
                        <CardContent className="p-8 md:p-10 space-y-8">
                            <div className="space-y-2 text-center lg:text-left">
                                <h2 className="text-2xl font-bold text-white tracking-tight">How was your experience?</h2>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">Share your thoughts with our team</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Interactive Rating */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 ml-1">Submit Rating</label>
                                    <div className="flex justify-between md:justify-start gap-5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onMouseEnter={() => setHoveredRating(s)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                onClick={() => setRating(s)}
                                                className={`transition-all duration-300 transform hover:scale-125 active:scale-90 ${(hoveredRating || rating) >= s ? 'text-violet-400' : 'text-slate-800'}`}
                                            >
                                                <Star className={`h-8 w-8 ${((hoveredRating || rating) >= s) ? 'fill-current drop-shadow-[0_0_12px_rgba(139,92,246,0.4)]' : 'hover:text-slate-600'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Modern Integrated Inputs */}
                                <div className="space-y-5">
                                    <div className="relative group">
                                        <Input
                                            required
                                            placeholder="Your Full Name"
                                            className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-700 h-14 rounded-2xl focus:ring-1 focus:ring-violet-500/30 text-sm pl-12 transition-all border-violet-500/10"
                                        />
                                        <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-violet-400 transition-colors" />
                                    </div>

                                    <div className="relative group">
                                        <Input
                                            required
                                            type="email"
                                            placeholder="Email Address"
                                            className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-700 h-14 rounded-2xl focus:ring-1 focus:ring-violet-500/30 text-sm pl-12 transition-all border-violet-500/10"
                                        />
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-violet-400 transition-colors" />
                                    </div>

                                    <div className="relative group">
                                        <Textarea
                                            required
                                            placeholder="Tell us, how can we improve?"
                                            className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-700 min-h-[140px] p-4 pt-4 rounded-2xl focus:ring-1 focus:ring-violet-500/30 text-sm leading-relaxed border-violet-500/10"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-white text-black hover:bg-slate-100 font-extrabold rounded-2xl shadow-2xl shadow-white/5 transition-all active:scale-[0.98] text-sm group"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 animate-spin" /> Transmitting...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Submit Feedback <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
