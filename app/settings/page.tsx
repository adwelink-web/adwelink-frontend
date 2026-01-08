import { getInstituteSettings } from "./actions"
import SettingsClient from "./settings-client"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    // Server Side Fetching (Instant Load)
    const settings = await getInstituteSettings()

    return <SettingsClient initialSettings={settings} />
}
