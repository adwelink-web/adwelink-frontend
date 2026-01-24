import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env_config'

export async function POST(request: Request) {
    try {
        if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'System Configuration Error' }, { status: 500 })
        }

        const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        const { code } = await request.json()

        if (!code) {
            return NextResponse.json({ error: 'Code required' }, { status: 400 })
        }

        // Search for active code in DB
        try {
            const { data, error } = await supabase
                .from('invite_codes')
                .select('*')
                .eq('code', code.toUpperCase())
                .eq('is_active', true)
                .single()

            if (!error && data) {
                // Check usage limits
                if (data.usage_count >= data.max_uses) {
                    return NextResponse.json({ error: 'Invite code expired' }, { status: 403 })
                }

                // Increment usage
                await supabase
                    .from('invite_codes')
                    .update({ usage_count: data.usage_count + 1 })
                    .eq('id', data.id)

                return NextResponse.json({ success: true, message: 'Access Granted' })
            }
        } catch (dbErr) {
            console.error("Database table error:", dbErr)
            return NextResponse.json({ error: 'System Error: Table missing' }, { status: 500 })
        }

        return NextResponse.json({ error: 'Invalid or inactive invite code' }, { status: 401 })
    } catch (err) {
        console.error('Verify Code Error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
