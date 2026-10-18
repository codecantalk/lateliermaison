import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: List all contacts
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[Admin Contacts GET Warning]', error.message)
      return NextResponse.json({ contacts: [] })
    }

    return NextResponse.json({ contacts: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT: Update contact status
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    // First try with status and updated_at, fall back to status only if updated_at column does not exist
    let result = await supabase
      .from('contacts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()

    if (result.error && result.error.message.includes('updated_at')) {
      result = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id)
        .select('*')
        .single()
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, contact: result.data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Delete contact inquiry
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, deletedId: id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
