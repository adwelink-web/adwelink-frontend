import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="h-screen w-full bg-[#0B0F19] p-4 flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-slate-800" />
                    <Skeleton className="h-4 w-[200px] bg-slate-800" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <Skeleton className="h-[200px] rounded-xl bg-slate-800/50" />
                <Skeleton className="h-[200px] rounded-xl bg-slate-800/50" />
                <Skeleton className="h-[200px] rounded-xl bg-slate-800/50" />
            </div>
            <div className="space-y-4 pt-8">
                <Skeleton className="h-[400px] rounded-xl bg-slate-800/30" />
            </div>
        </div>
    )
}
