import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
    return (
        <div className="h-full w-full bg-[#030712] relative overflow-hidden flex flex-col font-sans">
            {/* 🌌 Background VFX Matches Main Page */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-violet-900/10 via-[#030712] to-[#030712] pointer-events-none" />
            <div className="absolute -top-[200px] left-[20%] w-[600px] h-[600px] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />

            {/* 🚀 COMPACT SKELETON INTERFACE Matches Command Deck */}
            <div className="relative z-10 flex-1 flex flex-col p-4 lg:p-6 h-full max-w-[1600px] mx-auto w-full min-h-0">

                {/* Header Match */}
                <div className="flex justify-between items-end mb-4 shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Skeleton className="h-1.5 w-1.5 rounded-full bg-emerald-500/20" />
                            <Skeleton className="h-2 w-20 bg-white/5" />
                        </div>
                        <Skeleton className="h-8 w-48 bg-white/10" />
                    </div>
                </div>

                {/* Main Grid Match */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">

                    {/* COL 1: Neural Core Skeleton */}
                    <div className="lg:col-span-4 flex flex-col h-full min-h-0">
                        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-24 bg-white/10" />
                                <Skeleton className="h-5 w-16 rounded bg-emerald-500/10" />
                            </div>

                            {/* Center Visual */}
                            <div className="flex-1 flex items-center justify-center">
                                <div className="h-32 w-32 rounded-full border border-white/5 flex items-center justify-center relative">
                                    <Skeleton className="h-20 w-20 rounded-full bg-white/5" />
                                </div>
                            </div>

                            {/* Footer Stats */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
                                    <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
                                </div>
                                <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
                            </div>
                        </div>
                    </div>

                    {/* COL 2: Metrics & Feed Skeleton */}
                    <div className="lg:col-span-8 flex flex-col gap-4 h-full min-h-0">
                        {/* 1. HUD Strip Match */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[120px] shrink-0">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-8 w-8 rounded-md bg-white/5" />
                                        <Skeleton className="h-4 w-4 bg-white/5" />
                                    </div>
                                    <div>
                                        <Skeleton className="h-8 w-16 mb-2 bg-white/10" />
                                        <Skeleton className="h-3 w-24 bg-white/5" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. Log Skeleton */}
                        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                            <div className="border-b border-white/5 py-2 px-4">
                                <Skeleton className="h-3 w-32 bg-white/5" />
                            </div>
                            <div className="flex-1 p-4 space-y-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <Skeleton className="h-2 w-10 bg-white/5" />
                                        <Skeleton className="h-2 w-full bg-white/5 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
