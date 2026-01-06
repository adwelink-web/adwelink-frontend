"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, Send, Star } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { createClient } from "@/lib/supabase"

export default function FeedbackPage() {
    const [rating, setRating] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    React.useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            setIsLoggedIn(!!user)
        }
        checkUser()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        // Logic to send to database/n8n would go here
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                    <Send className="h-10 w-10 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
                <p className="text-slate-400 max-w-md mb-8">
                    Your feedback has been sent directly to our Founder. We read every single message.
                </p>
                <Link href={isLoggedIn ? "/home" : "/"}>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                        Back to Home
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 relative selection:bg-cyan-500/30">

            {/* 🌌 Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            <div className="w-full max-w-lg relative z-10">

                <Link href={isLoggedIn ? "/home" : "/"} className="inline-flex items-center text-slate-500 hover:text-white mb-8 transition-colors text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Cancel & Return
                </Link>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-4">Shape Aditi's Future.</h1>
                    <p className="text-slate-400">
                        Adwelink is built for you. Tell us what features you need, what you hate about chatbots, or just say hi.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Rating */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">How excited are you for launch?</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`p-2 transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-slate-700'}`}
                                >
                                    <Star className="h-8 w-8 fill-current" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Name (Optional)</label>
                                <Input placeholder="Your Name" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Email Address</label>
                                <Input required type="email" placeholder="email@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Institute (Optional)</label>
                                <Input placeholder="Institute Name" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Your Feedback</label>
                            <Textarea
                                required
                                placeholder="I wish an AI employee could..."
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 min-h-[150px] resize-none p-4"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-white text-black hover:bg-slate-200 font-bold text-lg">
                        Send Feedback
                    </Button>

                </form>

            </div>
        </div>
    )
}
