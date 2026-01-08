import { Skeleton } from "@/components/ui/skeleton"


export default function WorkspaceLoading() {
    return (
        <div className="h-full w-full overflow-hidden flex flex-col bg-[#030712] relative">
            {/* Ambient Background - Matches Layout */}
            <div className="fixed top-[-50px] left-[-50px] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative">

                {/* Sticky Header Skeleton */}
                <div className="sticky top-0 z-50 backdrop-blur-xl px-4 md:px-8 py-6 mb-2 border-b border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64 bg-white/10" />
                            <Skeleton className="h-4 w-40 bg-white/5" />
                        </div>
                        <Skeleton className="h-10 w-32 bg-white/10" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6 mt-6">

                    {/* KPI Cards */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="h-4 w-24 bg-white/10" />
                                    <Skeleton className="h-4 w-4 bg-white/10" />
                                </div>
                                <div>
                                    <Skeleton className="h-8 w-16 bg-white/10 mb-2" />
                                    <Skeleton className="h-3 w-32 bg-white/5" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Inquiries List Skeleton */}
                    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                            <Skeleton className="h-6 w-48 bg-white/10" />
                        </div>
                        <div className="p-4 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32 bg-white/10" />
                                            <Skeleton className="h-3 w-24 bg-white/5" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-6 w-20 rounded-full bg-white/5" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
