import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: List all customers with aggregate metrics
export async function GET() {
  try {
    const supabase = createAdminClient()

    // 1. Fetch all customers
    const { data: customers, error: custError } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (custError) {
      console.warn('[Admin Customers GET Warning]', custError.message)
      return NextResponse.json({ customers: [] })
    }

    // 2. Fetch all orders & contacts to compute lifetime metrics
    const { data: allOrders } = await supabase
      .from('orders')
      .select('id, customer_email, amount, status, created_at')

    const { data: allContacts } = await supabase
      .from('contacts')
      .select('id, email, service, created_at')

    // Map metrics to each customer
    const enrichedCustomers = (customers || []).map((cust: any) => {
      const emailLower = (cust.email || '').toLowerCase().trim()
      const custOrders = (allOrders || []).filter(
        (o: any) => (o.customer_email || '').toLowerCase().trim() === emailLower
      )
      const custContacts = (allContacts || []).filter(
        (c: any) => (c.email || '').toLowerCase().trim() === emailLower
      )

      const totalSpent = custOrders
        .filter((o: any) => o.status === 'confirmed' || o.status === 'paid' || o.status === 'completed')
        .reduce((sum: number, o: any) => sum + (Number(o.amount) || 0), 0)

      return {
        ...cust,
        ordersCount: custOrders.length,
        contactsCount: custContacts.length,
        totalSpent,
        lastActive: custOrders[0]?.created_at || custContacts[0]?.created_at || cust.created_at,
      }
    })

    return NextResponse.json({ customers: enrichedCustomers })
  } catch (err: any) {
    console.error('[Admin Customers GET Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: Create a customer
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

    const { data, error } = await supabase
      .from('customers')
      .insert({
        full_name: fullName,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        address: address || null,
        vip_tier: vipTier,
        internal_notes: internalNotes || null,
      })
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, customer: data })
  } catch (err: any) {
    console.error('[Admin Customers POST Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT: Update a customer
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

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    }

    if (fullName !== undefined) updatePayload.full_name = fullName
    if (email !== undefined) updatePayload.email = email.toLowerCase().trim()
    if (phone !== undefined) updatePayload.phone = phone
    if (address !== undefined) updatePayload.address = address
    if (vipTier !== undefined) updatePayload.vip_tier = vipTier
    if (internalNotes !== undefined) updatePayload.internal_notes = internalNotes

    const { data, error } = await supabase
      .from('customers')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, customer: data })
  } catch (err: any) {
    console.error('[Admin Customers PUT Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Delete a customer
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, deletedId: id })
  } catch (err: any) {
    console.error('[Admin Customers DELETE Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
