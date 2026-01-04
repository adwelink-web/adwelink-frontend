import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env_config'

// Initialize Supabase Client with Service Role Key for full access (RLS Bypass)
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone_number, message, session_id } = body

        if (!message || !phone_number) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Get Institute ID from Leads (to find which account to send from)
        // We assume the lead exists. If not, we can't find keys (unless we have a default).
        const { data: leadData, error: leadError } = await supabase
            .from('leads')
            .select('institute_id')
            .eq('phone', phone_number)
            .single()

        if (leadError || !leadData?.institute_id) {
            console.error("Lead/Institute Lookup Failed:", leadError)
            return NextResponse.json({ error: 'Lead not found or missing Institute ID' }, { status: 404 })
        }

        const instituteId = leadData.institute_id

        // 2. Get WhatsApp Credentials from Institutes Table
        const { data: instData, error: instError } = await supabase
            .from('institutes')
            .select('phone_id, access_token')
            .eq('id', instituteId)
            .single()

        if (instError || !instData?.phone_id || !instData?.access_token) {
            console.error("Credentials Lookup Failed:", instError)
            return NextResponse.json({ error: 'WhatsApp Credentials not found for this Institute' }, { status: 403 })
        }

        const { phone_id, access_token } = instData

        // 3. Send Message via Meta API
        const metaUrl = `https://graph.facebook.com/v17.0/${phone_id}/messages`
        const payload = {
            messaging_product: "whatsapp",
            to: phone_number,
            type: "text",
            text: { body: message }
        }

        const metaResponse = await fetch(metaUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const metaResult = await metaResponse.json()

        if (!metaResponse.ok) {
            console.error("Meta API Error:", metaResult)
            return NextResponse.json({ error: 'Meta API Failed', details: metaResult }, { status: 500 })
        }

        // 4. Update Conversation State (PAUSE AI)
        // We enable "Manual Override" -> AI should shut up.
        await supabase
            .from('conversation_states')
            .upsert({
                phone_number: phone_number,
                institute_id: instituteId,
                is_ai_paused: true,
                paused_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'phone_number' })


        // 5. Log to Chat History (So it shows in UI)
        const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        const finalSessionId = (session_id && isValidUUID(session_id)) ? session_id : crypto.randomUUID()

        const { data: chatData, error: chatError } = await supabase
            .from('ai_chat_history')
            .insert([
                {
                    phone_number: phone_number,
                    session_id: finalSessionId,
                    ai_response: message, // Outgoing message
                    user_message: null,
                    intent: 'Manual Override',
                    sentiment: 'Neutral'
                }
            ])
            .select()

        return NextResponse.json({
            success: true,
            meta_id: metaResult.messages?.[0]?.id,
            data: chatData
        }, { status: 200 })

    } catch (e) {
        console.error("System Error:", e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
