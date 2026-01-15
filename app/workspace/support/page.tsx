"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    HelpCircle,
    Send,
    Loader2,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    Clock
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SupportPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        priority: "normal"
    })

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            const supabase = createClient()

            // Get current user's institute
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            // Get institute_id from staff_members
            const { data: staffData, error: staffError } = await supabase
                .from("staff_members" as any)
                .select("institute_id")
                .eq("id", user.id)
                .single()

            if (staffError || !(staffData as any)?.institute_id) {
                throw new Error("Could not find your institute. Please contact support.")
            }

            const instituteId = (staffData as any).institute_id

            // Insert support ticket
            const { error: insertError } = await supabase
                .from("support_tickets")
                .insert([{
                    institute_id: instituteId,
                    subject: formData.subject,
                    description: formData.description,
                    priority: formData.priority,
                    status: "open"
                }])

            if (insertError) throw insertError

            setSuccess(true)
            setFormData({ subject: "", description: "", priority: "normal" })

        } catch (err: any) {
            setError(err.message || "Failed to submit ticket")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-[calc(100vh-40px)] w-full overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="flex flex-col gap-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                        <HelpCircle className="h-8 w-8 text-orange-400" /> Support Center
                    </h1>
                    <p className="text-slate-400">Need help? Submit a support ticket and our team will assist you.</p>
                </div>

                {/* Success Message */}
                {success && (
                    <Card className="bg-emerald-500/10 border-emerald-500/30">
                        <CardContent className="py-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Ticket Submitted!</h3>
                                    <p className="text-sm text-emerald-400">Our team will respond within 24 hours.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Support Form */}
                <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-white/10 backdrop-blur-md border-orange-500/20 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-orange-400" />
                            Create Support Ticket
                        </CardTitle>
                        <CardDescription>
                            Describe your issue in detail and we'll get back to you as soon as possible.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Subject */}
                            <div className="space-y-2">
                                <Label className="text-slate-300">Subject *</Label>
                                <Input
                                    placeholder="Brief description of your issue"
                                    value={formData.subject}
                                    onChange={(e) => updateField("subject", e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 focus:border-orange-500/50"
                                />
                            </div>

                            {/* Priority */}
                            <div className="space-y-2">
                                <Label className="text-slate-300">Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => updateField("priority", value)}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                                Low - General question
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="normal">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                Normal - Need assistance
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="high">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                                                High - Affecting work
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="urgent">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                Urgent - System down
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label className="text-slate-300">Description *</Label>
                                <Textarea
                                    placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, etc."
                                    value={formData.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 focus:border-orange-500/50 min-h-[150px]"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading || !formData.subject || !formData.description}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-orange-500/25"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Submit Ticket
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* FAQ/Help Tips */}
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-base flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            Quick Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-400">
                        <div className="flex items-start gap-3">
                            <Badge variant="secondary" className="text-[10px]">1</Badge>
                            <p><strong className="text-white">WhatsApp not working?</strong> Check if your access token is valid in Settings.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Badge variant="secondary" className="text-[10px]">2</Badge>
                            <p><strong className="text-white">AI not responding?</strong> Ensure message limit is not exceeded.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Badge variant="secondary" className="text-[10px]">3</Badge>
                            <p><strong className="text-white">Need to upgrade?</strong> Visit the Billing section for plan upgrades.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <div className="text-center text-sm text-slate-500 pb-8">
                    <p>For urgent issues, you can also reach us at:</p>
                    <p className="text-white font-medium mt-1">support@adwelink.com</p>
                </div>
            </div>
        </div>
    )
}
