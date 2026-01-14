"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "./app-sidebar"
import { Menu, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import { User } from "@supabase/supabase-js"

interface SidebarWrapperProps {
    children: React.ReactNode
    user: User | null
}

export function SidebarWrapper({ children, user }: SidebarWrapperProps) {
    const [open, setOpen] = useState(false)
    const [showBetaPopup, setShowBetaPopup] = useState(false)
    const pathname = usePathname()

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        // Fix for "setState synchronously within an effect" warning
        const timer = setTimeout(() => setIsMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    // Logic: Hide sidebar on Public Landing and Login pages
    const isPublicPage = pathname === "/" || pathname?.startsWith("/login") || pathname?.startsWith("/manifesto") || pathname?.startsWith("/early-access") || pathname?.startsWith("/feedback") || pathname?.startsWith("/landing")

    useEffect(() => {
        // Show beta popup once per session/device
        const hasShown = localStorage.getItem("ams_beta_popup_shown")
        if (!hasShown && !isPublicPage) {
            // Use setTimeout to avoid synchronous state update warning during effect execution
            const timer = setTimeout(() => {
                setShowBetaPopup(true)
                localStorage.setItem("ams_beta_popup_shown", "true")
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [isPublicPage])

    useEffect(() => {
        // Close mobile sidebar on route change
        // Wrapped in setTimeout to satisfy linter
        const timer = setTimeout(() => setOpen(false), 0)
        return () => clearTimeout(timer)
    }, [pathname])

    if (isPublicPage) {
        return <main id="public-scroll-container" className="h-screen w-full overflow-y-auto">{children}</main>
    }

    return (
        <div className="flex h-screen overflow-hidden relative">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 flex-col bg-sidebar border-r border-border shrink-0">
                <AppSidebar user={user} />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden h-full">

                {/* Mobile Header */}
                <header className="flex h-16 items-center border-b border-border bg-background/50 backdrop-blur-md px-4 md:hidden shrink-0">
                    {isMounted ? (
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-4 text-foreground/80">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 border-r border-white/10 w-72 bg-[#030712]">
                                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                                <AppSidebar user={user} />
                            </SheetContent>
                        </Sheet>
                    ) : (
                        <Button variant="ghost" size="icon" className="mr-4 text-foreground/80">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    )}
                    <div className="font-semibold text-lg text-foreground">Adwelink AMS</div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-hidden bg-background relative p-0">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                    <div className="relative z-0 w-full h-full flex flex-col">
                        {/* ⚠️ Beta Warning Banner */}
                        <div className="flex-none bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center gap-2 text-[10px] md:text-xs font-medium text-amber-200/80">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                            <span>AMS is under development. You may encounter bugs; please share your feedback.</span>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col">
                            {children}
                        </div>
                    </div>

                    {/* 🎁 Beta Welcome Popup */}
                    <Dialog open={showBetaPopup} onOpenChange={setShowBetaPopup}>
                        <DialogContent className="bg-[#0B0F19] border-white/10 text-white sm:max-w-md rounded-3xl">
                            <DialogHeader>
                                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-4 mx-auto">
                                    <AlertCircle className="h-6 w-6 text-amber-500" />
                                </div>
                                <DialogTitle className="text-2xl font-bold tracking-tight text-center">Welcome to AMS Beta</DialogTitle>
                                <DialogDescription className="text-slate-400 text-center pt-2">
                                    We are currently in active development. You might encounter some bugs or incomplete features while we build the future of AI workforce.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 text-center">
                                <p className="text-sm font-medium text-slate-300 italic">
                                    &quot;Your feedback is our most valuable asset.&quot;
                                </p>
                            </div>
                            <div className="flex justify-center pb-4">
                                <Button
                                    onClick={() => setShowBetaPopup(false)}
                                    className="w-full max-w-[200px] bg-white text-black hover:bg-slate-200 font-bold h-12 rounded-xl"
                                >
                                    I Understand
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    )
}
