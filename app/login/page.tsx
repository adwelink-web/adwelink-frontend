"use client"
import { useState, Suspense } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Mail, CheckCircle, ArrowRight, Lock } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-[#030712] flex items-center justify-center text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Handle Demo Mode
    const isDemo = searchParams.get("demo") === "sharma"

    // Only email state needed for Magic Link
    const [email, setEmail] = useState(isDemo ? "sharma.demo@gmail.com" : "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const supabase = createClient()

        // Magic Link (OTP) Login
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // Redirect user to home page after clicking the link
                emailRedirectTo: `${window.location.origin}/auth/callback?next=/home`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center relative overflow-hidden p-6 font-sans">
                {/* 🌌 Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                    <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-900/20 blur-[150px] rounded-full animate-pulse duration-[8000ms]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl text-center">
                        <div className="mx-auto h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                            <CheckCircle className="h-10 w-10 text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Check Email 🚀</h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            We've sent a secure magic link to <br />
                            <span className="text-white font-medium bg-white/10 px-2 py-0.5 rounded border border-white/10">{email}</span>
                        </p>
                        <p className="text-xs text-slate-500 mb-8">
                            Click the link to verify your identity. <br />You can safely close this tab.
                        </p>

                        <Button
                            variant="ghost"
                            className="text-slate-400 hover:text-white"
                            onClick={() => setSuccess(false)}
                        >
                            Use different email
                        </Button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center relative overflow-hidden p-6 font-sans selection:bg-indigo-500/30">

            {/* 🌌 Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 blur-[150px] rounded-full animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Tech Grid Background inside card */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] rounded-[32px] pointer-events-none"></div>

                <Card className="bg-[#0B0F19]/80 border-white/10 backdrop-blur-xl rounded-[32px] shadow-2xl overflow-hidden relative">

                    {/* Top Gradient Line */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                    <CardHeader className="text-center pt-10 pb-2">
                        <div className="relative h-10 w-40 mx-auto mb-4">
                            <Image
                                src="/branding/adwelink.svg"
                                alt="Adwelink"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <CardDescription className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">
                            Secure Partner Access
                        </CardDescription>

                        {searchParams.get("demo") === "sharma" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-500 font-bold uppercase tracking-widest"
                            >
                                <Sparkles className="h-3 w-3" /> Access Granted: Demo Mode
                            </motion.div>
                        )}
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Official Email ID</Label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@institute.com"
                                            className="pl-12 bg-black/40 border-white/10 h-14 rounded-xl text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-0 transition-all text-base"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-2"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-slate-200 font-bold rounded-xl h-14 shadow-lg shadow-white/5 transition-all text-base relative overflow-hidden group"
                                disabled={loading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                {loading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-slate-600" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Send Magic Link <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-white/5 py-4 bg-black/20">
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                            <Lock className="h-3 w-3" />
                            <span>128-bit Encrypted Session</span>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
