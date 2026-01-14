import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, Star, Mail, Calendar, Phone } from "lucide-react"

export default async function InboundPage() {
    const supabase = await createServerClient()

    const [waitlistResults, feedbackResults] = await Promise.all([
        supabase.from('waitlist').select('*').order('created_at', { ascending: false }),
        supabase.from('feedback').select('*').order('created_at', { ascending: false })
    ])

    const waitlist = waitlistResults.data || []
    const feedback = feedbackResults.data || []

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Inbound Requests</h1>
                <p className="text-slate-400">View waitlist signups and product feedback.</p>
            </div>

            <Tabs defaultValue="waitlist" className="w-full">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="waitlist">
                        <Users className="h-4 w-4 mr-2" /> Waitlist ({waitlist.length})
                    </TabsTrigger>
                    <TabsTrigger value="feedback">
                        <MessageSquare className="h-4 w-4 mr-2" /> Feedback ({feedback.length})
                    </TabsTrigger>
                </TabsList>

                {/* Waitlist Tab */}
                <TabsContent value="waitlist" className="mt-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Alpha Access Requests</CardTitle>
                            <CardDescription>People asking for Early Access keys.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {waitlist.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">No waitlist requests yet.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border/40 hover:bg-transparent">
                                            <TableHead>Name</TableHead>
                                            <TableHead>Source</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {waitlist.map((item) => (
                                            <TableRow key={item.id} className="border-border/40 hover:bg-muted/5">
                                                <TableCell>
                                                    <div className="font-medium text-foreground">{item.full_name || "Unknown"}</div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.contact}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="text-[10px] uppercase">
                                                        {item.source || "Website"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs">
                                                    {new Date(item.created_at!).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Feedback Tab */}
                <TabsContent value="feedback" className="mt-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>User Feedback</CardTitle>
                            <CardDescription>Ratings and suggestions from users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {feedback.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">No feedback submitted yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {feedback.map((item) => (
                                        <div key={item.id} className="p-5 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/20 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < (item.rating || 0) ? "text-amber-500 fill-amber-500" : "text-muted"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-muted-foreground">{new Date(item.created_at!).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-foreground text-sm italic mb-4">"{item.message}"</p>
                                            <div className="flex items-center gap-2 border-t border-border/10 pt-3">
                                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
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
    )
}
