"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles } from "lucide-react"
import { useEffect } from "react"
import Image from "next/image"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Handle Demo Mode
    useEffect(() => {
        const demo = searchParams.get("demo")
        if (demo === "sharma") {
            setEmail("sharma.demo@gmail.com")
            setPassword("sharma123")
        }
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push("/home")
            router.refresh()
        }
    }

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex items-center justify-center bg-[#0B0F19] p-4 text-white">
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
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@adwelink.com"
                                className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-purple-500/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                className="bg-black/40 border-white/10 text-white focus:border-purple-500/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-900/20"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/5 pt-4">
                    <p className="text-xs text-slate-500">
                        Authorized Personnel Only. <span className="text-purple-400 hover:underline cursor-pointer">Forgot Password?</span>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
