"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BrainCircuit, GraduationCap, Wallet, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
// We will use a server action or simple cookie handling. For client simplicity, we can set cookie via JS first.

export default function SelectAgentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const agents = [
    {
      id: "Aditi",
      name: "Aditi",
      role: "Counselor Agent",
      desc: "Manages Leads, Sales, and Inquiries.",
      icon: BrainCircuit,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/50"
    },
    {
      id: "Rahul Sir",
      name: "Rahul Sir",
      role: "Teacher Agent",
      desc: "Manages Classes, Exams, and Documents.",
      icon: GraduationCap,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/50"
    },
    {
      id: "Munim Ji",
      name: "Munim Ji",
      role: "Accountant Agent",
      desc: "Manages Fees, Invoices, and Payments.",
      icon: Wallet,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/50"
    }
  ]

  const handleSelect = (agentId: string) => {
    setLoading(agentId)
    // Set Cookie for Persistence (Expires in 7 days)
    document.cookie = `activeAgent=${agentId}; path=/; max-age=604800`

    // Simulate loading for effect
    setTimeout(() => {
      router.push("/dashboard")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Global Header */}
      <div className="absolute top-6 right-6 z-20">
        <Link href="/dashboard/settings">
          <Button variant="outline" className="border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10">
            Manage Institute (Global)
          </Button>
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl w-full space-y-8 text-center">

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">Select Your AI Employee</h1>
          <p className="text-slate-400 text-lg">Who do you want to work with today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              onClick={() => handleSelect(agent.id)}
              className={`group cursor-pointer bg-white/5 border-white/10 transition-all duration-300 transform hover:-translate-y-2 ${agent.border} relative overflow-hidden`}
            >
              {/* Hover Glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-white/5 to-transparent pointer-events-none`} />

              <CardHeader className="text-center pb-2">
                <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${agent.bg} ${agent.color} ring-1 ring-white/10 group-hover:ring-white/30 transition-all`}>
                  <agent.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-white">{agent.name}</CardTitle>
                <CardDescription className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">{agent.role}</CardDescription>
              </CardHeader>

              <CardContent className="text-center space-y-4">
                <p className="text-sm text-slate-400 leading-relaxed">
                  {agent.desc}
                </p>
                <Button
                  disabled={loading !== null}
                  variant="ghost"
                  className={`w-full group-hover:bg-white/10 text-slate-300 group-hover:text-white transition-colors`}
                >
                  {loading === agent.id ? "Initializing..." : "Select Workspace"}
                  {loading === agent.id ? null : <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />}
                </Button>
              </CardContent>

              {/* Active Indicator (Fake Check) */}
              {loading === agent.id && (
                <div className="absolute top-4 right-4 text-emerald-500 animate-in fade-in zoom-in">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <p className="text-xs text-slate-600 mt-12">
          Access Control: <span className="text-slate-500">Admin (Kashi Das)</span> •
          System Status: <span className="text-emerald-500">Operational</span>
        </p>
      </div>
    </div>
  )
}
