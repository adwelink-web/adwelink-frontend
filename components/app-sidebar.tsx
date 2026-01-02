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
    ShieldCheck,
    ChevronDown,
    LogOut,
    Sparkles
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

// Restoring interface to satisfy Shadcn/React types
interface SidebarProps extends React.ComponentProps<"div"> { }

export function AppSidebar({ className, ...props }: SidebarProps) {
    const pathname = usePathname()
    const [activeAgent, setActiveAgent] = React.useState("Aditi")

    const routes = [
        {
            label: "Mission Control",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
            category: "global"
        },
        {
            label: "Live Neural Feed",
            icon: MessageSquare,
            href: "/dashboard/feed",
            color: "text-violet-500",
            title: "Feed",
            isLive: true,
        },
        {
            label: "Lead Pipeline",
            icon: Users,
            href: "/dashboard/leads",
            color: "text-pink-500",
            title: "Leads"
        },
        {
            label: "Brain Configuration",
            icon: BrainCircuit,
            href: "/dashboard/brain",
            color: "text-orange-500",
            title: "Brain"
        },
        {
            label: "Knowledge Base",
            icon: GraduationCap,
            href: "/dashboard/training",
            color: "text-emerald-500",
            title: "Training"
        },
        {
            label: "Fee Collection",
            icon: Wallet,
            href: "/dashboard/fees",
            color: "text-green-500",
            title: "Fees"
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
            category: "global"
        },
    ]

    // Define which routes are visible for each agent context
    const agentMenus: Record<string, string[]> = {
        "Aditi": ["Feed", "Leads", "Brain", "Training"],
        "Rahul Sir": ["Brain", "Training"],
        "Munim Ji": ["Fees"]
    }

    const filteredRoutes = routes.filter(route => {
        // Always show Global routes
        if (route.category === "global") return true

        // Show route only if allowed for current agent
        const allowedRoutes = agentMenus[activeAgent] || []
        return route.title && allowedRoutes.includes(route.title)
    })

    return (
        <div className={cn("relative flex flex-col h-full bg-sidebar border-r border-white/10", className)}>

            {/* 1. Sidebar Header (Brand + Agent Selector) */}
            <div className="px-6 py-6 border-b border-white/5">
                <Link href="/dashboard" className="flex items-center pl-2 mb-6">
                    <div className="relative h-8 w-32 mr-2">
                        <Image
                            src="/adwelink_white.svg"
                            alt="Logo"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                </Link>

                {/* Agent Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between border-white/10 bg-white/5 hover:bg-white/10 text-white">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 border border-white/20">
                                    <AvatarImage src="/agents/aditi-avatar.png" />
                                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-[10px]">AI</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs font-semibold">{activeAgent}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sales Agent</span>
                                </div>
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] bg-[#111625] border-white/10 text-white">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Agent</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setActiveAgent("Aditi")} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                            <BrainCircuit className="mr-2 h-4 w-4 text-purple-500" />
                            Aditi (Sales)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveAgent("Rahul Sir")} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                            <GraduationCap className="mr-2 h-4 w-4 text-emerald-500" />
                            Rahul Sir (Tutor)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="cursor-pointer hover:bg-white/5 text-muted-foreground">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Manage Agents
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 2. Navigation Routes */}
            <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-1">
                    {filteredRoutes.map((route) => (
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

                {/* Subscription Badge */}
                <div className="mb-4 rounded-md bg-gradient-to-r from-amber-500/10 to-transparent p-3 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> PREMIUM PLAN
                        </span>
                        <span className="text-[10px] text-muted-foreground">24d left</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[80%] rounded-full" />
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <Avatar className="h-8 w-8 border border-white/10">
                            <AvatarFallback className="bg-white/10 text-xs">KD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white">Kashi Das</span>
                            <span className="text-[10px] text-muted-foreground">Admin</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 hover:text-red-400">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
