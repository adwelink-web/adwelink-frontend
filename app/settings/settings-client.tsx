"use client"

import * as React from "react"
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
    Lock,
    Loader2
} from "lucide-react"
import { updateInstituteSettings } from "./actions"

interface SettingsClientProps {
    initialSettings: any
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
    const [originalSettings, setOriginalSettings] = React.useState<any>(initialSettings)
    const [settings, setSettings] = React.useState<any>(initialSettings)
    const [saving, setSaving] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)

    const handleSave = async () => {
        if (!settings) return
        setSaving(true)
        try {
            await updateInstituteSettings({
                name: settings.name,
                city: settings.city,
                address: settings.address,
                helpline_number: settings.helpline_number
            })
            setOriginalSettings(settings)
            setIsEditing(false)
        } catch (error) {
            console.error("Failed to save settings:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setSettings(originalSettings)
        setIsEditing(false)
    }

    return (
        <div className="h-full w-full overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 md:p-8 min-h-0">
                <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
                    <div className="flex-none space-y-6 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Institute Settings</h1>
                            <p className="text-slate-400">Mission Control for your Organization. Manage everything from Branding to Security.</p>
                        </div>
                        <TabsList className="bg-white/5 border border-white/10 p-1 mb-8 w-full justify-start h-auto">
                            <TabsTrigger value="general" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white py-2">
                                <Building className="h-4 w-4 mr-2" /> General & Branding
                            </TabsTrigger>

                            <TabsTrigger value="integrations" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white py-2">
                                <Smartphone className="h-4 w-4 mr-2" /> Integrations
                            </TabsTrigger>
                            <TabsTrigger value="security" className="data-[state=active]:bg-red-500 data-[state=active]:text-white py-2">
                                <ShieldAlert className="h-4 w-4 mr-2" /> Security & Access
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Tabs Content (Scrollable) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pr-2 pb-10">
                        {/* TAB 1: GENERAL */}
                        <TabsContent value="general" className="space-y-6">
                            <Card className="bg-white/5 border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white">Institute Profile</CardTitle>
                                        <CardDescription>Details displayed on student invoices and portals.</CardDescription>
                                    </div>
                                    {!isEditing && (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            variant="outline"
                                            className="border-white/10 text-slate-300 hover:bg-white/5"
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Institute Name</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.name || ""}
                                                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Helpline Number</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.helpline_number || ""}
                                                onChange={(e) => setSettings({ ...settings, helpline_number: e.target.value })}
                                                placeholder="9999999999"
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">City</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.city || ""}
                                                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                                                placeholder="Kota"
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Address</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.address || ""}
                                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                                placeholder="Full Address"
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="bg-white text-black hover:bg-slate-200 min-w-[140px]"
                                            >
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                                {saving ? "Saving..." : "Save Changes"}
                                            </Button>
                                            <Button
                                                onClick={handleCancel}
                                                variant="ghost"
                                                className="text-slate-400 hover:text-white hover:bg-white/5"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
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
                                                <div className="text-white font-medium">{settings?.phone_id ? "WhatsApp Connected" : "Not Connected"}</div>
                                                <div className="text-xs text-emerald-400">ID: {settings?.phone_id || "None"}</div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400">
                                            {settings?.phone_id ? "Re-Connect" : "Connect Now"}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300">Allow AI to initiate conversations</Label>
                                        <Switch checked={!!settings?.access_token} />
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
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
