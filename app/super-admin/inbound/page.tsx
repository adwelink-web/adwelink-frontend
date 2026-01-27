import { createAdminClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, Star, Mail, Inbox } from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"

export default async function InboundPage() {
    const supabase = createAdminClient()

    const [waitlistResults, feedbackResults] = await Promise.all([
        supabase.from('waitlist').select('*').order('created_at', { ascending: false }),
        supabase.from('feedback').select('*').order('created_at', { ascending: false })
    ])

    const waitlist = waitlistResults.data || []
    const feedback = feedbackResults.data || []

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* Main Scrollable Container */}
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                {/* Sticky Blurred Header Section */}
                <div className="sticky top-0 z-50 backdrop-blur-xl px-4 md:px-8 py-4 mb-2">
                    <WorkspaceHeader
                        title="Inbound Requests"
                        subtitle="View waitlist signups and product feedback"
                        icon={Inbox}
                        iconColor="text-primary"
                        className="max-w-7xl mx-auto"
                        badge={
                            <span className="flex items-center space-x-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                <span className="text-muted-foreground">{waitlist.length + feedback.length} total</span>
                            </span>
                        }
                    />
                </div>

                {/* Content Section */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                    <Tabs defaultValue="waitlist" className="w-full">
                        <TabsList className="bg-muted/50 border border-border">
                            <TabsTrigger value="waitlist" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                                <Users className="h-4 w-4 mr-2" /> Waitlist ({waitlist.length})
                            </TabsTrigger>
                            <TabsTrigger value="feedback" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                                <MessageSquare className="h-4 w-4 mr-2" /> Feedback ({feedback.length})
                            </TabsTrigger>
                        </TabsList>

                        {/* Waitlist Tab */}
                        <TabsContent value="waitlist" className="mt-6">
                            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-border backdrop-blur-md shadow-lg bg-card/50">
                                <CardHeader>
                                    <CardTitle className="text-foreground flex items-center gap-2">
                                        <Users className="h-4 w-4 text-primary" />
                                        Alpha Access Requests
                                    </CardTitle>
                                    <CardDescription>People asking for Early Access keys.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 flex flex-col relative">
                                    {/* Fixed Header */}
                                    <div className="flex-none -mt-4 z-20 mx-6 mb-2">
                                        <div className="grid grid-cols-12 px-2 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider gap-4">
                                            <div className="col-span-3">Institute / Director</div>
                                            <div className="col-span-2">Scale</div>
                                            <div className="col-span-3">Primary Challenge</div>
                                            <div className="col-span-2">Visit Time</div>
                                            <div className="col-span-2 text-right">Applied On</div>
                                        </div>
                                    </div>

                                    {/* Scrollable Content */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-2 space-y-2 max-h-[600px]">
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
                                                <div key={item.id} className="grid grid-cols-12 items-center p-4 rounded-xl hover:bg-muted/50 transition-colors border border-border/50 hover:border-primary/20 bg-card gap-4 group">
                                                    <div className="col-span-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                                {(item.institute_name || item.full_name || "?").charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-bold text-foreground truncate" title={item.institute_name}>{item.institute_name || "Unknown Institute"}</div>
                                                                <div className="text-xs text-muted-foreground truncate">{item.full_name}</div>
                                                                <div className="flex items-center gap-1 text-[10px] text-primary mt-0.5">
                                                                    <Mail className="h-3 w-3" /> {item.contact}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-span-2">
                                                        <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400 bg-indigo-500/5 whitespace-nowrap">
                                                            {item.annual_admissions_scale || "N/A"} Students
                                                        </Badge>
                                                        {item.referral_source && (
                                                            <div className="mt-1 text-[9px] text-amber-500 flex items-center gap-1">
                                                                Ref: {item.referral_source}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="col-span-3">
                                                        <div className="text-xs text-muted-foreground bg-muted/30 p-1.5 rounded border border-border/50 line-clamp-2" title={item.primary_admission_challenge}>
                                                            {item.primary_admission_challenge || "No challenge specified"}
                                                        </div>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <div className="text-xs font-medium text-foreground flex items-center gap-1">
                                                            {item.preferred_visit_time || "Anytime"}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground truncate" title={item.institute_full_address}>
                                                            {item.institute_full_address || "No address"}
                                                        </div>
                                                    </div>

                                                    <div className="col-span-2 text-right">
                                                        <span className="text-muted-foreground text-xs font-mono">
                                                            {new Date(item.created_at!).toLocaleDateString()}
                                                        </span>
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
                        <TabsContent value="feedback" className="mt-6">
                            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-border backdrop-blur-md shadow-lg bg-card/50">
                                <CardHeader>
                                    <CardTitle className="text-foreground flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-primary" />
                                        User Feedback
                                    </CardTitle>
                                    <CardDescription>Ratings and suggestions from users.</CardDescription>
                                </CardHeader>
                                <CardContent>
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
                                                        <span className="text-xs text-muted-foreground">{new Date(item.created_at!).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-foreground text-sm italic mb-4">"{item.message}"</p>
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
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
