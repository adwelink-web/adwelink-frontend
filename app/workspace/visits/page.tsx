import { getScheduledVisits } from "./actions"
import VisitsClient from "./visits-client"

export const dynamic = 'force-dynamic'

export default async function VisitsPage() {
    const visits = await getScheduledVisits()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <VisitsClient visits={visits as any} />
}
