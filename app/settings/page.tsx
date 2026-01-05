import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Building,
    ShieldAlert,
    Smartphone,
    Save,
    CreditCard,
    Check,
    Sparkles,
    Globe,
    Lock
} from "lucide-react"

export default function InstituteSettingsPage() {
    return (
        <div className="flex flex-col gap-6 p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">Institute Settings</h1>
                <p className="text-slate-400">
                    Mission Control for your Organization. Manage everything from Branding to Billing.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 mb-8 w-full justify-start h-auto">
                    <TabsTrigger value="general" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white py-2">
                        <Building className="h-4 w-4 mr-2" /> General & Branding
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white py-2">
                        <CreditCard className="h-4 w-4 mr-2" /> Billing & Plans
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white py-2">
                        <Smartphone className="h-4 w-4 mr-2" /> Integrations
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-red-500 data-[state=active]:text-white py-2">
                        <ShieldAlert className="h-4 w-4 mr-2" /> Security & Access
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: GENERAL */}
                <TabsContent value="general" className="space-y-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Institute Profile</CardTitle>
                            <CardDescription>Details displayed on student invoices and portals.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Institute Name</Label>
                                    <Input defaultValue="Adwelink Academy" className="bg-black/20 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Website URL</Label>
                                    <Input placeholder="https://adwelink.com" className="bg-black/20 border-white/10 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Brand Color (Hex)</Label>
                                <div className="flex gap-2">
                                    <div className="h-10 w-10 rounded bg-[#7C3AED] border border-white/20"></div>
                                    <Input defaultValue="#7C3AED" className="bg-black/20 border-white/10 text-white w-32" />
                                </div>
                            </div>
                            <Button className="bg-white text-black hover:bg-slate-200 mt-2">
                                <Save className="h-4 w-4 mr-2" /> Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: BILLING (Merged) */}
                <TabsContent value="billing" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Current Plan */}
                        <Card className="bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-amber-500 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5" /> Premium Plan
                                    </CardTitle>
                                    <span className="bg-amber-500/20 text-amber-500 text-xs px-2 py-1 rounded">Active</span>
                                </div>
                                <CardDescription className="text-amber-200/60">Next billing on Feb 5, 2026</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-3xl font-bold text-white">₹2,999<span className="text-sm text-slate-400 font-normal">/mo</span></div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-300"><Check className="h-4 w-4 text-emerald-500" /> All 3 Core Agents</div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300"><Check className="h-4 w-4 text-emerald-500" /> Unlimited Leads</div>
                                </div>
                                <Button className="w-full bg-amber-500 text-black hover:bg-amber-600">Upgrade Plan</Button>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" /> Payment Methods
                                </CardTitle>
                                <CardDescription>Manage your cards and invoices.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 border border-white/10 rounded bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-12 bg-slate-700 rounded flex items-center justify-center text-xs text-white">VISA</div>
                                        <span className="text-white text-sm">•••• 4242</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-slate-400">Edit</Button>
                                </div>
                                <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/5">+ Add New Card</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* TAB 3: INTEGRATIONS */}
                <TabsContent value="integrations" className="space-y-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-emerald-500" /> WhatsApp Business API
                            </CardTitle>
                            <CardDescription>Centralized number for all AI Agents.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <Smartphone className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">WhatsApp Connected</div>
                                        <div className="text-xs text-emerald-400">+91 98765 43210</div>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400">Re-Connect</Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-300">Allow AI to initiate conversations</Label>
                                <Switch checked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 4: SECURITY */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="bg-red-500/5 border-red-500/20">
                        <CardHeader>
                            <CardTitle className="text-red-500 flex items-center gap-2">
                                <Lock className="h-5 w-5" /> Danger Zone
                            </CardTitle>
                            <CardDescription className="text-red-200/50">Irreversible actions.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button variant="destructive">Pause All Agents</Button>
                            <Button variant="ghost" className="text-red-400 hover:bg-red-500/10 hover:text-red-500">Delete Institute Account</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
