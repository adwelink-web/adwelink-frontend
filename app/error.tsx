"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("APP_ERR:", error)
    }, [error])

    return (
        <div className="h-screen w-full bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
            <p className="text-slate-400 mb-8 max-w-md">
                Don't worry, even AI needs a moment sometimes. We've logged this issue.
            </p>
            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 text-white gap-2"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Try Again
                </Button>
                <Button
                    onClick={() => window.location.href = '/home'}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    Return Home
                </Button>
            </div>
        </div>
    )
}
