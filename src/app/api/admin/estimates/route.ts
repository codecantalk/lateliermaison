import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: List all estimates / leads
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[Admin Estimates GET Warning]', error.message)
      return NextResponse.json({ estimates: [] })
    }

    return NextResponse.json({ estimates: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT: Update estimate status or notes
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
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()

    if (result.error && result.error.message.includes('updated_at')) {
      result = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
        .select('*')
        .single()
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, estimate: result.data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Delete an estimate
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('leads')
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
