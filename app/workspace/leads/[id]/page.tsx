import { getLeadById, getLeadChatHistory } from "./actions"
import { notFound } from "next/navigation"
import LeadDetailClient from "./lead-detail-client"

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: PageProps) {
    const { id } = await params

    const lead = await getLeadById(id)

    if (!lead) {
        notFound()
    }

    const chatHistory = await getLeadChatHistory(lead.phone || "")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <LeadDetailClient lead={lead as any} chatHistory={chatHistory as any} />
}
