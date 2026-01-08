"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    BrainCircuit,
    GraduationCap,
    Wallet,
    CreditCard,
    LogOut,
    Sparkles,
    Store,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { User } from "@supabase/supabase-js"

interface SidebarProps extends React.ComponentProps<"div"> {
    user: User | null
}

export function AppSidebar({ className, user }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [activeAgent, setActiveAgent] = React.useState("Aditi")

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    React.useEffect(() => {
        const match = document.cookie.match(new RegExp('(^| )activeAgent=([^;]+)'))
        if (match) {
            setActiveAgent(match[2])
        }
    }, [])

    // Agent Switcher logic removed as per request


    // --- LOGIC: SEPARATE MENUS FOR INSTITUTE VS AGENT ---
    // If we are at root OR any Institute Page, we are in "Institute Mode".
    const isInstituteMode = pathname === "/home" ||
        pathname.startsWith("/billing") ||
        pathname.startsWith("/market") ||
        pathname.startsWith("/settings") ||
        pathname === "/";

    interface Route {
        label: string
        icon: React.ElementType
        href: string
        color: string
        title?: string
        isLive?: boolean
    }

    const instituteRoutes: Route[] = [
        {
            label: "Home",
            icon: BrainCircuit,
            href: "/home",
            color: "text-white",
        },
        {
            label: "Recruit Employees",
            icon: Store,
            href: "/market",
            color: "text-amber-400",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings",
            color: "text-slate-400",
        },
        {
            label: "Billing",
            icon: CreditCard,
            href: "/billing",
            color: "text-emerald-400",
        },
        {
            label: "Feedback",
            icon: MessageSquare,
            href: "/feedback",
            color: "text-rose-400",
        }
    ]

    const agentRoutes: Route[] = [
        {
            label: "Workspace",
            icon: LayoutDashboard,
            href: "/workspace",
            color: "text-sky-500",
            title: "AMS"
        },
        {
            label: "Leads",
            icon: Users,
            href: "/workspace/leads",
            color: "text-pink-500",
            title: "Leads"
        },
        {
            label: "Chat",
            icon: MessageSquare,
            href: "/workspace/feed",
            color: "text-violet-500",
            title: "Feed",
            isLive: true,
        },
        {
            label: "Students",
            icon: GraduationCap,
            href: "/workspace/students",
            color: "text-emerald-500",
            title: "Students"
        },
        {
            label: "Academic Catalog",
            icon: GraduationCap,
            href: "/workspace/courses",
            color: "text-orange-400",
            title: "Catalog"
        },
        {
            label: "Training",
            icon: GraduationCap,
            href: "/workspace/training",
            color: "text-emerald-500",
            title: "Training"
        },
        {
            label: "Fees",
            icon: Wallet,
            href: "/workspace/fees",
            color: "text-green-500",
            title: "Fees"
        },
        {
            label: "Agent Settings",
            icon: Settings,
            href: "/workspace/brain",
            color: "text-orange-500",
            title: "Brain"
        },
        {
            label: "Give Feedback",
            icon: MessageSquare,
            href: "/feedback",
            color: "text-rose-400",
        }
    ]

    // Define which agent routes are visible for each agent type
    const agentCapabilities: Record<string, string[]> = {
        "Aditi": ["AMS", "Leads", "Feed", "Catalog"],
        "Rahul Sir": ["AMS", "Training", "Catalog"],
        "Munim Ji": ["AMS", "Fees"]
    }

    // Select the correct list based on mode
    let displayRoutes: Route[] = []

    if (isInstituteMode) {
        displayRoutes = instituteRoutes
    } else {
        // In Agent Mode, filter based on the Active Agent's capabilities
        const allowedCapabilities = agentCapabilities[activeAgent] || []
        displayRoutes = agentRoutes.filter(route =>
            // Show if it's a generic agent route OR matches capability
            !route.title || allowedCapabilities.includes(route.title)
        )
    }

    return (
        <div className={cn("relative flex flex-col h-full bg-sidebar border-r border-white/10", className)}>

            {/* 1. Sidebar Header */}
            <div className="px-6 py-6 border-b border-white/5">
                <Link href="/home" className="flex items-center justify-center mb-6" title="Back to AMS Headquarters">
                    <div className="relative h-12 w-48">
                        <Image
                            src="/branding/adwelink.svg"
                            alt="Logo"
                            fill
                            className="object-contain object-center"
                        />
                    </div>
                </Link>

                {/* Only show Agent Switcher if NOT in Institute Mode (optional, but keeping it for quick nav) */}
                {/* User suggested distinct difference, maybe hide switcher on Root? 
                    Let's keep it but maybe visually distinct. For now, standard behavior. */}
                {/* Agent Switcher Removed as per request */}
                {/* <div className="h-4"></div> */}
            </div>

            {/* 2. Navigation Routes */}
            <ScrollArea className="flex-1 px-4 py-4">
                <div className="mb-2 px-2 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                    {isInstituteMode ? "Institute Controls" : "Workspace Tools"}
                </div>
                <div className="space-y-1">
                    {displayRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex w-full justify-start cursor-pointer hover:bg-white/5 rounded-lg transition py-3 px-3",
                                pathname === route.href ? "bg-white/10 text-white" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                <span className="text-sm font-medium group-hover:text-white transition-colors">{route.label}</span>
                                {route.isLive && (
                                    <span className="ml-auto inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </ScrollArea>

            {/* 3. Footer (Plan & Profile) */}
            <div className="mt-auto p-4 border-t border-white/5 bg-black/20">
                {/* Only show plan details in Institute Mode? Or always? Always is fine. */}
                <div className="mb-4 rounded-md bg-gradient-to-r from-amber-500/10 to-transparent p-3 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> PREMIUM PLAN
                        </span>
                        <span className="text-[10px] text-muted-foreground">24d left</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <Avatar className="h-8 w-8 border border-white/10">
                            <AvatarFallback className="bg-white/10 text-xs">
                                {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "A"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white truncate max-w-[120px]">
                                {user?.user_metadata?.first_name
                                    ? `${user.user_metadata.first_name}${user.user_metadata.last_name ? ' ' + user.user_metadata.last_name : ''}`
                                    : user?.email?.split('@')[0] || "User"}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Authorized System</span>
                        </div>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/5 hover:text-red-400"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
