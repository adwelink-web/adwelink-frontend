"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star, UserCircle2, Mail, MessageSquare, Sparkles, Send, Rocket } from "lucide-react"
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

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('feedback')
                .insert([{
                    rating,
                    name: (e.target as any)[0].value,
                    email: (e.target as any)[1].value,
                    message: (e.target as any)[2].value
                }])

            if (error) throw error

            setSubmitted(true)
        } catch (err) {
            console.error(err)
            alert("Failed to submit feedback. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen w-full bg-[#07090D] text-white font-sans flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="relative z-10 space-y-6 max-w-sm animate-in fade-in zoom-in duration-500">
                    <div className="h-20 w-20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-violet-500/30 shadow-2xl shadow-violet-500/10">
                        <Rocket className="h-10 w-10 text-violet-400" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Thank You!</h1>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Your feedback is invaluable to us. We will use your insights to further enhance our AI workforce.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Button
                            onClick={() => router.back()}
                            className="bg-white text-black hover:bg-slate-200 font-bold px-8 md:px-10 h-11 md:h-12 rounded-xl md:rounded-2xl text-sm transition-all shadow-xl shadow-white/5"
                        >
                            Back to Workspace
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#07090D] text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-violet-500/30">

            {/* 🌌 Premium Ambient Glows */}
            <div className="fixed top-[-10%] left-[-5%] h-[50%] w-[50%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-5%] h-[50%] w-[50%] bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Back Button - Sticky Top */}
            <div className="sticky top-0 z-50 px-4 py-3 md:px-8 md:py-4 bg-[#07090D]/80 backdrop-blur-xl border-b border-white/5">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* 1. Left Column: Vision Content - Desktop Only */}
                    <div className="space-y-8 hidden lg:block">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-400 font-bold uppercase tracking-widest shadow-lg shadow-violet-500/5">
                            <Sparkles className="h-4 w-4" /> Feedback Portal
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tighter text-white leading-[1.05]">
                                Shape the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
                                    Better AI Workforce.
                                </span>
                            </h1>
                            <p className="text-slate-400 text-base lg:text-lg leading-relaxed max-w-md font-medium">
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

                    {/* 2. Right Column: Compact Form Card */}
                    <div className="w-full max-w-md mx-auto lg:mx-0">
                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-4 space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] text-violet-400 font-bold uppercase tracking-wider">
                                <Sparkles className="h-3 w-3" /> Feedback
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                Shape the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">AI Workforce</span>
                            </h1>
                            <p className="text-slate-500 text-xs">Your insights help us evolve</p>
                        </div>

                        <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border border-white/10 backdrop-blur-xl shadow-xl rounded-xl md:rounded-2xl overflow-hidden">
                            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
                                <div className="space-y-1 text-center lg:text-left">
                                    <h2 className="text-base md:text-xl font-bold text-white tracking-tight">How was your experience?</h2>
                                    <p className="text-slate-500 text-[9px] md:text-[10px] font-medium uppercase tracking-wider">Share your thoughts</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                    {/* Interactive Rating */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 ml-1">Your Rating</label>
                                        <div className="flex justify-center lg:justify-start gap-2 md:gap-3">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onMouseEnter={() => setHoveredRating(s)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    onClick={() => setRating(s)}
                                                    className={`transition-all duration-300 transform hover:scale-110 active:scale-90 ${(hoveredRating || rating) >= s ? 'text-violet-400' : 'text-slate-700'}`}
                                                >
                                                    <Star className={`h-6 w-6 md:h-7 md:w-7 ${((hoveredRating || rating) >= s) ? 'fill-current drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]' : 'hover:text-slate-600'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Compact Inputs */}
                                    <div className="space-y-3">
                                        <div className="relative group">
                                            <Input
                                                required
                                                placeholder="Your Full Name"
                                                className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 h-10 md:h-11 rounded-lg md:rounded-xl focus:ring-1 focus:ring-violet-500/30 text-xs md:text-sm pl-9 md:pl-10 transition-all"
                                            />
                                            <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-violet-400 transition-colors" />
                                        </div>

                                        <div className="relative group">
                                            <Input
                                                required
                                                type="email"
                                                placeholder="Email Address"
                                                className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 h-10 md:h-11 rounded-lg md:rounded-xl focus:ring-1 focus:ring-violet-500/30 text-xs md:text-sm pl-9 md:pl-10 transition-all"
                                            />
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-violet-400 transition-colors" />
                                        </div>

                                        <Textarea
                                            required
                                            placeholder="Tell us, how can we improve?"
                                            className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 min-h-[80px] md:min-h-[100px] p-3 rounded-lg md:rounded-xl focus:ring-1 focus:ring-violet-500/30 text-xs md:text-sm leading-relaxed resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-10 md:h-11 bg-white text-black hover:bg-slate-100 font-bold rounded-lg md:rounded-xl shadow-lg transition-all active:scale-[0.98] text-xs md:text-sm group"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Sparkles className="h-3.5 w-3.5 animate-spin" /> Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Submit <Send className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
