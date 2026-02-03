import { createAdminClient } from "@/lib/supabase-server"
import { Inbox } from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { InboundClient } from "./inbound-client"

export default async function InboundPage() {
    const supabase = createAdminClient()

    const [waitlistResults, feedbackResults] = await Promise.all([
        supabase.from('waitlist').select('*').order('created_at', { ascending: false }),
        supabase.from('feedback').select('*').order('created_at', { ascending: false })
    ])

    const waitlist = waitlistResults.data || []
    const feedback = feedbackResults.data || []

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            {/* Main Container - No Scroll here, fixed height */}
            <div className="flex-1 w-full h-full relative z-10 flex flex-col">
                {/* Sticky Blurred Header Section */}
                <div className="flex-none z-50 backdrop-blur-xl px-2 md:px-8 py-1 md:py-4">
                    <WorkspaceHeader
                        title="Inbound Requests"
                        subtitle="View waitlist signups and product feedback"
                        icon={Inbox}
                        iconColor="text-primary"
                        className="max-w-7xl mx-auto"
                        badge={
                            <span className="flex items-center space-x-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-normal whitespace-nowrap">
                                <span className="text-muted-foreground">{waitlist.length + feedback.length} total</span>
                            </span>
                        }
                    />
                </div>

                {/* Content Section - Full height, flexible */}
                <div className="flex-1 min-h-0 px-2 md:px-8 pb-2 md:pb-8 max-w-7xl mx-auto w-full">
                    <InboundClient waitlist={waitlist} feedback={feedback} />
                </div>
            </div>
        </div>
    )
}
