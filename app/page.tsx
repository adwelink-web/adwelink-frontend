"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
  Zap,
  Users,
  ChevronRight,
  Play,
  Globe,
  Lock,
  Cpu,
  Sparkles,
  GraduationCap,
  Calculator,
  ArrowUpRight
} from "lucide-react"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import Image from "next/image"

export default function LandingPage() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      {/* 🌌 Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* 🧭 Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative h-10 w-40">
              <Image
                src="/branding/adwelink.svg"
                alt="Adwelink"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="#features" className="hover:text-cyan-400 transition-colors">Platform</Link>
            <Link href="#workforce" className="hover:text-cyan-400 transition-colors">Workforce</Link>
            <Link href="#tech" className="hover:text-cyan-400 transition-colors">Architecture</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">Sign In</Button>
            </Link>
            <Link href="/home">
              <Button className="bg-white text-black hover:bg-cyan-50 font-semibold px-6 shadow-xl shadow-white/5 transition-all">
                {mounted ? "Go to Home" : "Get Started"}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
            <Sparkles className="h-3 w-3" /> The Future of workforce is here
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] lg:max-w-4xl mx-auto">
            Hire Your First <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">AI Employee.</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Deploy intelligent AI agents that handle counseling, teaching, and finances.
            Integrated with <span className="text-white font-medium">WhatsApp</span>, powered by <span className="text-white font-medium">n8n</span>,
            and secured by <span className="text-white font-medium">DaaB Architecture</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/home">
              <Button className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-cyan-500/20 hover:scale-105 transition-all group">
                {mounted ? "Launch Your Workforce" : "Start Your Workforce"} <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" className="h-14 px-8 border-white/10 bg-white/5 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Play className="h-3 w-3 fill-cyan-400 text-cyan-400" />
              </div>
              See Aditi in Action
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-24 relative max-w-6xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent blur-[120px] opacity-0 group-hover:opacity-100 transition-all -z-10" />
            <div className="rounded-[32px] border border-white/10 bg-[#0B0F19]/60 backdrop-blur-3xl p-4 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                <div className="ml-4 h-6 w-64 bg-white/5 rounded-full" />
              </div>
              {/* UI Placeholder for Dashboard */}
              <div className="w-full h-[600px] bg-[#020617] relative flex items-center justify-center border-t border-white/5">
                <div className="text-center space-y-4">
                  <div className="h-20 w-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-cyan-500/30 animate-pulse">
                    <MessageSquare className="h-10 w-10 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Aditi's Workspace</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">Live Lead Nurturing & Admission Management</p>
                </div>
                {/* Decorative UI Lines */}
                <div className="absolute left-10 top-10 h-2 w-32 bg-white/10 rounded-full" />
                <div className="absolute left-10 top-20 h-2 w-48 bg-white/5 rounded-full" />
                <div className="absolute right-10 bottom-10 h-12 w-12 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛠️ Operational Excellence Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Enterprise Reliability for Institutes.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built on the same technology used by Fortune 500 companies. Secure, private, and always online.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Bank-Grade Security", icon: ShieldCheck, desc: "Your student data is encrypted and isolated. Only you have the key.", color: "text-cyan-400" },
              { title: "Zero Downtime Logic", icon: Zap, desc: "Our automation engine handles thousands of queries simultaneously without crashing.", color: "text-amber-400" },
              { title: "Ownership Guarantee", icon: Lock, desc: "You own your data. We never sell, share, or market to your students.", color: "text-blue-400" }
            ].map((feat, i) => (
              <Card key={i} className="bg-white/5 border-white/5 hover:bg-white/[0.07] transition-all p-8 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-cyan-400 to-blue-600 group-hover:h-full transition-all duration-500" />
                <CardContent className="p-0">
                  <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${feat.color}`}>
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{feat.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{feat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 The Workforce (Agents) */}
      <section id="workforce" className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 text-balance">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-bold tracking-tighter mb-6">Deploy Your Team in Seconds.</h2>
              <p className="text-slate-400 text-lg">Adwelink agents are ready-to-work professionals. No training required, just activation.</p>
            </div>
            <Button className="h-14 px-8 bg-white text-black font-bold rounded-2xl hover:bg-slate-200">Recruit Agent <ArrowUpRight className="ml-2 h-5 w-5" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Agent 1: Aditi */}
            <Card className="bg-[#0B0F19] border-white/10 overflow-hidden group shadow-2xl">
              <div className="h-48 bg-gradient-to-br from-purple-500/20 to-blue-600/20 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="relative h-24 w-24">
                    <Image
                      src="/branding/adwelink_icon_square.svg"
                      alt="Aditi Core"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Active Now
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Aditi</h3>
                    <p className="text-purple-400 text-sm font-semibold">Senior Sales Counselor</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white hidden lg:flex items-center justify-center text-black font-bold">A</div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Automates lead nurturing on WhatsApp, answers complex admission queries, and books consultations 24/7.</p>
                <ul className="space-y-2 mb-8">
                  {["WhatsApp Integration", "DaaB Brain Support", "Real-time CRM Sync"].map((u, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Zap className="h-3 w-3 text-cyan-400" /> {u}
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold">View Workspace</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Agent 2: Teacher (Coming Soon) */}
            <Card className="bg-[#0B0F19]/40 border-white/5 overflow-hidden group opacity-60">
              <div className="h-48 bg-slate-800/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="h-20 w-20 text-slate-600 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-blue-500/10 border border-white/5 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  Roadmap Q2
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-400">Ishaan</h3>
                    <p className="text-slate-500 text-sm font-semibold">AI Teacher Agent</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">Personalized learning paths, homework automation, and instant doubt solving via Knowledge Base sync.</p>
                <Button disabled className="w-full bg-transparent border border-white/5 text-slate-600 cursor-not-allowed">Coming Soon</Button>
              </CardContent>
            </Card>

            {/* Agent 3: Accountant (Coming Soon) */}
            <Card className="bg-[#0B0F19]/40 border-white/5 overflow-hidden group opacity-60">
              <div className="h-48 bg-slate-800/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Calculator className="h-20 w-20 text-slate-600 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-blue-500/10 border border-white/5 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  Roadmap Q3
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-400">Rohan</h3>
                    <p className="text-slate-500 text-sm font-semibold">Financial Specialist</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">Automated fee reminders, payment reconciliation, and GST-compliant invoicing without human touch.</p>
                <Button disabled className="w-full bg-transparent border border-white/5 text-slate-600 cursor-not-allowed">Coming Soon</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 🏢 Bottom CTA */}
      <section className="py-40 px-6 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full -z-10" />
        <h2 className="text-6xl font-black mb-8">Ready to Scale?</h2>
        <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto">Transform your institute with a digital workforce that never sleeps, never errors, and always scales.</p>
        <Link href="/home">
          <Button className="h-16 px-12 bg-white text-black font-bold text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all">Launch Your AMS Now</Button>
        </Link>
      </section>

      {/* 🏁 Footer */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-32">
              <Image
                src="/branding/adwelink_white.svg"
                alt="Adwelink"
                fill
                className="object-contain object-left opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Adwelink AI Workforce. All rights reserved.</p>
          <div className="flex gap-6 text-slate-400 text-sm font-medium">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="https://twitter.com/adwelink" className="hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
