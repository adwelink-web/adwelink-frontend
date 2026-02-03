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
        <div className="h-full w-full overflow-hidden flex flex-col relative p-2 md:p-8">
            {/* Background Gradients - Matching Leads Page */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            {/* Header Section */}
            <div className="flex-none z-50 mb-4 max-w-7xl mx-auto w-full">
                <WorkspaceHeader
                    title="Inbound Requests"
                    subtitle="View waitlist signups and product feedback"
                    icon={Inbox}
                    iconColor="text-primary"
                    badge={
                        <span className="flex items-center space-x-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-normal whitespace-nowrap">
                            <span className="text-muted-foreground">{waitlist.length + feedback.length} total</span>
                        </span>
                    }
                />
            </div>

            {/* Content Section - Fills remaining height */}
            <div className="flex-1 min-h-0 max-w-7xl mx-auto w-full flex flex-col z-10">
                <InboundClient waitlist={waitlist} feedback={feedback} />
            </div>
        </div>
    )
}
