import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, buildCustomerOrderEmail } from '@/lib/email'

// GET: List all orders
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const supabase = createAdminClient()

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.warn('[Admin Orders GET Warning]', error.message)
      return NextResponse.json({ orders: [] })
    }

    return NextResponse.json({ orders: data || [] })
  } catch (err: any) {
    console.error('[Admin Orders GET Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: Create a new manual / phone booking order in CMS
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      serviceName,
      amount,
      status = 'confirmed',
      details = {},
      internalNotes,
      scheduledDate,
      sendReceiptEmail = false,
    } = body

    if (!customerName || !serviceName) {
      return NextResponse.json({ error: 'Customer name and service name are required.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const parsedAmount = Number(amount) || 0

    // 1. Auto sync or create Customer
    let customerId: string | null = null
    if (customerEmail && customerEmail.includes('@')) {
      try {
        const { data: existingCust } = await supabase
          .from('customers')
          .select('id')
          .eq('email', customerEmail.toLowerCase().trim())
          .maybeSingle()

        if (existingCust?.id) {
          customerId = existingCust.id
          if (customerPhone || address) {
            await supabase.from('customers').update({
              phone: customerPhone || undefined,
              address: address || undefined,
              updated_at: new Date().toISOString(),
            }).eq('id', customerId)
          }
        } else {
          const { data: newCust } = await supabase
            .from('customers')
            .insert({
              full_name: customerName,
              email: customerEmail.toLowerCase().trim(),
              phone: customerPhone || null,
              address: address || null,
              vip_tier: parsedAmount >= 1000 ? 'estate_elite' : parsedAmount >= 500 ? 'vip' : 'standard',
            })
            .select('id')
            .maybeSingle()
          customerId = newCust?.id || null
        }
      } catch (custErr) {
        console.warn('[Create Order] Customer sync warning:', custErr)
      }
    }

    // 2. Generate manual reference ID if no Stripe session
    const manualRef = `MANUAL-${Date.now().toString(36).toUpperCase()}`

    // 3. Insert into orders table
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: manualRef,
        customer_name: customerName,
        customer_email: customerEmail || '',
        customer_phone: customerPhone || null,
        address: address || null,
        service_name: serviceName,
        amount: parsedAmount,
        currency: 'usd',
        status: status,
        details: details,
        internal_notes: internalNotes || null,
        scheduled_date: scheduledDate || null,
        customer_id: customerId,
      })
      .select('*')
      .single()

    if (orderErr) {
      console.error('[Create Order DB Error]', orderErr)
      return NextResponse.json({ error: orderErr.message }, { status: 500 })
    }

    // 4. Optionally dispatch ZeptoMail email receipt
    if (sendReceiptEmail && customerEmail && customerEmail.includes('@')) {
      try {
        const emailHtml = buildCustomerOrderEmail({
          customerName,
          orderId: manualRef,
          serviceName,
          amount: parsedAmount,
          details,
          date: scheduledDate ? new Date(scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : undefined,
        })

        await sendEmail({
          to: customerEmail,
          toName: customerName,
          subject: `Reservation Confirmed: ${serviceName} (Ref: ${manualRef})`,
          html: emailHtml,
          fromType: 'order',
        })
      } catch (emailErr) {
        console.error('[Create Order Email Error]', emailErr)
      }
    }

    return NextResponse.json({ success: true, order: newOrder })
  } catch (err: any) {
    console.error('[Admin Orders POST Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT: Update an order
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const {
      id,
      customerName,
      customerEmail,
      customerPhone,
      address,
      serviceName,
      amount,
      status,
      details,
      internalNotes,
      scheduledDate,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    }

    if (customerName !== undefined) updatePayload.customer_name = customerName
    if (customerEmail !== undefined) updatePayload.customer_email = customerEmail
    if (customerPhone !== undefined) updatePayload.customer_phone = customerPhone
    if (address !== undefined) updatePayload.address = address
    if (serviceName !== undefined) updatePayload.service_name = serviceName
    if (amount !== undefined) updatePayload.amount = Number(amount)
    if (status !== undefined) updatePayload.status = status
    if (details !== undefined) updatePayload.details = details
    if (internalNotes !== undefined) updatePayload.internal_notes = internalNotes
    if (scheduledDate !== undefined) updatePayload.scheduled_date = scheduledDate

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data })
  } catch (err: any) {
    console.error('[Admin Orders PUT Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Delete an order
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, deletedId: id })
  } catch (err: any) {
    console.error('[Admin Orders DELETE Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
