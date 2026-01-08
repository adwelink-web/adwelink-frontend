import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env_config'

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone_number } = body

        if (!phone_number) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
        }

        // Set is_ai_paused = false
        const { error } = await supabase
            .from('conversation_states')
            .update({
                is_ai_paused: false,
                resumed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('phone_number', phone_number)
            .select()

        if (error) {
            console.error('Supabase Update Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'AI Resumed' }, { status: 200 })

    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
