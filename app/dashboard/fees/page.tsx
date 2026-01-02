import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Download, Construction } from "lucide-react"

export default function FeesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Wallet className="h-8 w-8 text-green-500" /> Fee Collection
                    </h2>
                    <p className="text-muted-foreground mt-1">Track payments and manage student dues.</p>
                </div>
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2">
                    <Download className="h-4 w-4" /> Download Report
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-white/10 rounded-lg bg-white/5">
                <div className="p-4 bg-amber-500/10 rounded-full mb-4 animate-pulse">
                    <Construction className="h-10 w-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">Module Under Construction</h3>
                <p className="text-slate-400 mt-2 max-w-sm text-center">
                    The Accounts Agent is currently being trained to handle invoices and payment tracking automatically.
                </p>
            </div>
        </div>
    )
}
