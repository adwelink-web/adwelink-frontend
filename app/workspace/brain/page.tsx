"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { BrainCircuit, Sparkles, MessageSquare, ShieldAlert, Save, Loader2 } from "lucide-react"
import { useState } from "react"

export default function AgentBrainPage() {
    const [saving, setSaving] = useState(false)

    const handleSave = () => {
        setSaving(true)
        setTimeout(() => setSaving(false), 1000)
    }

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative p-4 md:p-8">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Header - Compact */}
            <div className="flex-none flex items-center justify-between z-10 mb-4 max-w-7xl mx-auto w-full">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center ring-1 ring-purple-500/30">
                            <BrainCircuit className="h-4 w-4 text-purple-500" />
                        </div>
                        Agent Brain Configuration
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 hidden md:block">Fine-tune your AI&apos;s knowledge, behavior, and personality traits</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar z-10 max-w-7xl mx-auto w-full">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personality & Tone */}
                        <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md border-violet-500/20 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-indigo-400" /> Behavior & Tone
                                </CardTitle>
                                <CardDescription>Define how your AI interacts with perspective students and parents.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-slate-300">System Instruction (The Core Persona)</Label>
                                    <Textarea
                                        placeholder="Enter the personality directives..."
                                        className="bg-black/20 border-white/10 text-white min-h-[150px] focus:border-purple-500/50"
                                        defaultValue="You are Aditi, a senior counselor at our institute. You are polite, encouraging, and highly knowledgeable about our courses. Your goal is to guide students to the right career path while maintaining a professional yet friendly tone."
                                    />
                                    <p className="text-[10px] text-slate-500">This prompt governs the AI&apos;s fundamental identity and response style.</p>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                                    <div className="space-y-0.5">
                                        <Label className="text-white">Professional Mode</Label>
                                        <p className="text-xs text-slate-500">Enable strict adherence to professional ethics.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Knowledge Base */}
                        <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-white/10 backdrop-blur-md border-violet-500/20 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-amber-500" /> Knowledge Injection
                                </CardTitle>
                                <CardDescription>Specific details your agent should always remember.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Custom Knowledge Data</Label>
                                    <Textarea
                                        placeholder="Add specific rules, FAQs, or institute details..."
                                        className="bg-black/20 border-white/10 text-white min-h-[100px]"
                                    />
                                </div>
                                <Button variant="outline" className="w-full border-dashed border-white/20 text-slate-400 hover:text-white hover:bg-white/5">
                                    + Upload Institute Brochure (PDF/Text)
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card className="bg-indigo-600/10 border-indigo-500/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Brain Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-white">
                                    <span className="text-sm">Active Agent</span>
                                    <span className="font-bold">Aditi</span>
                                </div>
                                <div className="flex items-center justify-between text-white">
                                    <span className="text-sm">Intelligence Tier</span>
                                    <span className="text-indigo-400 font-bold">GPT-4o Optimized</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-4/5 bg-indigo-500"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 text-center">80% Learning Efficiency Reached</p>
                            </CardContent>
                        </Card>

                        {/* Dangerous Actions */}
                        <Card className="bg-red-500/5 border-red-500/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4" /> Danger Zone
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="ghost" className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-400 text-xs justify-start">Reset Brain Memory</Button>
                                <Button variant="ghost" className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-400 text-xs justify-start">Emergency Agent Shutdown</Button>
                            </CardContent>
                        </Card>

                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-white text-black hover:bg-slate-200 font-bold py-6 rounded-xl shadow-lg shadow-indigo-500/10"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {saving ? "Updating Brain..." : "Save Configuration"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
