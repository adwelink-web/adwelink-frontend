"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    BrainCircuit,
    Save,
    RotateCcw,
    FlaskConical
} from "lucide-react"

export default function BrainConfigPage() {
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <BrainCircuit className="h-8 w-8 text-purple-500" /> Brain Configuration
                    </h2>
                    <p className="text-muted-foreground mt-1">Fine-tune Aditi's cognitive parameters and behavioral overrides.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2">
                        <RotateCcw className="h-4 w-4" /> Reset
                    </Button>
                    <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white gap-2 shadow-[0_0_15px_rgba(124,58,237,0.5)] border-none">
                        <Save className="h-4 w-4" /> Publish Changes
                    </Button>
                </div>
            </div>

            {/* Main Control Panel */}
            <Tabs defaultValue="personality" className="space-y-4">
                <TabsList className="bg-white/5 border border-white/10 text-slate-400">
                    <TabsTrigger value="personality" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Personality Matrix</TabsTrigger>
                    <TabsTrigger value="identity" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Identity Core</TabsTrigger>
                    <TabsTrigger value="safety" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Safety Protocols</TabsTrigger>
                </TabsList>

                {/* 1. Personality Tab */}
                <TabsContent value="personality" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-slate-200">Tone & Voice</CardTitle>
                                <CardDescription>Adjust how Aditi speaks to potential leads.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-medium text-slate-300">
                                        <span>Strict (Teacher)</span>
                                        <span className="text-purple-400">Current: Friendly Didi</span>
                                        <span>Casual (Friend)</span>
                                    </div>
                                    <Slider defaultValue={[75]} max={100} step={1} className="py-4" />
                                </div>

                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="hinglish" className="flex flex-col space-y-1">
                                        <span className="text-slate-200">Hinglish Mode</span>
                                        <span className="font-normal text-xs text-muted-foreground">Mix Hindi/English naturally based on user input.</span>
                                    </Label>
                                    <Switch id="hinglish" defaultChecked />
                                </div>

                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="emojis" className="flex flex-col space-y-1">
                                        <span className="text-slate-200">Emoji Usage</span>
                                        <span className="font-normal text-xs text-muted-foreground">Allow usage of emojis in responses (😊, 👍).</span>
                                    </Label>
                                    <Switch id="emojis" defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-slate-200">Sales Aggression</CardTitle>
                                <CardDescription>How pushy should Aditi be for closing admission?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-medium text-slate-300">
                                        <span>Informational Only</span>
                                        <span className="text-orange-400">Current: Balanced</span>
                                        <span>Hard Closer</span>
                                    </div>
                                    <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-slate-200">Discount Authority</Label>
                                    <Input className="bg-black/20 border-white/10 text-white" placeholder="Max discount % (e.g. 10%)" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 2. Identity Tab */}
                <TabsContent value="identity" className="space-y-4">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-200">Agent Persona</CardTitle>
                            <CardDescription>Define who the agent pretends to be.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-200">Name</Label>
                                    <Input defaultValue="Aditi" className="bg-black/20 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-200">Role Title</Label>
                                    <Input defaultValue="Senior Admission Counselor" className="bg-black/20 border-white/10 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Bio / Backstory</Label>
                                <Textarea
                                    className="min-h-[100px] bg-black/20 border-white/10 text-white"
                                    defaultValue="I am Aditi, a friendly counselor at Adwelink Institute. My goal is to guide students towards the best career path in Tech."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Sandbox Footer */}
            <Card className="bg-emerald-950/20 border-emerald-500/20">
                <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-full">
                        <FlaskConical className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                        <CardTitle className="text-emerald-400 text-lg">Sandbox Environment Active</CardTitle>
                        <CardDescription className="text-emerald-500/60">Changes made above are currently in 'Simulation Mode'. Publish to go live.</CardDescription>
                    </div>
                    <div className="ml-auto">
                        <Switch defaultChecked id="sandbox-mode" />
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}
