import { Construction } from "lucide-react"

export default function AssessmentPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center space-y-4">
            <div className="p-4 bg-white/5 rounded-full border border-white/10">
                <Construction className="h-12 w-12 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Teacher Agent (Tutor AI)</h2>
            <p className="text-slate-400 max-w-md">
                Our engineering team is currently training the Teacher Agent to handle student doubts and academic queries.
                <br /><br />
                <span className="text-purple-400">Status: Coming Soon</span>
            </p>
        </div>
    )
}
