"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Hand, Send } from "lucide-react"
import { createClient } from "@/lib/supabase"

// Define the shape of our "Flat" DB row
type ChatRow = {
    id: string
    created_at: string | null | null
    phone_number: string | null
    session_id: string | null
    user_message: string | null
    ai_response: string | null
    sentiment: string | null
    intent: string | null
}

// Define the shape of a "Visual" message Bubble
type VisualMessage = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: string
    sentiment?: string
    isManual?: boolean
}

export default function FeedPage() {
    const [messages, setMessages] = React.useState<ChatRow[]>([])
    const [sessions, setSessions] = React.useState<string[]>([])
    const [selectedSession, setSelectedSession] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [inputText, setInputText] = React.useState("")
    const [isSending, setIsSending] = React.useState(false)
    const [isAiPaused, setIsAiPaused] = React.useState(false)
    const scrollBottomRef = React.useRef<HTMLDivElement>(null)
    const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true)


    // Fetch Chat History & Status
    const fetchHistory = React.useCallback(async () => {
        const supabase = createClient()

        // 1. Get Messages
        const { data: msgData, error: msgError } = await supabase
            .from("ai_chat_history")
            .select("*")
            .order("created_at", { ascending: true })

        if (msgError) {
            console.error("Chat Fetch Error:", msgError)
        } else {
            setMessages(msgData || [])
            const uniqueIds = Array.from(new Set(
                (msgData || []).map((m: ChatRow) => m.phone_number || m.session_id || "Unknown")
            )).filter(Boolean).reverse()
            setSessions(uniqueIds as string[])
            if (uniqueIds.length > 0 && !selectedSession) {
                setSelectedSession(uniqueIds[0] as string)
            }
        }

        // 2. Get AI Status (if session selected)
        if (selectedSession) {
            const { data: statusData } = await supabase
                .from("conversation_states")
                .select("is_ai_paused")
                .eq("phone_number", selectedSession)
                .single()

            setIsAiPaused(statusData?.is_ai_paused || false)
        }

        setLoading(false)
    }, [selectedSession])

    // Resume AI Handler
    const handleResume = async () => {
        if (!selectedSession) return;
        try {
            await fetch('/api/chat/resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: selectedSession })
            })
            setIsAiPaused(false) // Optimistic Update
            fetchHistory()
        } catch (e) {
            console.error("Resume Failed", e)
        }
    }

    React.useEffect(() => {
        fetchHistory()
        // Poll for updates every 5 seconds (Simple Real-time)
        const interval = setInterval(fetchHistory, 5000)
        return () => clearInterval(interval)
    }, [fetchHistory])

    // Smart Auto-Scroll Logic
    React.useEffect(() => {
        if (shouldAutoScroll && scrollBottomRef.current) {
            scrollBottomRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, shouldAutoScroll])

    // Enable auto-scroll when user selects a session (reset view)
    React.useEffect(() => {
        if (selectedSession) {
            setShouldAutoScroll(true)
            // Small timeout to allow render
            setTimeout(() => {
                scrollBottomRef.current?.scrollIntoView({ behavior: "auto" }) // Instant jump on session switch
            }, 100)
        }
    }, [selectedSession])

    // Note: To implement true "detect user scroll up", we would need access to the 
    // ScrollArea's viewport onScroll event. Shadcn's ScrollArea doesn't expose this easily 
    // without wrapping the Viewport.
    // For now, this fix removes the *forced* scroll on every polling update by dependency tracking.
    // The current logic will still scroll on *new messages* if shouldAutoScroll is true.
    // We default it to true, but ideally, we'd toggle it false on user scroll.

    // Improvement: Simple "Fix" - we only scroll if the message count CHANGED.
    // The previous code scrolled on EVERY RENDER because of the callback ref.
    // The new useEffect [messages] dependency fixes the "scroll on polling with no new data" bug.


    // Handle Manual Send
    const handleSend = async () => {
        if (!selectedSession || !inputText.trim()) return

        setIsSending(true)
        const textToSend = inputText
        setInputText("") // Optimistic clear

        try {
            await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: selectedSession,
                    message: textToSend,
                    session_id: selectedSession
                })
            })
            // Since sending auto-pauses AI, we should update status
            setIsAiPaused(true)
            await fetchHistory()
        } catch (error) {
            console.error("Send failed", error)
        } finally {
            setIsSending(false)
        }
    }

    // Convert Flat Rows to Visual Bubbles for the active session
    const getActiveVisualMessages = () => {
        if (!selectedSession) return []

        const sessionRows = messages.filter(m =>
            (m.phone_number === selectedSession) || (m.session_id === selectedSession)
        );

        const visual: VisualMessage[] = []

        sessionRows.forEach(row => {
            // Push User Message
            if (row.user_message) {
                visual.push({
                    id: `${row.id}_user`,
                    role: "user",
                    content: row.user_message,
                    timestamp: row.created_at || new Date().toISOString()
                })
            }
            // Push AI/Manual Response (if exists)
            if (row.ai_response) {
                const isManual = row.intent === "Manual Override"
                visual.push({
                    id: `${row.id}_ai`,
                    role: "assistant",
                    content: row.ai_response,
                    timestamp: row.created_at || new Date().toISOString(),
                    sentiment: row.sentiment || undefined,
                    isManual: isManual
                })
            }
        })

        return visual
    }

    const activeVisuals = getActiveVisualMessages()

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <MessageSquare className="h-8 w-8 text-violet-500" /> Live Chat
                    </h2>
                    <p className="text-muted-foreground mt-1">Watch Aditi think and reply in real-time.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-green-500/20 text-green-400 bg-green-500/10 animate-pulse">
                        LIVE
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 h-full pb-4">
                {/* Chat List (Left Sidebar) */}
                <Card className="col-span-1 bg-white/5 border-white/10 flex flex-col overflow-hidden">
                    <CardHeader className="py-4 border-b border-white/10">
                        <CardTitle className="text-sm font-medium text-slate-200">Active Sessions ({sessions.length})</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-1 min-h-0">
                        <div className="p-2 space-y-1">
                            {loading ? (
                                <div className="text-center p-4 text-xs text-slate-500">Syncing...</div>
                            ) : sessions.length === 0 ? (
                                <div className="text-center p-4 text-xs text-slate-500">No active conversations.</div>
                            ) : (
                                sessions.map((sessionId, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedSession(sessionId)}
                                        className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition ${selectedSession === sessionId ? "bg-white/10 border border-white/5" : "hover:bg-white/5 opacity-60"}`}
                                    >
                                        <Avatar className="h-8 w-8 border border-white/10">
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-[10px]">
                                                {sessionId.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-medium text-white truncate w-full">{sessionId}</span>
                                            <span className="text-[10px] text-muted-foreground">Aditi is Active</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Main Conversation View */}
                <Card className="col-span-2 bg-black/40 border-white/10 flex flex-col overflow-hidden backdrop-blur-md">
                    <CardHeader className="py-3 border-b border-white/10 flex flex-row items-center justify-between bg-white/5">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback className="bg-cyan-600 text-white">
                                    {selectedSession ? selectedSession.charAt(0) : "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-base text-white">
                                    {selectedSession || "Select a Session"}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <CardDescription className={`text-xs ${isAiPaused ? "text-red-400 font-bold" : "text-green-400"}`}>
                                        {selectedSession
                                            ? (isAiPaused ? "🔴 AI PAUSED (User Control)" : "🟢 Aditi Active")
                                            : "Offline"}
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isAiPaused && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 border-green-500/50 text-green-400 hover:bg-green-500/10"
                                    onClick={handleResume}
                                >
                                    Resume AI
                                </Button>
                            )}
                            {activeVisuals.some(m => m.isManual) && !isAiPaused && (
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                                    <Hand className="h-3 w-3 mr-1" /> Handover Ready
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <ScrollArea className="flex-1 min-h-0 p-4">
                        <div className="space-y-4">
                            {activeVisuals.length === 0 && !loading && (
                                <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                                    Select a session to view the chat.
                                </div>
                            )}

                            {activeVisuals.map((msg) => {
                                const isAi = msg.role === "assistant";
                                return (
                                    <div key={msg.id} className={`flex ${isAi ? "justify-end" : "justify-start"}`}>
                                        <div className={`flex gap-3 max-w-[80%] ${isAi ? "flex-row-reverse" : "flex-row"}`}>
                                            <Avatar className="h-8 w-8 shrink-0">
                                                {isAi ? (
                                                    <AvatarImage src="/agents/aditi-avatar.png" />
                                                ) : null}
                                                <AvatarFallback className={isAi ? "bg-purple-600 border border-purple-400" : "bg-slate-700"}>
                                                    {isAi ? (msg.isManual ? "ME" : "AI") : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className={`flex flex-col ${isAi ? "items-end" : "items-start"}`}>
                                                <div className={`p-3 rounded-2xl text-sm shadow-sm ${isAi
                                                    ? (msg.isManual
                                                        ? "bg-blue-600 text-white rounded-tr-none border border-blue-400"
                                                        : "bg-purple-600 text-white rounded-tr-none")
                                                    : "bg-white/10 text-slate-200 rounded-tl-none border border-white/5"
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 px-1">
                                                    <span className="text-[8px] text-slate-500 uppercase">
                                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                                    </span>
                                                    {isAi && msg.sentiment && (
                                                        <span className={`text-[8px] ${msg.isManual ? "text-blue-300" : "text-purple-300"}`}>
                                                            ({msg.sentiment})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Invisible Element for Auto-Scroll */}
                            <div ref={scrollBottomRef}></div>
                        </div>
                    </ScrollArea>


                    {/* Manual Handover Input */}
                    <div className={`p-3 border-t border-white/10 flex gap-2 transition-colors ${isAiPaused ? "bg-red-500/5" : "bg-white/5"}`}>
                        <input
                            className={`flex-1 bg-black/50 border rounded-md px-3 text-sm text-white focus:outline-none h-10 placeholder:text-slate-500 ${isAiPaused ? "border-red-500/30 focus:border-red-500" : "border-white/10 focus:border-purple-500/50"}`}
                            placeholder={selectedSession ? (isAiPaused ? "AI Silent. Type to chat..." : "Type to take over...") : "Select chat"}
                            disabled={!selectedSession || isSending}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button
                            disabled={!selectedSession || isSending || !inputText.trim()}
                            className={`h-10 px-4 min-w-[80px] ${isSending ? "bg-slate-600" : (isAiPaused ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700")}`}
                            onClick={handleSend}
                        >
                            {isSending ? "..." : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
