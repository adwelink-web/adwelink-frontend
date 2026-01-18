"use client"
import { useState, Suspense } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Mail, CheckCircle, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-[#0B0F19] flex items-center justify-center text-white">Loading...</div>}>
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
            <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex items-center justify-center bg-background p-4 text-white">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />

                <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-md relative z-10">
                    <CardHeader className="text-center">
                        <div className="mx-auto h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/50">
                            <CheckCircle className="h-10 w-10 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Check Your Email 🚀</h2>
                        <CardDescription className="text-slate-400 text-base">
                            We've sent a magic link to <span className="text-white font-medium">{email}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-center text-slate-500">
                            Click the link in the email to sign in instantly. You can close this tab now.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-white/5 pt-6">
                        <Button
                            variant="ghost"
                            className="text-slate-400 hover:text-white"
                            onClick={() => setSuccess(false)}
                        >
                            Try different email
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex items-center justify-center bg-background p-4 text-white">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

            <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-md relative z-10">
                <CardHeader className="space-y-4 text-center">
                    <div className="relative h-12 w-48 mx-auto">
                        <Image
                            src="/branding/adwelink.svg"
                            alt="Adwelink"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <CardDescription className="text-slate-400">
                        Agent Management System
                    </CardDescription>

                    {searchParams.get("demo") === "sharma" && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-500 font-bold uppercase tracking-widest animate-pulse">
                            <Sparkles className="h-3 w-3" /> Access Granted: Sharma Classes Demo
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@adwelink.com"
                                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-purple-500/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-900/20 h-11"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex items-center">
                                    Send Magic Link <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/5 pt-4">
                    <p className="text-xs text-slate-500 text-center">
                        Secure passwordless access.<br />
                        Authorized Personnel Only.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
