"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"


import { MessageSquare, Hand, Send, Check, CheckCheck, Users, Sparkles, Search, Smile, ThumbsDown, ChevronDown, Plus, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase"

// Define the shape of our "Flat" DB row
type ChatRow = {
    id: string
    created_at: string | null
    phone_number: string | null
    session_id: string | null
    user_message: string | null
    ai_response: string | null
    sentiment: string | null
    intent: string | null
    status?: 'sent' | 'delivered' | 'read' | 'failed' | null
    message_meta?: Record<string, unknown> | null
    is_read?: boolean
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
    mediaUrl?: string
}



// Helper to format date separators like WhatsApp
const formatDateDivider = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString([], {
        day: 'numeric',
        month: 'long',
        year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
};

export default function FeedPage() {
    const [messages, setMessages] = React.useState<ChatRow[]>([])
    const [sessions, setSessions] = React.useState<string[]>([])
    const [selectedSession, setSelectedSession] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [inputText, setInputText] = React.useState("")
    const [isSending, setIsSending] = React.useState(false)
    const [isAiPaused, setIsAiPaused] = React.useState(false)
    const [sessionSearch, setSessionSearch] = React.useState("")
    const scrollBottomRef = React.useRef<HTMLDivElement>(null)
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)
    const [showScrollButton, setShowScrollButton] = React.useState(false)


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
            console.error("Chat Fetch Error Detailed:", JSON.stringify(msgError, null, 2))
        } else {
            setMessages((msgData as any) || [])

            // 1. Group by phone_number primarily (prevents duplicates for same person with multiple sessions)
            // Only use session_id as fallback when phone_number is empty
            const sessionMap: Record<string, string> = {}
            msgData?.forEach((m: any) => {
                // Prefer phone_number, only fallback to session_id if phone is truly empty
                const sid = (m.phone_number && m.phone_number.trim() !== "")
                    ? m.phone_number
                    : (m.session_id || "Unknown")
                const mTime = m.created_at || "0"
                if (!sessionMap[sid] || mTime > sessionMap[sid]) {
                    sessionMap[sid] = mTime
                }
            })

            // 2. Sort sessions by latest activity
            const sortedIds = Object.keys(sessionMap).sort((a, b) => {
                return sessionMap[b].localeCompare(sessionMap[a])
            })

            setSessions(sortedIds)

            // 1.5 Fetch User Names if we have IDs
            if (sortedIds.length > 0) {
                const { data: leadData } = await supabase
                    .from("leads")
                    .select("name, phone")
                    .in("phone", sortedIds)

                if (leadData) {
                    const newMap: Record<string, string> = {}
                    leadData.forEach((l: { phone: string | null; name: string | null }) => {
                        if (l.phone && l.name) newMap[l.phone] = l.name
                    })
                    setUserMap(prev => ({ ...prev, ...newMap }))
                }
            }

            if (sortedIds.length > 0 && !selectedSession) {
                setSelectedSession(sortedIds[0])
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

    // Mark Messages as Read
    const markAsRead = React.useCallback(async (sessionId: string) => {
        const supabase = createClient()

        // Smarter Filter: Don't compare phone numbers to UUID columns (prevents 22P02 error)
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId);

        let query = supabase
            .from("ai_chat_history")
            .update({
                is_read: true,
                updated_at: new Date().toISOString()
            } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
            .eq("is_read", false);

        if (isUuid) {
            query = query.or(`phone_number.eq.${sessionId},session_id.eq.${sessionId}`);
        } else {
            query = query.eq("phone_number", sessionId);
        }

        const { error } = await query;

        if (!error) {
            fetchHistory()
        } else {
            console.error("MarkAsRead Error:", {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
        }
    }, [fetchHistory])

    React.useEffect(() => {
        fetchHistory()
        // Poll for updates every 5 seconds (Simple Real-time)
        const interval = setInterval(fetchHistory, 5000)
        return () => clearInterval(interval)
    }, [fetchHistory])

    // When session changes, mark as read
    React.useEffect(() => {
        if (selectedSession) {
            markAsRead(selectedSession)
        }
    }, [selectedSession, markAsRead])

    const scrollToBottom = () => {
        scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Smart Auto-Scroll Logic - DISABLED per user request
    React.useEffect(() => {
        // if (scrollBottomRef.current) {
        //     scrollBottomRef.current.scrollIntoView({ behavior: "smooth" })
        // }
    }, [messages])

    // Enable auto-scroll when user selects a session (reset view)
    React.useEffect(() => {
        if (selectedSession) {
            setTimeout(scrollToBottom, 100)
        }
    }, [selectedSession])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100
        setShowScrollButton(!isAtBottom)
    }

    // Handle Manual Send
    const handleSend = async () => {
        if (!selectedSession || !inputText.trim()) return

        setIsSending(true)
        const textToSend = inputText
        setInputText("") // Optimistic clear

        try {
            console.log("Sending message to:", selectedSession)
            const res = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: selectedSession,
                    message: textToSend,
                    session_id: selectedSession
                })
            })

            const data = await res.json()
            console.log("Send API Response:", data)

            if (!res.ok) {
                console.error("Send Failed:", data)
                alert(`Message failed: ${data.error || "Unknown Error"}`)
                // Revert text if failed (optional, but good UX)
                setInputText(textToSend)
            } else {
                // Since sending auto-pauses AI, we should update status
                setIsAiPaused(true)
                await fetchHistory()
            }
        } catch (error) {
            console.error("Send Network Error", error)
            alert("Network Error: Could not reach server.")
            setInputText(textToSend)
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
                    timestamp: row.created_at || new Date().toISOString(),
                    status: row.status,
                    mediaUrl: (row.message_meta as any)?.media_url || (row.message_meta as any)?.image_url // eslint-disable-line @typescript-eslint/no-explicit-any
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
                    status: row.status,
                    mediaUrl: (row.message_meta as any)?.media_url || (row.message_meta as any)?.image_url // eslint-disable-line @typescript-eslint/no-explicit-any
                })
            }
        })

        return visual
    }

    const activeVisuals = getActiveVisualMessages()

    return (
        <div className="h-full w-full flex flex-col overflow-hidden bg-transparent">

            {/* Fixed Header Section (Standardized) */}
            <div className="flex-none px-4 md:px-8 pt-10 pb-6 bg-transparent space-y-4 relative z-20">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            <MessageSquare className="h-6 w-6 text-violet-500" />
                            Live Chat Feed
                        </h2>
                        <p className="text-muted-foreground mt-1 text-xs md:text-sm">Monitor and intervene in Aditi&apos;s conversations.</p>
                    </div>
                </div>
            </div>

            {/* Content Section - Main Chat Interface */}
            <div className="w-full px-4 md:px-8 pb-4 h-[calc(100vh-140px)]">
                {/* The "Card" Container */}
                <div className="w-full h-full bg-[#0F131E] border border-white/10 rounded-xl overflow-hidden flex relative shadow-2xl">

                    {/* 1. SIDEBAR (Left) - Fixed Width Flex Item */}
                    <div className="hidden md:flex flex-col w-[300px] shrink-0 border-r border-white/10 bg-[#0B0F19] h-full relative z-10">
                        {/* Sidebar Header + Search */}
                        <div className="flex flex-col border-b border-white/10 bg-[#111623] shrink-0 shadow-sm relative z-20">
                            <div className="h-16 flex items-center px-5 justify-between">
                                <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
                                    <Users className="h-4 w-4 text-violet-400" /> Inquiries <span className="text-violet-200/50">({sessions.length})</span>
                                </h2>
                            </div>
                            <div className="px-4 pb-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                                        placeholder="Search by name or phone..."
                                        value={sessionSearch}
                                        onChange={(e) => setSessionSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 w-full overflow-y-auto custom-scrollbar">
                            <div className="p-0">
                                {loading ? (
                                    <div className="text-center p-8 text-xs text-slate-500">Syncing...</div>
                                ) : sessions.length === 0 ? (
                                    <div className="text-center p-8 text-xs text-slate-500">No active chats.</div>
                                ) : (
                                    sessions
                                        .filter(sid => {
                                            const name = (userMap[sid] || "").toLowerCase();
                                            const phone = sid.toLowerCase();
                                            const search = sessionSearch.toLowerCase();
                                            return name.includes(search) || phone.includes(search);
                                        })
                                        .map((sessionId, i) => {
                                            // Get latest sentiment for this session
                                            const sessionMsgs = messages.filter(m => m.phone_number === sessionId || m.session_id === sessionId);
                                            const latestMsg = sessionMsgs[sessionMsgs.length - 1];
                                            const sentiment = latestMsg?.sentiment?.toLowerCase();
                                            // Real functional unread logic
                                            const isUnread = sessionMsgs.some(m => m.user_message && !m.is_read);

                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => setSelectedSession(sessionId)}
                                                    className={`flex items-center gap-3 p-4 border-b border-white/5 cursor-pointer transition-all ${selectedSession === sessionId ? "bg-white/10 border-l-2 border-l-violet-500" : "hover:bg-white/[0.05] border-l-2 border-l-transparent"}`}
                                                >
                                                    <div className="relative shrink-0">
                                                        <Avatar className="h-10 w-10 border border-white/10">
                                                            <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 text-xs font-bold">
                                                                {(userMap[sessionId] || sessionId).charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {/* Sentiment Indicator (Keep it small and clean on avatar) */}
                                                        {sentiment && (
                                                            <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0B0F19] flex items-center justify-center
                                                                ${sentiment === 'positive' ? 'bg-emerald-500' : sentiment === 'negative' ? 'bg-red-500' : 'bg-slate-500'}`}>
                                                                {sentiment === 'positive' ? <Smile className="h-2 w-2 text-white" /> : sentiment === 'negative' ? <ThumbsDown className="h-2 w-2 text-white" /> : null}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col overflow-hidden gap-0.5 flex-1 text-left">
                                                        <div className="flex justify-between items-center w-full">
                                                            <span className={`text-sm tracking-tight ${selectedSession === sessionId ? "text-white font-semibold" : isUnread ? "text-white font-bold" : "text-slate-300 font-medium"} truncate`}>
                                                                {userMap[sessionId] || sessionId}
                                                            </span>
                                                            {latestMsg?.created_at && (
                                                                <span className={`text-[10px] ${isUnread ? "text-emerald-500 font-bold" : "text-slate-500"}`}>
                                                                    {new Date(latestMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-between items-center w-full gap-2">
                                                            <span className={`text-[11px] truncate flex-1 ${isUnread ? "text-slate-200 font-semibold" : "text-slate-500"}`}>
                                                                {latestMsg?.user_message || latestMsg?.ai_response || "No messages"}
                                                            </span>
                                                            {/* WhatsApp Style Unread Badge */}
                                                            {isUnread && (
                                                                <div className="min-w-[18px] h-[18px] bg-emerald-500 rounded-full flex items-center justify-center px-1">
                                                                    <span className="text-[10px] text-white font-bold leading-none">
                                                                        {sessionMsgs.filter(m => m.user_message && !m.is_read).length}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. MAIN CHAT AREA (Right) */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[#0F131E] h-full relative">
                        {/* Floating Chat Header - Glassmorphism */}
                        <div className="absolute top-0 left-0 right-0 h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0F131E]/60 backdrop-blur-lg shrink-0 z-30 shadow-sm">
                            <div className="flex items-center gap-4">
                                {selectedSession ? (
                                    <>
                                        <div className="relative">
                                            <Avatar className="h-9 w-9 border border-white/10">
                                                <AvatarFallback className="bg-violet-600 text-white font-bold">
                                                    {userMap[selectedSession!]?.charAt(0) || selectedSession!.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className={`absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full border-2 border-[#111623] ${isAiPaused ? "bg-red-500" : "bg-emerald-500"}`} />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                {userMap[selectedSession!] || selectedSession}
                                            </h3>
                                            <p className="text-[10px] font-medium flex items-center gap-1.5">
                                                {isAiPaused ? (
                                                    <span className="text-amber-400 flex items-center gap-1"><Hand className="h-3 w-3" /> Manual Control</span>
                                                ) : (
                                                    <span className="text-emerald-400 flex items-center gap-1"><Sparkles className="h-3 w-3" /> Aditi Active</span>
                                                )}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <MessageSquare className="h-5 w-5" />
                                        <span className="text-sm font-medium">Select a conversation</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {isAiPaused && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs uppercase tracking-wider font-bold border border-emerald-500/20"
                                        onClick={handleResume}
                                    >
                                        <Check className="mr-1.5 h-3 w-3" /> Resume AI
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Messages Body */}
                        <div className="flex-1 relative min-h-0 bg-transparent overflow-hidden">
                            {/* Scroll to Bottom Button - Centered & Small */}
                            {selectedSession && showScrollButton && (
                                <button
                                    onClick={scrollToBottom}
                                    className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-violet-600/90 hover:bg-violet-700 text-white p-2 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-white/10 transition-all hover:scale-110 active:scale-95 flex items-center justify-center backdrop-blur-sm"
                                    title="Scroll to bottom"
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            )}

                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className="h-full overflow-y-auto custom-scrollbar p-4 pt-20 pb-24"
                            >

                                <div className="max-w-3xl mx-auto space-y-6 py-2">
                                    {activeVisuals.length === 0 && !loading && (
                                        <div className="flex flex-col items-center justify-center p-12 opacity-20">
                                            <MessageSquare className="h-16 w-16 mb-4" />
                                            <p>No messages yet</p>
                                        </div>
                                    )}

                                    {(() => {
                                        let lastDate = "";
                                        return activeVisuals.map((msg) => {
                                            const isAi = msg.role === "assistant";
                                            const currentDate = new Date(msg.timestamp).toDateString();
                                            const showDivider = currentDate !== lastDate;
                                            lastDate = currentDate;

                                            return (
                                                <React.Fragment key={msg.id}>
                                                    {showDivider && (
                                                        <div className="flex justify-center my-6">
                                                            <div className="bg-[#111623]/80 backdrop-blur-md border border-white/5 py-1 px-4 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                                                                {formatDateDivider(msg.timestamp)}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className={`flex ${isAi ? "justify-end" : "justify-start"}`}>
                                                        <div className={`flex gap-3 max-w-[85%] ${isAi ? "flex-row-reverse" : "flex-row"}`}>

                                                            {/* Avatar for Message */}
                                                            {!isAi && (
                                                                <Avatar className="h-8 w-8 border border-white/5 mt-1 shrink-0 opacity-70">
                                                                    <AvatarFallback className="bg-slate-800 text-slate-400 text-[10px]">{userMap[selectedSession!]?.charAt(0) || "U"}</AvatarFallback>
                                                                </Avatar>
                                                            )}
                                                            {isAi && (
                                                                <Avatar className="h-8 w-8 border border-white/5 mt-1 shrink-0 opacity-70">
                                                                    <AvatarImage src="/avatars/aditi.png" />
                                                                    <AvatarFallback className="bg-violet-900/50 text-violet-300 text-[10px]">AI</AvatarFallback>
                                                                </Avatar>
                                                            )}

                                                            <div className={`flex flex-col ${isAi ? "items-end" : "items-start"} min-w-[100px]`}>
                                                                <div className={`py-3 px-5 text-sm leading-relaxed whitespace-pre-wrap shadow-lg ${isAi
                                                                    ? (msg.isManual
                                                                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                                                        : "bg-gradient-to-br from-[#2E3545] to-[#232936] text-slate-100 border border-white/5 rounded-2xl rounded-tr-sm")
                                                                    : "bg-[#1E293B] text-slate-200 border border-white/5 rounded-2xl rounded-tl-sm"
                                                                    }`}>
                                                                    {msg.mediaUrl && (
                                                                        <div className="mb-2 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                            <img src={msg.mediaUrl} alt="Message attachment" className="max-w-full h-auto object-contain max-h-[300px]" />
                                                                        </div>
                                                                    )}
                                                                    {msg.content}
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1 px-1 opacity-50 text-[10px]">
                                                                    <span className="font-medium text-slate-400">
                                                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                                                    </span>
                                                                    {msg.role === "assistant" && (
                                                                        <span>
                                                                            {msg.status === 'read' ? (
                                                                                <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" strokeWidth={2.5} />
                                                                            ) : msg.status === 'delivered' ? (
                                                                                <CheckCheck className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
                                                                            ) : (
                                                                                <Check className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        });
                                    })()}
                                    <div ref={scrollBottomRef}></div>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        {/* Floating Input Area - True Floating Effect (No Blur Bar) */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-transparent shrink-0 z-30 pointer-events-none">
                            <div className="max-w-4xl mx-auto flex items-center gap-3 pointer-events-auto">
                                {/* The Input Pill */}
                                <div className="flex-1 flex items-center bg-[#111623] border border-white/10 rounded-full px-4 min-h-[52px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all duration-300 hover:translate-y-[-2px]">
                                    <div className="flex items-center gap-1 sm:gap-2 mr-2">
                                        <button className="p-2 text-slate-500 hover:text-violet-400 transition-colors shrink-0">
                                            <Smile className="h-6 w-6" />
                                        </button>
                                        <button className="p-2 text-slate-500 hover:text-violet-400 transition-colors shrink-0">
                                            <Plus className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <input
                                        className="flex-1 bg-transparent text-sm md:text-base text-white focus:outline-none placeholder:text-slate-600 py-3"
                                        placeholder={selectedSession ? (isAiPaused ? "Type a reply to send manually..." : "Type to interrupt and take over...") : "Select a conversation"}
                                        disabled={!selectedSession || isSending}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />

                                    <div className="hidden sm:flex items-center ml-2">
                                        <button className="p-2 text-slate-500 hover:text-violet-400 transition-colors shrink-0">
                                            <ImageIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Floating Circular Send Button - Completely Outside */}
                                <Button
                                    disabled={!selectedSession || isSending || !inputText.trim()}
                                    className={`rounded-full h-[52px] w-[52px] shrink-0 p-0 shadow-2xl flex items-center justify-center transition-all duration-300 ${!inputText.trim()
                                        ? "bg-[#111623] text-slate-600 cursor-not-allowed border border-white/5"
                                        : "bg-violet-600 hover:bg-violet-700 text-white hover:scale-105 active:scale-95 shadow-violet-900/30"
                                        }`}
                                    onClick={handleSend}
                                >
                                    {isSending ? (
                                        <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5 ml-0.5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
