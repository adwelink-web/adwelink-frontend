import { getHomeStats } from "@/app/actions/get-home-stats"
import { HomeClientContainer } from "@/components/home-client-container"

export const dynamic = "force-dynamic"

export default async function AMSHomePage() {
    const stats = await getHomeStats()

    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' }
    const initialDate = now.toLocaleDateString('en-US', options)

    return (
        <HomeClientContainer
            stats={stats}
            initialDate={initialDate}
        />
    )
}
