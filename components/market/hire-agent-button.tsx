"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react"

interface HireAgentButtonProps {
    agentName: string
    price: string
}

export function HireAgentButton({ agentName, price }: HireAgentButtonProps) {
    const [loading, setLoading] = useState(false)
    const [hired, setHired] = useState(false)

    const handleHire = async () => {
        setLoading(true)
        // Simulate API delay for "Production Feel"
        // In real life, this would be a Server Action or Supabase Insert
        await new Promise(resolve => setTimeout(resolve, 1500))

        setLoading(false)
        setHired(true)

        toast.success(`Hiring Protocol Initiated: ${agentName}`, {
            description: `${price} has been authorized. Setup will begin shortly.`,
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
            duration: 5000,
        })
    }

    if (hired) {
        return (
            <Button size="sm" variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 cursor-default">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Request Sent
            </Button>
        )
    }

    return (
        <Button
            size="sm"
            className="bg-white text-black hover:bg-slate-200 font-semibold shadow-lg shadow-white/10"
            onClick={handleHire}
            disabled={loading}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4 text-amber-500" /> Hire Now
                </>
            )}
        </Button>
    )
}
