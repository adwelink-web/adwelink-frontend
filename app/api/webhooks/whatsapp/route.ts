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

            // A. Handle Status Updates (Sent, Delivered, Read)
            // Update DB (Simple update, assumes columns added via SQL Editor)
            const { error: idError, count } = await supabase
                .from('ai_chat_history')
                .update({ status: newStatus })
                .eq('whatsapp_message_id', metaId)
                .select() // Need to select to get count

            if (idError || count === 0) {
                console.log(`Webhook: ID Match Failed for ${metaId}. Trying Fallback strategy...`)

                // FALLBACK: Match by Recipient ID + Time Window (last 24 hours)
                // 'recipient_id' is usually available in 'statuses' object as 'recipient_id' or inside 'message'
                const recipientId = statusUpdate.recipient_id;

                if (recipientId) {
                    // Update the MOST RECENT message sent to this user that matches the status flow
                    // e.g. if we get 'delivered', update the last 'sent' message
                    const { error: fallbackError } = await supabase
                        .from('ai_chat_history')
                        .update({
                            status: newStatus,
                            whatsapp_message_id: metaId // Saving the ID now for future updates on this msg
                        })
                        .eq('phone_number', recipientId) // statuses payload key is 'recipient_id'
                        .order('created_at', { ascending: false })
                        .limit(1)

                    if (fallbackError) {
                        console.error("Webhook: Fallback Update Error:", fallbackError)
                    } else {
                        console.log(`Webhook: Fallback Update Success for ${recipientId}`)
                    }
                } else {
                    console.error("Webhook: No recipient_id found in payload for fallback")
                }
            } else {
                console.log(`Webhook: Updated status to ${newStatus} for ID ${metaId}`)
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
