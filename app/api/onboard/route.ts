
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env_config'

export async function POST(request: Request) {
    try {
        const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        const body = await request.json()
        const {
            admin_email, // Login Email
            name,
            director_name,
            email, // Institute Public Email
            website,
            city,
            address,
            google_map_link,
            helpline_number,
            phone_id,
            access_token,
            current_plan,
            message_limit
        } = body

        if (!admin_email || !name) {
            return NextResponse.json({ error: 'Admin Email and Institute Name are required' }, { status: 400 })
        }

        // 1. Invite User (Creates Auth User + Sends Magic Link)
        const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(admin_email)

        if (authError) {
            console.error("Auth Error:", authError)
            return NextResponse.json({ error: `User Creation Failed: ${authError.message}` }, { status: 400 })
        }

        const userId = authData.user.id

        // 2. Calculate Limits based on plan
        const planLimits = {
            trial: { message: 50, lead: 50 },
            starter: { message: 500, lead: 500 },
            growth: { message: 1000, lead: 1000 },
            domination: { message: 5000, lead: 5000 }
        }

        const limits = planLimits[current_plan as keyof typeof planLimits] || planLimits.trial

        // 3. Create Institute Linked to User
        const { data: instituteData, error: instituteError } = await supabase
            .from('institutes')
            .insert([{
                owner_id: userId,
                name,
                director_name,
                email, // Public Email
                website,
                city,
                address,
                google_map_link,
                helpline_number,
                phone_id,
                access_token,
                current_plan,
                message_limit: limits.message,
                lead_limit: limits.lead,
                messages_used: 0,
                leads_used: 0
            }])
            .select() // Return the created record

        if (instituteError) {
            console.error("Institute Error:", instituteError)
            return NextResponse.json({ error: `Institute Creation Failed: ${instituteError.message}` }, { status: 400 })
        }

        return NextResponse.json({ success: true, institute: instituteData[0], user_id: userId })

    } catch (err: any) {
        console.error("System Error:", err)
        return NextResponse.json({ error: `System Error: ${err.message}` }, { status: 500 })
    }
}
