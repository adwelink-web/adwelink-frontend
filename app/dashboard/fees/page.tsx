import { WalletCards } from "lucide-react"

export default function FeesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center space-y-4">
            <div className="p-4 bg-white/5 rounded-full border border-white/10">
                <WalletCards className="h-12 w-12 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Accountant Agent (Finance AI)</h2>
            <p className="text-slate-400 max-w-md">
                The Accountant Agent is currently in beta testing. Soon it will handle fee collection, invoice reminders, and financial queries.
                <br /><br />
                <span className="text-emerald-400">Status: Coming Soon</span>
            </p>
        </div>
    )
}
