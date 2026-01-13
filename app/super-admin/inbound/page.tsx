import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="waitlist" className="data-[state=active]:bg-purple-600">
                        <Users className="h-4 w-4 mr-2" /> Waitlist ({waitlist.length})
                    </TabsTrigger>
                    <TabsTrigger value="feedback" className="data-[state=active]:bg-purple-600">
                        <MessageSquare className="h-4 w-4 mr-2" /> Feedback ({feedback.length})
                    </TabsTrigger>
                </TabsList>

                {/* Waitlist Tab */}
                <TabsContent value="waitlist" className="mt-6">
                    <Card className="border-white/10 bg-black/40">
                        <CardHeader>
                            <CardTitle>Alpha Access Requests</CardTitle>
                            <CardDescription>People asking for Early Access keys.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {waitlist.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">No waitlist requests yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {waitlist.map((item) => (
                                        <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-white">{item.full_name || "Unknown"}</h4>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.contact}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(item.created_at!).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300">{item.source || "Website"}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Feedback Tab */}
                <TabsContent value="feedback" className="mt-6">
                    <Card className="border-white/10 bg-black/40">
                        <CardHeader>
                            <CardTitle>User Feedback</CardTitle>
                            <CardDescription>Ratings and suggestions from users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {feedback.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">No feedback submitted yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {feedback.map((item) => (
                                        <div key={item.id} className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < (item.rating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-700"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-500">{new Date(item.created_at!).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-slate-300 text-sm italic mb-4">"{item.message}"</p>
                                            <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                                                <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
                                                    {(item.name || "?").charAt(0)}
                                                </div>
                                                <div className="text-xs">
                                                    <p className="text-white font-medium">{item.name}</p>
                                                    <p className="text-slate-500">{item.email}</p>
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
