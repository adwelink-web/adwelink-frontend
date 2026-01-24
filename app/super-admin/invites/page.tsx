"use client"

import { useState, useEffect } from "react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Ticket,
    Plus,
    Trash2,
    RefreshCcw,
    CheckCircle,
    Crown,
    Copy,
    AlertCircle,
    CopyCheck
} from "lucide-react"

export default function InviteCodesPage() {
    const [codes, setCodes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [newCode, setNewCode] = useState("")
    const [maxUses, setMaxUses] = useState(1)
    const [generating, setGenerating] = useState(false)
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const fetchCodes = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/invites/manage')
            const data = await response.json()
            if (response.ok) setCodes(data)
        } catch (err) {
            toast.error("Failed to fetch codes")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCodes()
    }, [])

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCode) return
        setGenerating(true)
        try {
            const response = await fetch('/api/invites/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: newCode, max_uses: maxUses })
            })
            if (response.ok) {
                toast.success("Code generated successfully")
                setNewCode("")
                setMaxUses(1)
                fetchCodes()
            } else {
                toast.error("Code already exists or generation failed")
            }
        } catch (err) {
            toast.error("System error")
        } finally {
            setGenerating(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will invalidate the code.")) return
        try {
            const response = await fetch(`/api/invites/manage?id=${id}`, { method: 'DELETE' })
            if (response.ok) {
                toast.success("Code deleted")
                fetchCodes()
            }
        } catch (err) {
            toast.error("Delete failed")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedCode(text)
        toast.success("Code copied to clipboard")
        setTimeout(() => setCopiedCode(null), 2000)
    }

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative p-6">
            <WorkspaceHeader
                title="Invite Engine"
                subtitle="Generate and manage private access keys for founders"
                icon={Ticket}
                iconColor="text-indigo-400"
                className="mb-8"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Generator Section */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-indigo-400" /> Generate New Key
                        </CardTitle>
                        <CardDescription>Create a unique invite for a new partner</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Access Code</label>
                                <Input
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. INDORE-VIP"
                                    className="bg-white/5 border-white/10 h-12 uppercase font-mono tracking-widest"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Max Uses</label>
                                <Input
                                    type="number"
                                    value={maxUses}
                                    onChange={(e) => setMaxUses(parseInt(e.target.value))}
                                    min={1}
                                    className="bg-white/5 border-white/10 h-12"
                                />
                            </div>
                            <Button disabled={generating || !newCode} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold">
                                {generating ? "Generating..." : "Generate Key"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List Section */}
                <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCcw className="h-4 w-4 text-emerald-400" /> Active Keys
                            </CardTitle>
                            <CardDescription>View and monitor access token usage</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={fetchCodes} disabled={loading}>
                            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                        <div className="space-y-3">
                            {codes.map((code) => (
                                <div key={code.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                            <Crown className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-mono font-bold text-lg tracking-wider text-white">{code.code}</p>
                                                <button onClick={() => copyToClipboard(code.code)} className="text-slate-500 hover:text-white transition-colors">
                                                    {copiedCode === code.code ? <CopyCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Created {new Date(code.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white">{code.usage_count} / {code.max_uses}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Usage</p>
                                        </div>
                                        <Badge variant={code.usage_count >= code.max_uses ? "secondary" : "default"} className={code.usage_count >= code.max_uses ? "bg-red-500/20 text-red-400 border-red-500/20" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"}>
                                            {code.usage_count >= code.max_uses ? "EXHAUSTED" : "ACTIVE"}
                                        </Badge>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(code.id)} className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {codes.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <AlertCircle className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-500">No active invite codes found.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
