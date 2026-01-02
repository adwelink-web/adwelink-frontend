import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Shield } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Settings className="h-8 w-8 text-slate-400" /> Global Settings
                    </h2>
                    <p className="text-muted-foreground mt-1">Manage institute profile and system-wide configurations.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Institute Profile</CardTitle>
                        <CardDescription>This information is visible to students.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-200">Institute Name</Label>
                                <Input defaultValue="Adwelink Academy" className="bg-black/20 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Support Phone</Label>
                                <Input defaultValue="+91 98765 43210" className="bg-black/20 border-white/10 text-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-200">Address</Label>
                            <Input defaultValue="123, Tech Park, Bangalore" className="bg-black/20 border-white/10 text-white" />
                        </div>
                        <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white">Save Changes</Button>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 opacity-60">
                    <CardHeader>
                        <CardTitle className="text-slate-200 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-emerald-500" /> Admin Permissions
                        </CardTitle>
                        <CardDescription>Manage who can access this dashboard. (Coming Soon)</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
