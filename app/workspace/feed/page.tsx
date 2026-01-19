"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { MessageSquare, Hand, Send, Check, CheckCheck, Users, Sparkles, Search, Smile, ThumbsDown, ChevronDown, Plus, Image as ImageIcon, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { WorkspaceHeader } from "@/components/workspace-header"

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
    const [isChatSheetOpen, setIsChatSheetOpen] = React.useState(false)

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

            const sessionMap: Record<string, string> = {}
            msgData?.forEach((m: any) => {
                const sid = (m.phone_number && m.phone_number.trim() !== "")
                    ? m.phone_number
                    : (m.session_id || "Unknown")
                const mTime = m.created_at || "0"
                if (!sessionMap[sid] || mTime > sessionMap[sid]) {
                    sessionMap[sid] = mTime
                }
            })

            const sortedIds = Object.keys(sessionMap).sort((a, b) => {
                return sessionMap[b].localeCompare(sessionMap[a])
            })

            setSessions(sortedIds)

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

    const handleResume = async () => {
        if (!selectedSession) return;
        try {
            await fetch('/api/chat/resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: selectedSession })
            })
            setIsAiPaused(false)
            fetchHistory()
        } catch (e) {
            console.error("Resume Failed", e)
        }
    }

    const markAsRead = React.useCallback(async (sessionId: string) => {
        const supabase = createClient()
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId);

        let query = supabase
            .from("ai_chat_history")
            .update({
                is_read: true,
                updated_at: new Date().toISOString()
            } as any)
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
            console.error("MarkAsRead Error:", error)
        }
    }, [fetchHistory])

    React.useEffect(() => {
        fetchHistory()
        // TEMPORARILY DISABLED - Testing scroll issue
        // const interval = setInterval(fetchHistory, 5000)
        // return () => clearInterval(interval)
    }, [fetchHistory])

    React.useEffect(() => {
        if (selectedSession) {
            markAsRead(selectedSession)
        }
    }, [selectedSession, markAsRead])

    // Simple scroll to bottom function (manual trigger only)
    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            // With flex-col-reverse, scrollTop = 0 is at bottom (latest)
            scrollContainerRef.current.scrollTop = 0;
        }
    }

    // Track if user has scrolled away from bottom
    // Using ref to avoid re-render on every scroll
    const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        // Capture scrollTop immediately (before setTimeout)
        const currentScrollTop = e.currentTarget.scrollTop;

        // Clear previous timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        // Debounce: only update state after scroll stops
        scrollTimeoutRef.current = setTimeout(() => {
            // With flex-col-reverse, scrollTop near 0 = at bottom (latest)
            const isAtBottom = currentScrollTop <= 100;
            const shouldShowButton = !isAtBottom;
            // Only update if value changed
            if (showScrollButton !== shouldShowButton) {
                setShowScrollButton(shouldShowButton);
            }
        }, 100);
    }

    const handleSend = async () => {
        if (!selectedSession || !inputText.trim()) return

        setIsSending(true)
        const textToSend = inputText
        setInputText("")

        try {
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

            if (!res.ok) {
                alert(`Message failed: ${data.error || "Unknown Error"}`)
                setInputText(textToSend)
            } else {
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

    const getActiveVisualMessages = () => {
        if (!selectedSession) return []

        const sessionRows = messages.filter(m =>
            (m.phone_number === selectedSession) || (m.session_id === selectedSession)
        );

        const visual: VisualMessage[] = []

        sessionRows.forEach(row => {
            if (row.user_message) {
                visual.push({
                    id: `${row.id}_user`,
                    role: "user",
                    content: row.user_message,
                    timestamp: row.created_at || new Date().toISOString(),
                    status: row.status,
                    mediaUrl: (row.message_meta as any)?.media_url || (row.message_meta as any)?.image_url
                })
            }
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
                    mediaUrl: (row.message_meta as any)?.media_url || (row.message_meta as any)?.image_url
                })
            }
        })

        return visual
    }

    const activeVisuals = getActiveVisualMessages()

    // Get unread count for badge
    const totalUnread = messages.filter(m => m.user_message && !m.is_read).length

    // Handle mobile session click
    const handleMobileSessionClick = (sessionId: string) => {
        setSelectedSession(sessionId)
        setIsChatSheetOpen(true)
    }

    // Session List Component
    const SessionList = ({ onSessionClick }: { onSessionClick: (sid: string) => void }) => (
        <div className="flex-1 min-h-0 w-full overflow-y-auto custom-scrollbar">
            <div className="p-2 space-y-1">
                {loading ? (
                    <div className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center animate-pulse">
                                <MessageSquare className="h-5 w-5 text-violet-400" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Loading chats...</p>
                        </div>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                                <MessageSquare className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-white font-medium mt-2 text-sm">No active chats</p>
                            <p className="text-xs text-muted-foreground">Conversations will appear here</p>
                        </div>
                    </div>
                ) : (
                    sessions
                        .filter(sid => {
                            const name = (userMap[sid] || "").toLowerCase();
                            const phone = sid.toLowerCase();
                            const search = sessionSearch.toLowerCase();
                            return name.includes(search) || phone.includes(search);
                        })
                        .map((sessionId, i) => {
                            const sessionMsgs = messages.filter(m => m.phone_number === sessionId || m.session_id === sessionId);
                            const latestMsg = sessionMsgs[sessionMsgs.length - 1];
                            const sentiment = latestMsg?.sentiment?.toLowerCase();
                            const isUnread = sessionMsgs.some(m => m.user_message && !m.is_read);
                            const unreadCount = sessionMsgs.filter(m => m.user_message && !m.is_read).length;
                            const isSelected = selectedSession === sessionId;
                            const displayName = userMap[sessionId] || sessionId;
                            const isPhoneNumber = !userMap[sessionId] && sessionId.startsWith('+');

                            return (
                                <div
                                    key={i}
                                    onClick={() => onSessionClick(sessionId)}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group
                                        ${isSelected
                                            ? "bg-violet-500/15 border border-violet-500/30 shadow-lg shadow-violet-500/5"
                                            : "bg-white/[0.02] border border-transparent hover:bg-white/[0.05] hover:border-white/10"
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold
                                            ${isSelected
                                                ? "bg-gradient-to-br from-violet-500 to-violet-700 text-white"
                                                : isUnread
                                                    ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white"
                                                    : "bg-gradient-to-br from-slate-600 to-slate-800 text-slate-300"
                                            }`}>
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                        {/* Online/Sentiment indicator */}
                                        {/* Online/Sentiment indicator - RESTORED */}
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0F131E] 
                                            ${(sentiment === 'excited' || sentiment === 'happy') ? 'bg-emerald-500' :
                                                (sentiment === 'sad' || sentiment === 'frustrated') ? 'bg-rose-500' :
                                                    (sentiment === 'skeptical' || sentiment === 'confused') ? 'bg-amber-500' :
                                                        'bg-slate-500'
                                            }`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col overflow-hidden gap-0.5 flex-1 min-w-0">
                                        {/* Name + Time Row */}
                                        <div className="flex justify-between items-center gap-2">
                                            <span className={`truncate ${isSelected ? "text-white font-semibold" : isUnread ? "text-white font-bold" : "text-slate-200 font-medium"} text-sm`}>
                                                {isPhoneNumber ? (
                                                    <span className="font-mono">{displayName}</span>
                                                ) : (
                                                    displayName
                                                )}
                                            </span>
                                            {latestMsg?.created_at && (
                                                <span className={`text-[10px] shrink-0 ${isUnread ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                                                    {new Date(latestMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>

                                        {/* Message Preview + Badge Row */}
                                        <div className="flex justify-between items-center gap-2">
                                            <p className={`text-xs truncate flex-1 ${isUnread ? "text-slate-300" : "text-slate-500"}`}>
                                                {latestMsg?.ai_response ? (
                                                    <span className="flex items-center gap-1">
                                                        <CheckCheck className="h-3 w-3 text-[#53bdeb] shrink-0" />
                                                        <span className="truncate">{latestMsg.ai_response}</span>
                                                    </span>
                                                ) : latestMsg?.user_message ? (
                                                    <span className="truncate">{latestMsg.user_message}</span>
                                                ) : (
                                                    <span className="text-slate-600 italic">No messages</span>
                                                )}
                                            </p>
                                            {isUnread && unreadCount > 0 && (
                                                <div className="min-w-[20px] h-[20px] bg-emerald-500 rounded-full flex items-center justify-center px-1.5 shrink-0">
                                                    <span className="text-[10px] text-white font-bold">
                                                        {unreadCount}
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
    )

    // Chat View Component (reusable for desktop and mobile sheet)
    const ChatView = ({ inSheet = false }: { inSheet?: boolean }) => (
        <div className="flex-1 flex flex-col min-w-0 bg-[#0F131E] h-full relative">
            {/* Chat Header */}
            <div className={`${inSheet ? '' : 'absolute top-0 left-0 right-0'} h-14 md:h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-[#0F131E]/60 backdrop-blur-lg shrink-0 z-30`}>
                <div className="flex items-center gap-3">
                    {inSheet && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => setIsChatSheetOpen(false)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    {selectedSession ? (
                        <>
                            <div className="relative">
                                <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-white/10">
                                    <AvatarFallback className="bg-violet-600 text-white font-bold text-xs">
                                        {userMap[selectedSession!]?.charAt(0) || selectedSession!.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className={`absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full border-2 border-[#111623] ${isAiPaused ? "bg-red-500" : "bg-emerald-500"}`} />
                            </div>

                            <div>
                                <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                                    {userMap[selectedSession!] || selectedSession}
                                </h3>
                                <p className="text-[9px] md:text-[10px] font-medium flex items-center gap-1">
                                    {isAiPaused ? (
                                        <span className="text-amber-400 flex items-center gap-1"><Hand className="h-2.5 w-2.5 md:h-3 md:w-3" /> Manual</span>
                                    ) : (
                                        <span className="text-emerald-400 flex items-center gap-1"><Sparkles className="h-2.5 w-2.5 md:h-3 md:w-3" /> Aditi Active</span>
                                    )}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                            <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="text-xs md:text-sm font-medium">Select a conversation</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isAiPaused && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 md:h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-[10px] md:text-xs uppercase tracking-wider font-bold border border-emerald-500/20 px-2 md:px-3"
                            onClick={handleResume}
                        >
                            <Check className="mr-1 h-3 w-3" /> Resume
                        </Button>
                    )}
                </div>
            </div>

            {/* Messages Body */}
            <div className={`flex-1 relative min-h-0 bg-transparent overflow-hidden ${inSheet ? '' : 'pt-14 md:pt-16'}`}>
                {selectedSession && showScrollButton && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-violet-600/90 hover:bg-violet-700 text-white p-2 rounded-full shadow-lg"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </button>
                )}

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="h-full overflow-y-auto custom-scrollbar p-3 md:p-4 pb-20 flex flex-col-reverse"
                >
                    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
                        {activeVisuals.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center p-12 opacity-20">
                                <MessageSquare className="h-12 w-12 md:h-16 md:w-16 mb-4" />
                                <p className="text-xs md:text-sm">No messages yet</p>
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
                                            <div className="flex justify-center my-4 md:my-6">
                                                <div className="bg-[#111623]/80 backdrop-blur-md border border-white/5 py-1 px-3 md:px-4 rounded-lg text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {formatDateDivider(msg.timestamp)}
                                                </div>
                                            </div>
                                        )}
                                        <div className={`flex ${isAi ? "justify-end" : "justify-start"}`}>
                                            <div className={`flex gap-2 md:gap-3 max-w-[90%] md:max-w-[85%] ${isAi ? "flex-row-reverse" : "flex-row"}`}>
                                                {!isAi && (
                                                    <Avatar className="h-6 w-6 md:h-8 md:w-8 border border-white/5 mt-1 shrink-0 opacity-70">
                                                        <AvatarFallback className="bg-slate-800 text-slate-400 text-[8px] md:text-[10px]">{userMap[selectedSession!]?.charAt(0) || "U"}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                {isAi && (
                                                    <Avatar className="h-6 w-6 md:h-8 md:w-8 border border-white/5 mt-1 shrink-0 opacity-70">
                                                        <AvatarImage src="/avatars/aditi.png" />
                                                        <AvatarFallback className="bg-violet-900/50 text-violet-300 text-[8px] md:text-[10px]">AI</AvatarFallback>
                                                    </Avatar>
                                                )}

                                                <div className={`flex flex-col ${isAi ? "items-end" : "items-start"} min-w-[80px]`}>
                                                    <div className={`py-2 md:py-3 px-3 md:px-5 text-xs md:text-sm leading-relaxed whitespace-pre-wrap shadow-lg ${isAi
                                                        ? (msg.isManual
                                                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                                            : "bg-gradient-to-br from-[#2E3545] to-[#232936] text-slate-100 border border-white/5 rounded-2xl rounded-tr-sm")
                                                        : "bg-[#1E293B] text-slate-200 border border-white/5 rounded-2xl rounded-tl-sm"
                                                        }`}>
                                                        {msg.mediaUrl && (
                                                            <div className="mb-2 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src={msg.mediaUrl} alt="Attachment" className="max-w-full h-auto object-contain max-h-[200px] md:max-h-[300px]" />
                                                            </div>
                                                        )}
                                                        {msg.content}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1 px-1 opacity-50 text-[9px] md:text-[10px]">
                                                        <span className="font-medium text-slate-400">
                                                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now"}
                                                        </span>
                                                        {msg.role === "assistant" && (
                                                            <span>
                                                                {msg.status === 'read' ? (
                                                                    <CheckCheck className="h-3 w-3 md:h-3.5 md:w-3.5 text-[#53bdeb]" strokeWidth={2.5} />
                                                                ) : msg.status === 'delivered' ? (
                                                                    <CheckCheck className="h-3 w-3 md:h-3.5 md:w-3.5 text-slate-400" strokeWidth={2.5} />
                                                                ) : (
                                                                    <Check className="h-3 w-3 md:h-3.5 md:w-3.5 text-slate-400" strokeWidth={2.5} />
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
            <div className="p-2 md:p-4 bg-[#0B0F19] border-t border-white/10 shrink-0">
                <div className="max-w-4xl mx-auto flex items-center gap-2 md:gap-3">
                    <div className="flex-1 flex items-center bg-[#111623] border border-white/10 rounded-full px-3 md:px-4 min-h-[44px] md:min-h-[52px] focus-within:border-violet-500/50 transition-all">
                        <button className="p-1.5 md:p-2 text-slate-500 hover:text-violet-400 transition-colors shrink-0">
                            <Smile className="h-5 w-5 md:h-6 md:w-6" />
                        </button>

                        <input
                            className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-600 py-2 mx-2"
                            placeholder={selectedSession ? (isAiPaused ? "Type reply..." : "Type to take over...") : "Select chat"}
                            disabled={!selectedSession || isSending}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />

                        <button className="hidden sm:block p-1.5 md:p-2 text-slate-500 hover:text-violet-400 transition-colors shrink-0">
                            <ImageIcon className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                    </div>

                    <Button
                        disabled={!selectedSession || isSending || !inputText.trim()}
                        className={`rounded-full h-[44px] w-[44px] md:h-[52px] md:w-[52px] shrink-0 p-0 ${!inputText.trim()
                            ? "bg-[#111623] text-slate-600 cursor-not-allowed border border-white/5"
                            : "bg-violet-600 hover:bg-violet-700 text-white"
                            }`}
                        onClick={handleSend}
                    >
                        {isSending ? (
                            <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="h-4 w-4 md:h-5 md:w-5" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="h-full w-full flex flex-col overflow-hidden bg-transparent">
            {/* Header */}
            {/* Header */}
            <WorkspaceHeader
                title="Live Chat"
                subtitle="Monitor and manage Aditi's conversations"
                icon={MessageSquare}
                iconColor="text-violet-500"
                className="px-4 md:px-8 pt-4 md:pt-6 pb-3 md:pb-4 max-w-7xl mx-auto w-full z-20"
                badge={totalUnread > 0 ? (
                    <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500 text-white">
                        {totalUnread}
                    </Badge>
                ) : null}
            />

            {/* Main Content */}
            <div className="flex-1 min-h-0 w-full px-4 md:px-8 pb-4">
                {/* Desktop Layout - Side by side */}
                <div className="hidden md:flex w-full h-full bg-[#0F131E] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    {/* Sidebar */}
                    <div className="flex flex-col w-[280px] lg:w-[320px] shrink-0 border-r border-white/10 bg-[#0B0F19] h-full">
                        <div className="flex flex-col border-b border-white/10 bg-[#111623] shrink-0">
                            <div className="h-14 flex items-center px-4 justify-between">
                                <h2 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5 text-violet-400" /> Inquiries <span className="text-violet-200/50">({sessions.length})</span>
                                </h2>
                            </div>
                            <div className="px-3 pb-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                                        placeholder="Search..."
                                        value={sessionSearch}
                                        onChange={(e) => setSessionSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <SessionList onSessionClick={(sid) => setSelectedSession(sid)} />
                    </div>

                    {/* Chat Area */}
                    <ChatView />
                </div>

                {/* Mobile Layout - List OR Chat in same container */}
                <div className="md:hidden w-full h-full bg-[#0F131E] border border-white/10 rounded-xl overflow-hidden flex flex-col">
                    {isChatSheetOpen && selectedSession ? (
                        // Show Chat View
                        <ChatView inSheet={true} />
                    ) : (
                        // Show List View
                        <>
                            {/* Search */}
                            <div className="px-3 py-2 border-b border-white/10 bg-[#111623]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                                        placeholder="Search chats..."
                                        value={sessionSearch}
                                        onChange={(e) => setSessionSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <SessionList onSessionClick={handleMobileSessionClick} />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
