"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, RefreshCcw, Hand, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function FeedPage() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const [messages, setMessages] = React.useState<any[]>([])
    const [sessions, setSessions] = React.useState<string[]>([])
    const [selectedSession, setSelectedSession] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(true)

    // Fetch Chat History
    React.useEffect(() => {
        const fetchHistory = async () => {
            const supabase = createClient()

            // Get all chat history (ordered by time)
            const { data, error } = await supabase
                .from("ai_chat_history")
                .select("*")
                .order("timestamp", { ascending: true }) // Oldest first for chat flow

            if (error) {
                console.error("Error fetching chats:", error)
            } else {
                setMessages(data || [])

                // Extract unique sessions and selecting the most recent one
                const uniqueSessions = Array.from(new Set(data?.map((m: any) => m.session_id))).reverse()
                setSessions(uniqueSessions as string[])

                if (uniqueSessions.length > 0 && !selectedSession) {
                    setSelectedSession(uniqueSessions[0] as string)
                }
            }
            setLoading(false)
        }

        fetchHistory()

        // Poll for updates every 5 seconds (Simple Real-time)
        const interval = setInterval(fetchHistory, 5000)
        return () => clearInterval(interval)
    }, [selectedSession])

    // Filter messages for the selected user
    const activeConversation = messages.filter(m => m.session_id === selectedSession)

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <MessageSquare className="h-8 w-8 text-violet-500" /> Live Neural Feed
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
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {loading ? (
                                <div className="text-center p-4 text-xs text-slate-500">Syncing with Brain...</div>
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
                                                {sessionId.toString().charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-medium text-white truncate w-full">User {sessionId}</span>
                                            <span className="text-[10px] text-muted-foreground">Active now</span>
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
                                    {selectedSession ? `User ${selectedSession}` : "Select a Session"}
                                </CardTitle>
                                <CardDescription className="text-xs text-green-400">
                                    {selectedSession ? "Live Connection" : "Offline"}
                                </CardDescription>
                            </div>
                        </div>
                        <Button variant="destructive" size="sm" className="gap-2">
                            <Hand className="h-4 w-4" /> Takeover
                        </Button>
                    </CardHeader>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {activeConversation.length === 0 && !loading && (
                                <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                                    Select a session to view the neural log.
                                </div>
                            )}

                            {activeConversation.map((msg, idx) => {
                                const isAi = msg.role === "assistant";
                                return (
                                    <div key={idx} className={`flex ${isAi ? "justify-end" : "justify-start"}`}>
                                        <div className={`flex gap-3 max-w-[80%] ${isAi ? "flex-row-reverse" : "flex-row"}`}>
                                            <Avatar className="h-8 w-8 shrink-0">
                                                {isAi ? (
                                                    <AvatarImage src="/agents/aditi-avatar.png" />
                                                ) : null}
                                                <AvatarFallback className={isAi ? "bg-purple-600 border border-purple-400" : "bg-slate-700"}>
                                                    {isAi ? "AI" : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className={`flex flex-col ${isAi ? "items-end" : "items-start"}`}>
                                                <div className={`p-3 rounded-2xl text-sm shadow-sm ${isAi
                                                    ? "bg-purple-600 text-white rounded-tr-none"
                                                    : "bg-white/10 text-slate-200 rounded-tl-none border border-white/5"
                                                    }`}>
                                                    {msg.message || msg.content}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 px-1">
                                                    <span className="text-[8px] text-slate-500 uppercase">
                                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "Just now"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    )
}
