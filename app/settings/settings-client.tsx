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
    Loader2,
    RefreshCcw,
    Info
} from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { updateInstituteSettings } from "./actions"

interface InstituteSettings {
    name?: string | null
    city?: string | null
    address?: string | null
    helpline_number?: string | null
    phone_id?: string | null
    access_token?: string | null
}

interface SettingsClientProps {
    initialSettings: InstituteSettings | null
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
    const [originalSettings, setOriginalSettings] = React.useState<InstituteSettings | null>(initialSettings)
    const [settings, setSettings] = React.useState<InstituteSettings | null>(initialSettings)
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
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* 🌌 Ambient Background Glows - Optimized */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-violet-600/5 blur-[80px] rounded-full" />
            </div>

            {/* Fixed Container - No Page Scroll */}
            <div className="flex-1 w-full h-full relative z-10 max-w-7xl mx-auto flex flex-col">
                <Tabs defaultValue="general" className="h-full">

                    {/* Sticky Blurred Header Section (with Tabs) */}
                    <div className="sticky top-0 z-50 backdrop-blur-xl px-4 md:px-8 py-6 mb-2">
                        <WorkspaceHeader
                            title="Institute Settings"
                            subtitle="Mission Control for your Organization. Manage everything from Branding to Security."
                            icon={Building}
                            iconColor="text-violet-500"
                            className="p-0 mb-0"
                            badge={
                                <span className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                    </span>
                                    <span className="text-emerald-400">Configured</span>
                                </span>
                            }
                        />
                        <TabsList className="bg-white/5 border border-white/10 p-1 mt-6 w-full justify-start h-12 rounded-xl backdrop-blur-md">
                            <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg py-2 px-6 font-bold transition-all">
                                <Building className="h-4 w-4 mr-2" /> General
                            </TabsTrigger>

                            {/* Integrations & Security hidden - not implemented yet */}
                            {/* <TabsTrigger value="integrations" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg py-2 px-6 font-bold transition-all">
                                <Smartphone className="h-4 w-4 mr-2" /> Integrations
                            </TabsTrigger>
                            <TabsTrigger value="security" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-lg py-2 px-6 font-bold transition-all">
                                <ShieldAlert className="h-4 w-4 mr-2" /> Security
                            </TabsTrigger> */}
                        </TabsList>
                    </div>

                    {/* Content Section - Fixed, No Page Scroll */}
                    <div className="flex-1 px-4 md:px-8 pr-2 pb-4 min-h-0">
                        {/* TAB 1: GENERAL */}
                        <TabsContent value="general" className="h-full outline-none">
                            <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 border-violet-500/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden h-full flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                                    <div>
                                        <CardTitle className="text-white">Institute Profile</CardTitle>
                                        <CardDescription>These details are used by Aditi in conversations with leads.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        {!isEditing && (
                                            <>
                                                <Button
                                                    onClick={() => {
                                                        if (confirm('Reset to original settings? This will undo any unsaved changes.'))
                                                            setSettings(initialSettings)
                                                    }}
                                                    variant="ghost"
                                                    className="text-slate-400 hover:text-white hover:bg-white/5"
                                                >
                                                    <RefreshCcw className="h-4 w-4 mr-2" /> Reset
                                                </Button>
                                                <Button
                                                    onClick={() => setIsEditing(true)}
                                                    variant="outline"
                                                    className="border-white/10 text-slate-300 hover:bg-white/5"
                                                >
                                                    Edit Profile
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                                    {/* Info Banner */}
                                    <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                        <Info className="h-5 w-5 text-emerald-500 shrink-0" />
                                        <p className="text-sm text-emerald-200/80">These settings are <strong>actively used</strong> by Aditi when talking to your leads. Changes take effect immediately.</p>
                                    </div>
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
                        <TabsContent value="integrations" className="h-full outline-none">
                            <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 border-emerald-500/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden h-full flex flex-col">
                                <CardHeader className="flex-shrink-0">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Smartphone className="h-5 w-5 text-emerald-500" /> WhatsApp Business API
                                    </CardTitle>
                                    <CardDescription>Centralized number for all AI Agents.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto custom-scrollbar">
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
                        <TabsContent value="security" className="h-full outline-none">
                            <Card className="bg-gradient-to-br from-red-500/[0.03] to-transparent border-red-500/20 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden h-full flex flex-col">
                                <CardHeader className="flex-shrink-0">
                                    <CardTitle className="text-red-500 flex items-center gap-2">
                                        <Lock className="h-5 w-5" /> Danger Zone
                                    </CardTitle>
                                    <CardDescription className="text-red-200/50">Irreversible actions.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-4 flex-1 overflow-y-auto custom-scrollbar">
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
