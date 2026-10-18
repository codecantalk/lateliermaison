import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getUnifiedCustomers,
  saveCustomerProfile,
  deleteCustomerProfile,
} from '@/lib/customers'

// GET: List all customers with aggregate metrics
export async function GET() {
  try {
    const supabase = createAdminClient()
    const customers = await getUnifiedCustomers(supabase)
    return NextResponse.json({ customers })
  } catch (err: any) {
    console.error('[Admin Customers GET Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: Create a customer profile
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      fullName,
      email,
      phone,
      address,
      vipTier = 'standard',
      internalNotes,
    } = body

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const customer = await saveCustomerProfile(supabase, {
      fullName,
      email,
      phone,
      address,
      vipTier,
      internalNotes,
    })

    return NextResponse.json({ success: true, customer })
  } catch (err: any) {
    console.error('[Admin Customers POST Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT: Update customer profile & VIP tier
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const {
      id,
      fullName,
      email,
      phone,
      address,
      vipTier,
      internalNotes,
    } = body

    if (!id && !email) {
      return NextResponse.json({ error: 'Customer ID or email is required.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const customer = await saveCustomerProfile(supabase, {
      id,
      fullName: fullName || '',
      email,
      phone,
      address,
      vipTier,
      internalNotes,
    })

    return NextResponse.json({ success: true, customer })
  } catch (err: any) {
    console.error('[Admin Customers PUT Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Remove customer profile (soft delete)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const res = await deleteCustomerProfile(supabase, id)

    return NextResponse.json(res)
  } catch (err: any) {
    console.error('[Admin Customers DELETE Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
