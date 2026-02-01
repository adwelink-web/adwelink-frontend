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
    Info,
    Clock,
    Share2,
    FileText,
    Globe
} from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { updateInstituteSettings } from "./actions"

interface InstituteSettings {
    name?: string | null
    director_name?: string | null
    city?: string | null
    address?: string | null
    helpline_number?: string | null
    phone_id?: string | null
    access_token?: string | null
    logo?: string | null
    email?: string | null
    website?: string | null
    google_map_link?: string | null
    // Operational
    business_hours_start?: string | null
    business_hours_end?: string | null
    institute_type?: string | null
    founded_year?: string | null
    brochure_url?: string | null
    // Social
    instagram_url?: string | null
    facebook_url?: string | null
    youtube_url?: string | null
    linkedin_url?: string | null
    // Legal
    gstin?: string | null
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
                director_name: settings.director_name,
                email: settings.email,
                website: settings.website,
                logo: settings.logo,
                city: settings.city,
                address: settings.address,
                google_map_link: settings.google_map_link,
                helpline_number: settings.helpline_number,
                // New Fields
                business_hours_start: settings.business_hours_start,
                business_hours_end: settings.business_hours_end,
                institute_type: settings.institute_type,
                founded_year: settings.founded_year,
                brochure_url: settings.brochure_url,
                gstin: settings.gstin,
                instagram_url: settings.instagram_url,
                facebook_url: settings.facebook_url,
                youtube_url: settings.youtube_url,
                linkedin_url: settings.linkedin_url
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
                        <div className="overflow-x-auto pb-2 -mb-2">
                            <TabsList className="bg-white/5 border border-white/10 p-1 mt-6 w-full md:w-auto justify-start h-12 rounded-xl backdrop-blur-md inline-flex mb-1">
                                <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg py-2 px-6 font-bold transition-all">
                                    <Building className="h-4 w-4 mr-2" /> General
                                </TabsTrigger>
                                <TabsTrigger value="operations" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg py-2 px-6 font-bold transition-all">
                                    <Clock className="h-4 w-4 mr-2" /> Operations
                                </TabsTrigger>
                                <TabsTrigger value="social" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg py-2 px-6 font-bold transition-all">
                                    <Share2 className="h-4 w-4 mr-2" /> Social
                                </TabsTrigger>
                                <TabsTrigger value="legal" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg py-2 px-6 font-bold transition-all">
                                    <FileText className="h-4 w-4 mr-2" /> Legal
                                </TabsTrigger>
                                <TabsTrigger value="integrations" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-lg py-2 px-6 font-bold transition-all">
                                    <Smartphone className="h-4 w-4 mr-2" /> Integrations
                                </TabsTrigger>

                            </TabsList>
                        </div>
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
                                <CardContent className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2">Identity & Branding</h3>
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
                                                <Label className="text-slate-300">Director Name</Label>
                                                <Input
                                                    disabled={!isEditing}
                                                    value={settings?.director_name || ""}
                                                    onChange={(e) => setSettings({ ...settings, director_name: e.target.value })}
                                                    placeholder="Dr. R.K. Verma"
                                                    className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Logo URL</Label>
                                                <Input
                                                    disabled={!isEditing}
                                                    value={settings?.logo || ""}
                                                    onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                                                    placeholder="https://example.com/logo.png"
                                                    className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Website</Label>
                                                <Input
                                                    disabled={!isEditing}
                                                    value={settings?.website || ""}
                                                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                                                    placeholder="https://www.institute.com"
                                                    className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                <Label className="text-slate-300">Email Address</Label>
                                                <Input
                                                    type="email"
                                                    disabled={!isEditing}
                                                    value={settings?.email || ""}
                                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                                    placeholder="info@institute.com"
                                                    className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2">Location</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                <Label className="text-slate-300">Full Address</Label>
                                                <Input
                                                    disabled={!isEditing}
                                                    value={settings?.address || ""}
                                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                                    placeholder="123, Street Name, Area"
                                                    className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-slate-300">Google Maps Link</Label>
                                                <Input
                                                    disabled={!isEditing}
                                                    value={settings?.google_map_link || ""}
                                                    onChange={(e) => setSettings({ ...settings, google_map_link: e.target.value })}
                                                    placeholder="https://maps.google.com/..."
                                                    className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
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

                        {/* TAB 2: OPERATIONS */}
                        <TabsContent value="operations" className="h-full outline-none">
                            <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 border-blue-500/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden h-full flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                                    <div>
                                        <CardTitle className="text-white flex items-center gap-2"><Clock className="h-5 w-5 text-blue-500" /> Operational Details</CardTitle>
                                        <CardDescription>Manage your working hours and institute type.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        {!isEditing && (
                                            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">Edit Operations</Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Institute Type</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.institute_type || ""}
                                                onChange={(e) => setSettings({ ...settings, institute_type: e.target.value })}
                                                placeholder="e.g. Solution, School, College"
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Founded Year</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.founded_year || ""}
                                                onChange={(e) => setSettings({ ...settings, founded_year: e.target.value })}
                                                placeholder="2015"
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Opening Time</Label>
                                                <Input
                                                    type="time"
                                                    disabled={!isEditing}
                                                    value={settings?.business_hours_start || "09:00"}
                                                    onChange={(e) => setSettings({ ...settings, business_hours_start: e.target.value })}
                                                    className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Closing Time</Label>
                                                <Input
                                                    type="time"
                                                    disabled={!isEditing}
                                                    value={settings?.business_hours_end || "18:00"}
                                                    onChange={(e) => setSettings({ ...settings, business_hours_end: e.target.value })}
                                                    className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-slate-300">Brochure / Prospectus URL</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.brochure_url || ""}
                                                onChange={(e) => setSettings({ ...settings, brochure_url: e.target.value })}
                                                placeholder="https://drive.google.com/..."
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                            <Button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-slate-200 min-w-[140px]">
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                                {saving ? "Saving..." : "Save Changes"}
                                            </Button>
                                            <Button onClick={handleCancel} variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 3: SOCIAL */}
                        <TabsContent value="social" className="h-full outline-none">
                            <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 border-pink-500/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden h-full flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                                    <div>
                                        <CardTitle className="text-white flex items-center gap-2"><Share2 className="h-5 w-5 text-pink-500" /> Social Presence</CardTitle>
                                        <CardDescription>Connect your social media accounts.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        {!isEditing && (
                                            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">Edit Socials</Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Instagram URL</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.instagram_url || ""}
                                                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                                placeholder="https://instagram.com/..."
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">YouTube URL</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.youtube_url || ""}
                                                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                                                placeholder="https://youtube.com/@..."
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Facebook URL</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.facebook_url || ""}
                                                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                                                placeholder="https://facebook.com/..."
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">LinkedIn URL</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.linkedin_url || ""}
                                                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                                                placeholder="https://linkedin.com/in/..."
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                            <Button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-slate-200 min-w-[140px]">
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                                {saving ? "Saving..." : "Save Changes"}
                                            </Button>
                                            <Button onClick={handleCancel} variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 4: LEGAL */}
                        <TabsContent value="legal" className="h-full outline-none">
                            <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 border-amber-500/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden h-full flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                                    <div>
                                        <CardTitle className="text-white flex items-center gap-2"><FileText className="h-5 w-5 text-amber-500" /> Legal Information</CardTitle>
                                        <CardDescription>Official business details.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        {!isEditing && (
                                            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">Edit Legal</Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">GSTIN / Tax ID</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings?.gstin || ""}
                                                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                                                placeholder="22AAAAA0000A1Z5"
                                                className="bg-black/20 border-white/10 text-white disabled:opacity-50 font-mono"
                                            />
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                            <Button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-slate-200 min-w-[140px]">
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                                {saving ? "Saving..." : "Save Changes"}
                                            </Button>
                                            <Button onClick={handleCancel} variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 5: INTEGRATIONS */}
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


                    </div>
                </Tabs>
            </div>
        </div>
    )
}
