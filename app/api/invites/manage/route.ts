import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env_config'

export async function POST(request: Request) {
    try {
        const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        const { code, max_uses } = await request.json()

        if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

        const { data, error } = await supabase
            .from('invite_codes')
            .insert([{
                code: code.toUpperCase(),
                max_uses: max_uses || 1,
                is_active: true
            }])
            .select()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (err) {
        return NextResponse.json({ error: 'Generation Failed' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        const { data, error } = await supabase
            .from('invite_codes')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ error: 'Fetch Failed' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        const { error } = await supabase.from('invite_codes').delete().eq('id', id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Delete Failed' }, { status: 500 })
    }
}
