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
import { MessageSquare, Hand, Send, Check, CheckCheck, AlertCircle } from "lucide-react"
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
    status?: 'sent' | 'delivered' | 'read' | 'failed' | null
}

// Define the shape of a "Visual" message Bubble
type VisualMessage = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: string
    sentiment?: string
    isManual?: boolean
    status?: 'sent' | 'delivered' | 'read' | 'failed' | null
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


    const [userMap, setUserMap] = React.useState<Record<string, string>>({})

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
            )).filter(Boolean).reverse() as string[]

            setSessions(uniqueIds)

            // 1.5 Fetch User Names if we have IDs
            if (uniqueIds.length > 0) {
                const { data: leadData } = await supabase
                    .from("leads")
                    .select("name, phone")
                    .in("phone", uniqueIds)

                if (leadData) {
                    const newMap: Record<string, string> = {}
                    leadData.forEach((l: any) => {
                        if (l.phone) newMap[l.phone] = l.name
                    })
                    setUserMap(prev => ({ ...prev, ...newMap }))
                }
            }

            if (uniqueIds.length > 0 && !selectedSession) {
                setSelectedSession(uniqueIds[0])
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

    // Smart Auto-Scroll Logic - DISABLED per user request
    React.useEffect(() => {
        // if (shouldAutoScroll && scrollBottomRef.current) {
        //     scrollBottomRef.current.scrollIntoView({ behavior: "smooth" })
        // }
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
                    isManual: isManual,
                    status: row.status
                })
            }
        })

        return visual
    }

    const activeVisuals = getActiveVisualMessages()

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            <div className="px-2 md:px-4 max-w-[98%] mx-auto flex-1 flex flex-col min-h-0 pt-4 md:pt-10 pb-4">
                <div className="grid gap-6 md:grid-cols-4 flex-1 min-h-0">
                    {/* Chat List (Left Sidebar) */}
                    <Card className="col-span-1 bg-white/5 border-white/10 flex flex-col overflow-hidden hidden md:flex">
                        <CardHeader className="py-4 border-b border-white/10">
                            <CardTitle className="text-sm font-medium text-slate-200">Recent Inquiries ({sessions.length})</CardTitle>
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
                                                <span className="text-sm font-medium text-white truncate w-full">
                                                    {userMap[sessionId] || sessionId}
                                                </span>
                                                {userMap[sessionId] && <span className="text-[10px] text-muted-foreground">{sessionId}</span>}
                                                <span className="text-[10px] text-muted-foreground mt-0.5">Aditi is Active</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </Card>

                    {/* Main Conversation View */}
                    <Card className="col-span-4 md:col-span-3 bg-[#0B0F19] border-white/10 flex flex-col overflow-hidden shadow-2xl py-0 gap-0">
                        <div className="py-3 px-4 border-b border-white/10 flex flex-row items-center justify-between bg-[#111623]">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-white/10">
                                    <AvatarFallback className="bg-cyan-600 text-white font-bold">
                                        {selectedSession ? (userMap[selectedSession]?.charAt(0) || selectedSession.charAt(0)) : "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base text-white tracking-wide flex items-center gap-2">
                                        {selectedSession ? (
                                            <>
                                                <span>{userMap[selectedSession] || selectedSession}</span>
                                                {userMap[selectedSession] && <span className="text-xs text-slate-500 font-normal">{selectedSession}</span>}
                                            </>
                                        ) : "Select a Session"}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${isAiPaused ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                                        <span className="text-xs text-slate-400 font-medium">
                                            {selectedSession
                                                ? (isAiPaused ? "AI Paused" : "Aditi Active")
                                                : "Offline"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {isAiPaused && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                        onClick={handleResume}
                                    >
                                        Resume AI
                                    </Button>
                                )}
                                {activeVisuals.some(m => m.isManual) && !isAiPaused && (
                                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                                        Handover Ready
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <ScrollArea className="flex-1 min-h-0 px-4 pt-0 bg-[#0B0F19]">
                            <div className="space-y-6 py-4">
                                {activeVisuals.length === 0 && !loading && (
                                    <div className="flex h-full flex-col items-center justify-center text-slate-500 text-sm gap-2 opacity-50">
                                        <MessageSquare className="h-10 w-10" />
                                        <span>Select a session to start monitoring</span>
                                    </div>
                                )}

                                {activeVisuals.map((msg) => {
                                    const isAi = msg.role === "assistant";
                                    return (
                                        <div key={msg.id} className={`flex ${isAi ? "justify-end" : "justify-start"}`}>
                                            <div className={`flex gap-3 max-w-[85%] ${isAi ? "flex-row-reverse" : "flex-row"}`}>
                                                {!isAi && (
                                                    <Avatar className="h-8 w-8 shrink-0 mt-1">
                                                        <AvatarFallback className="bg-slate-800 text-slate-400 text-xs">U</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                {isAi && (
                                                    <Avatar className="h-8 w-8 shrink-0 mt-1 border border-purple-500/40">
                                                        <AvatarImage src="/agents/aditi-avatar.png" />
                                                        <AvatarFallback className="bg-purple-900/50 text-purple-200 text-xs">AI</AvatarFallback>
                                                    </Avatar>
                                                )}

                                                <div className={`flex flex-col ${isAi ? "items-end" : "items-start"}`}>
                                                    <div className={`py-2 px-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words max-w-full ${isAi
                                                        ? (msg.isManual
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-[#2E3545] text-slate-100 border border-white/5")
                                                        : "bg-[#1E293B] text-slate-200 border border-white/5"
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1 px-1">
                                                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                                                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                                        </span>
                                                        {isAi && msg.sentiment && (
                                                            <span className={`text-[9px] px-1 rounded-sm bg-black/20 ${msg.isManual ? "text-blue-300" : "text-purple-300"}`}>
                                                                {msg.sentiment}
                                                            </span>
                                                        )}
                                                        {isAi && (
                                                            <span className="ml-1 flex items-center">
                                                                {(() => {
                                                                    // Legacy/Null status -> Assume Read (Blue) for cleanliness of past history
                                                                    const s = msg.status || 'read';

                                                                    if (s === 'failed') return <AlertCircle className="h-3 w-3 text-red-400" />
                                                                    if (s === 'sent') return <Check className="h-3 w-3 text-slate-400" />
                                                                    if (s === 'delivered') return <CheckCheck className="h-3 w-3 text-slate-400" />
                                                                    return <CheckCheck className="h-3 w-3 text-blue-400" /> // read or default
                                                                })()}
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


                        {/* Footer: Compact & Tighter */}
                        <div className="px-3 pt-2 pb-1 bg-[#111623] border-t border-white/10 shrink-0">
                            <div className={`flex gap-3 items-center rounded-lg border px-2 py-2 transition-colors ${isAiPaused ? "bg-red-500/5 border-red-900/30" : "bg-[#0B0F19] border-white/10 focus-within:border-white/20"}`}>
                                <input
                                    className="flex-1 bg-transparent px-2 text-sm text-white focus:outline-none h-full placeholder:text-slate-600"
                                    placeholder={selectedSession ? (isAiPaused ? "AI Silent. Type your reply..." : "Type to intervene...") : "Select a chat to react..."}
                                    disabled={!selectedSession || isSending}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <Button
                                    disabled={!selectedSession || isSending || !inputText.trim()}
                                    size="sm"
                                    className={`h-8 px-4 transition-all ${isSending ? "bg-slate-600" : (isAiPaused ? "bg-red-600 hover:bg-red-700 shadow-red-900/20 shadow-lg" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20 shadow-lg")}`}
                                    onClick={handleSend}
                                >
                                    {isSending ? <span className="animate-spin text-xs">⏳</span> : <Send className="h-4 w-4" />}
                                </Button>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 mb-1 flex justify-between px-1">
                                <span>Press <b>Enter</b> to send</span>
                                {isAiPaused ? <span className="text-red-400">Manual Mode Active</span> : <span>AI Mode Active</span>}
                            </div>
                        </div>
                    </Card >
                </div>
            </div>
        </div>
    )
}
