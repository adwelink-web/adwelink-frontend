import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env_config'

// Initialize Supabase Client with Service Role Key for full access (RLS Bypass)
// Initialize outside but validation happens inside or we move it inside to be safe against runtime env issues
// const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function POST(request: Request) {
    let supabase;
    try {
        if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing Supabase Environment Variables")
        }
        supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    } catch {
        return NextResponse.json({ error: 'Server Configuration Error' }, { status: 500 })
    }

    try {
        const body = await request.json()
        console.log("INCOMING BODY:", body)
        const { phone_number, message, session_id } = body

        if (!message || !phone_number) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Get Institute ID from Leads
        const { data: leadData, error: leadError } = await supabase
            .from('leads')
            .select('institute_id')
            .eq('phone', phone_number)
            .single()

        if (leadError || !leadData?.institute_id) {
            // Fallback: Check if we can find any lead with this phone, maybe not 'active'? 
            // For now, strict check.
            return NextResponse.json({ error: 'Lead not found or missing Institute ID' }, { status: 404 })
        }

        const instituteId = leadData.institute_id

        // 2. Get WhatsApp Credentials
        const { data: instData, error: instError } = await supabase
            .from('institutes')
            .select('phone_id, access_token')
            .eq('id', instituteId)
            .single()

        if (instError || !instData?.phone_id || !instData?.access_token) {
            return NextResponse.json({ error: 'WhatsApp Credentials not found' }, { status: 403 })
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

        const metaRaw = await metaResponse.text()
        console.log("META STATUS:", metaResponse.status)
        console.log("RAW META RESPONSE:", metaRaw)

        let metaResult;
        try {
            metaResult = JSON.parse(metaRaw)
        } catch {
            metaResult = { error: "Failed to parse JSON", raw: metaRaw }
        }

        if (!metaResponse.ok) {
            return NextResponse.json({ error: 'Meta API Failed', details: metaResult }, { status: 500 })
        }

        // 4. Update Conversation State
        await supabase
            .from('conversation_states')
            .upsert({
                phone_number: phone_number,
                institute_id: instituteId,
                is_ai_paused: true,
                paused_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'phone_number' })


        // 5. Log to Chat History
        // Ensure session_id is a valid UUID, otherwise generate one
        const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        const finalSessionId = (session_id && isValidUUID(session_id)) ? session_id : crypto.randomUUID()

        const metaId = metaResult.messages?.[0]?.id

        const { data: chatData, error: chatError } = await supabase
            .from('ai_chat_history')
            .insert([
                {
                    phone_number: phone_number,
                    session_id: finalSessionId,
                    institute_id: instituteId, // Added institute_id which is likely required
                    ai_response: message,
                    user_message: "", // REQUIRED field (cannot be null)
                    role: 'assistant',
                    intent: 'Manual Override',
                    sentiment: 'Neutral',
                    status: 'sent',
                    whatsapp_message_id: metaId,
                    // Storing extra metadata in JSONB column 'message_meta' instead of non-existent columns
                    message_meta: {
                        whatsapp_message_id: metaId,
                        status: 'sent',
                        source: 'dashboard_manual'
                    }
                }
            ])
            .select()

        if (chatError) {
            // Log error internally but don't expose details to client
            console.error("Chat History Insert Error:", chatError)
        }

        return NextResponse.json({
            success: true,
            meta_id: metaResult.messages?.[0]?.id,
            data: chatData
        }, { status: 200 })

    } catch (e: unknown) {
        console.error("Chat Send Error:", e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
