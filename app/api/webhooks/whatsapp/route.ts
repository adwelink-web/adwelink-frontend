import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env_config'

// Use Service Role for DB Updates (Bypass RLS)
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// 1. GET Request - For Webhook Verification
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    // You should define a verify token in your env, e.g. "adwelink_verify_123"
    // For now, accepting "adwelink" or any strict match
    if (mode === 'subscribe' && token === 'adwelink') {
        console.log("Webhook Verified")
        return new NextResponse(challenge, { status: 200 })
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// 2. POST Request - Event Handling
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const entry = body.entry?.[0]
        const changes = entry?.changes?.[0]
        const value = changes?.value

        if (!value) return NextResponse.json({ message: 'No value' }, { status: 200 })

        // A. Handle Status Updates (Sent, Delivered, Read)
        if (value.statuses && value.statuses.length > 0) {
            const statusUpdate = value.statuses[0]
            const metaId = statusUpdate.id
            const newStatus = statusUpdate.status // 'sent', 'delivered', 'read', 'failed'
            const timestamp = statusUpdate.timestamp

            console.log(`Status Update: ${newStatus} for ID: ${metaId}`)

            // Update DB (Simple update, assumes columns added via SQL Editor)
            let { error } = await supabase
                .from('ai_chat_history')
                .update({ status: newStatus })
                .eq('whatsapp_message_id', metaId)

            if (error) {
                console.error("Webhook DB Update Error (by whatsapp_message_id):", error)
                // Fallback: Try updating by sessionId if whatsapp_message_id is not yet indexed or available
                // This assumes 'from' in the message object corresponds to a sessionId in ai_chat_history
                const sessionId = value.messages?.[0]?.from || value.contacts?.[0]?.wa_id;
                if (sessionId) {
                    console.log(`Attempting fallback update for sessionId: ${sessionId}`);
                    ({ error } = await supabase
                        .from('ai_chat_history')
                        .update({ status: newStatus })
                        .eq('session_id', sessionId)
                        .order('created_at', { ascending: false }) // Update the most recent message for this session
                        .limit(1)
                        .single()); // Ensure only one record is updated
                    if (error) {
                        console.error("Webhook DB Update Error (by sessionId fallback):", error);
                    }
                }
            }
        }

        // B. Handle Incoming Messages (Optional: If not handled by n8n)
        // User said n8n is used, so we might skip this or just log it. 
        // We focus on STATUS for now as requested.

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (e) {
        console.error("Webhook Error", e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
