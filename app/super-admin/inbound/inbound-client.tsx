"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, Star, Mail, Phone } from "lucide-react"
import { useEffect, useState } from "react"

function ClientDate({ date, className, includeYear = false }: { date: string | null, className?: string, includeYear?: boolean }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <span className={className}>...</span>
    }

    if (!date) {
        return <span className={className}>N/A</span>
    }

    return (
        <span className={className}>
            {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: includeYear ? 'numeric' : undefined,
                timeZone: 'UTC'
            })}
        </span>
    )
}

interface WaitlistEntry {
    id: string
    created_at: string
    full_name: string
    email: string | null
    contact: string
    source: string | null
    institute_name: string | null
    annual_admissions_scale: string | null
    current_counseling_team_size: string | null
    primary_admission_challenge: string | null
    institute_full_address: string | null
    preferred_visit_time: string | null
    referral_source: string | null
}

interface FeedbackEntry {
    id: string
    created_at: string | null
    email: string | null
    message: string | null
    name: string | null
    rating: number | null
}

interface InboundClientProps {
    waitlist: WaitlistEntry[]
    feedback: FeedbackEntry[]
}

export function InboundClient({ waitlist, feedback }: InboundClientProps) {
    return (
        <Tabs defaultValue="waitlist" className="w-full h-full flex flex-col">
            <TabsList className="bg-muted/50 border border-border flex-none self-start">
                <TabsTrigger value="waitlist" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    <Users className="h-4 w-4 mr-2" /> Waitlist ({waitlist.length})
                </TabsTrigger>
                <TabsTrigger value="feedback" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    <MessageSquare className="h-4 w-4 mr-2" /> Feedback ({feedback.length})
                </TabsTrigger>
            </TabsList>

            {/* Waitlist Tab */}
            <TabsContent value="waitlist" className="flex-1 min-h-0 data-[state=inactive]:hidden flex flex-col mt-0">
                <Card className="flex-1 flex flex-col bg-gradient-to-br from-primary/5 to-transparent border border-border backdrop-blur-md shadow-lg bg-card/50 overflow-hidden min-h-0">
                    <CardHeader className="flex-none pt-0 pb-0 hidden md:flex">
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Alpha Access Requests
                        </CardTitle>
                        <CardDescription>People asking for Early Access keys.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col min-h-0 p-0 relative overflow-hidden">
                        {/* Fixed Header - Desktop Only */}
                        <div className="flex-none z-20 mx-4 md:mx-6 mb-0 border-b border-border/40 pb-2 hidden md:block">
                            <div className="grid grid-cols-12 px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider gap-4">
                                <div className="col-span-3">Institute / Director</div>
                                <div className="col-span-2">Scale</div>
                                <div className="col-span-3">Primary Challenge</div>
                                <div className="col-span-2">Visit Time</div>
                                <div className="col-span-2 text-right">Applied On</div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-2 md:px-6 pt-3 pb-2 space-y-3 md:space-y-2">
                            {waitlist.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-8 w-8 text-primary/50" />
                                    </div>
                                    <p className="text-foreground font-medium">No applications yet</p>
                                    <p className="text-sm mt-1">Founding Partner applications will appear here.</p>
                                </div>
                            ) : (
                                waitlist.map((item) => (
                                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center p-3 md:p-4 rounded-xl hover:bg-muted/50 transition-colors border border-border/50 hover:border-primary/20 bg-card gap-2 md:gap-4 group relative shadow-sm md:shadow-none">
                                        <div className="col-span-1 md:col-span-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                    {(item.institute_name || item.full_name || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold text-foreground truncate" title={item.institute_name || undefined}>{item.institute_name || "Unknown Institute"}</div>
                                                    <div className="text-xs text-muted-foreground truncate">{item.full_name}</div>
                                                    <div className="flex flex-col gap-0.5 md:gap-1 mt-1">
                                                        {item.email && (
                                                            <div className="flex items-center gap-1 text-[10px] text-primary truncate">
                                                                <Mail className="h-3 w-3 shrink-0" /> <span className="truncate">{item.email}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                            <Phone className="h-3 w-3 shrink-0" /> {item.contact}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Mobile Date Badge */}
                                                <div className="md:hidden flex flex-col items-end gap-1">
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] h-4 px-1.5">
                                                        NEW
                                                    </Badge>
                                                    <ClientDate date={item.created_at} className="text-[9px] text-muted-foreground font-mono" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-1 md:col-span-2 flex flex-row md:block gap-2 md:gap-0 items-center text-xs">
                                            <div className="md:hidden font-medium text-muted-foreground w-16 shrink-0">Scale:</div>
                                            <div className="flex flex-wrap gap-2 items-center">
                                                <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400 bg-indigo-500/5 whitespace-nowrap">
                                                    {item.annual_admissions_scale || "N/A"} Students
                                                </Badge>
                                                {item.current_counseling_team_size && (
                                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                                                        <Users className="h-3 w-3" /> Team: {item.current_counseling_team_size}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-1 md:col-span-3 flex flex-row md:block gap-2 md:gap-0">
                                            <div className="md:hidden text-xs font-medium text-muted-foreground w-16 shrink-0 mt-0.5">Challenge:</div>
                                            <div className="text-xs text-muted-foreground bg-muted/30 p-1.5 rounded border border-border/50 line-clamp-2 w-full" title={item.primary_admission_challenge || undefined}>
                                                {item.primary_admission_challenge || "No challenge specified"}
                                            </div>
                                        </div>

                                        <div className="col-span-1 md:col-span-2 flex flex-row md:block gap-2 md:gap-0 items-center">
                                            <div className="md:hidden text-xs font-medium text-muted-foreground w-16 shrink-0">Visit:</div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-medium text-foreground flex items-center gap-1">
                                                    {item.preferred_visit_time || "Anytime"}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground truncate" title={item.institute_full_address || undefined}>
                                                    {item.institute_full_address || "No address"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-1 md:col-span-2 text-right hidden md:block">
                                            <ClientDate date={item.created_at} includeYear className="text-muted-foreground text-xs font-mono" />
                                            <div className="mt-1">
                                                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 text-[10px] h-5">
                                                    NEW
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback" className="flex-1 min-h-0 data-[state=inactive]:hidden flex flex-col mt-0">
                <Card className="flex-1 flex flex-col bg-gradient-to-br from-primary/5 to-transparent border border-border backdrop-blur-md shadow-lg bg-card/50 overflow-hidden min-h-0">
                    <CardHeader className="flex-none pt-2 pb-0 hidden md:flex space-y-0">
                        <CardTitle className="text-foreground flex items-center gap-2 mb-0">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            User Feedback
                        </CardTitle>
                        <CardDescription className="mt-0">Ratings and suggestions from users.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-0 flex flex-col">
                        <div className="flex-1 px-4 pt-3 pb-2 md:px-6 overflow-y-auto">
                            {feedback.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="h-8 w-8 text-primary/50" />
                                    </div>
                                    <p className="text-foreground font-medium">No feedback submitted yet</p>
                                    <p className="text-sm mt-1">Feedback will appear here when users submit it.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {feedback.map((item) => (
                                        <div key={item.id} className="p-5 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-all hover:scale-[1.01]">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < (item.rating || 0) ? "text-amber-500 fill-amber-500" : "text-muted-foreground/20"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <ClientDate date={item.created_at} includeYear className="text-xs text-muted-foreground" />
                                            </div>
                                            <p className="text-foreground text-sm italic mb-4">&quot;{item.message}&quot;</p>
                                            <div className="flex items-center gap-2 border-t border-border pt-3">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {(item.name || "?").charAt(0)}
                                                </div>
                                                <div className="text-xs">
                                                    <p className="text-foreground font-medium">{item.name}</p>
                                                    <p className="text-muted-foreground">{item.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
