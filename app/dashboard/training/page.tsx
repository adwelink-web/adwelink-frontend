import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Upload, FileText, Trash2 } from "lucide-react"

export default function TrainingPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-emerald-500" /> Knowledge Base
                    </h2>
                    <p className="text-muted-foreground mt-1">Upload documents to train Aditi&apos;s brain.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Upload className="h-4 w-4" /> Upload Document
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Upload Area */}
                <Card className="col-span-1 border-dashed border-2 border-white/20 bg-white/5 flex flex-col items-center justify-center p-6 h-[300px] cursor-pointer hover:bg-white/10 transition">
                    <Upload className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-200">Drop files here</h3>
                    <p className="text-xs text-slate-500 mt-2 text-center">PDF, DOCX, TXT supported.<br />Max 10MB per file.</p>
                </Card>

                {/* Existing Files */}
                <Card className="col-span-2 bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Active Resources</CardTitle>
                        <CardDescription>Aditi uses these to answer student queries.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-md bg-white/5 hover:bg-white/10 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded">
                                        <FileText className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">Brochure_2026.pdf</p>
                                        <p className="text-[10px] text-slate-500">2.4 MB • Uploaded yesterday</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-400">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
