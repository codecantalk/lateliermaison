import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, buildCustomerOrderEmail, buildInternalOrderEmail } from '@/lib/email'
import Stripe from 'stripe'

export interface FulfillmentResult {
  success: boolean
  alreadyProcessed?: boolean
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  serviceName: string
  amount: number
  date?: string
  details?: any
}

// In-memory set to prevent double fulfillment within the same Node process lifecycle
const processedSessions = new Set<string>()

export async function fulfillOrder(session: Stripe.Checkout.Session): Promise<FulfillmentResult> {
  const sessionId = session.id
  const supabase = createAdminClient()

  const customerEmail = session.customer_details?.email || session.metadata?.customerEmail || (typeof session.customer_email === 'string' ? session.customer_email : '')
  const customerName = session.customer_details?.name || session.metadata?.customerName || 'Valued Client'
  const customerPhone = session.customer_details?.phone || session.metadata?.customerPhone || ''
  const serviceName = session.metadata?.serviceName || "L'Atelier Maison Home Service"
  const amount = (session.amount_total || 0) / 100
  const leadId = session.metadata?.leadId

  let details: any = {}
  if (session.metadata?.detailsJson) {
    try {
      details = JSON.parse(session.metadata.detailsJson)
    } catch {
      details = { note: session.metadata.detailsJson }
    }
  }

  // 1. Idempotency Check in memory
  if (processedSessions.has(sessionId)) {
    return {
      success: true,
      alreadyProcessed: true,
      orderId: sessionId,
      customerName,
      customerEmail,
      customerPhone,
      serviceName,
      amount,
      details,
    }
  }

  // 2. Idempotency Check in database
  try {
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id, stripe_session_id, status')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()

    if (existingOrder && existingOrder.status === 'paid') {
      processedSessions.add(sessionId)
      return {
        success: true,
        alreadyProcessed: true,
        orderId: sessionId,
        customerName,
        customerEmail,
        customerPhone,
        serviceName,
        amount,
        details,
      }
    }
  } catch (err) {
    // If table doesn't exist yet, we will continue
    console.warn('[FulfillOrder] Orders table check skipped:', err)
  }

  // Mark in memory early to prevent concurrent race conditions
  processedSessions.add(sessionId)

  // 3. Auto-sync customer profile
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
        // Update phone if provided
        if (customerPhone) {
          await supabase.from('customers').update({ phone: customerPhone, updated_at: new Date().toISOString() }).eq('id', customerId)
        }
      } else {
        const { data: newCust } = await supabase
          .from('customers')
          .insert({
            full_name: customerName,
            email: customerEmail.toLowerCase().trim(),
            phone: customerPhone || null,
            vip_tier: amount >= 1000 ? 'estate_elite' : amount >= 500 ? 'vip' : 'standard',
          })
          .select('id')
          .maybeSingle()
        customerId = newCust?.id || null
      }
    } catch (custErr) {
      console.warn('[FulfillOrder] Customer auto-sync skipped (table may not exist yet):', custErr)
    }
  }

  // 4. Save into orders table
  try {
    await supabase.from('orders').insert({
      stripe_session_id: sessionId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      service_name: serviceName,
      amount: amount,
      currency: session.currency || 'usd',
      status: 'confirmed',
      details: details,
      lead_id: leadId || null,
      customer_id: customerId || null,
    })
  } catch (dbErr) {
    console.warn('[FulfillOrder] Could not insert into orders table (check if table exists):', dbErr)
  }

  // 4. If lead exists, update lead to paid
  if (leadId) {
    try {
      await supabase
        .from('leads')
        .update({ status: 'paid', total_price: amount })
        .eq('id', leadId)
    } catch (leadErr) {
      console.warn('[FulfillOrder] Could not update lead status:', leadErr)
    }
  }

  // 5. Send Customer Confirmation Email (Receipt)
  if (customerEmail && customerEmail.includes('@')) {
    try {
      const customerHtml = buildCustomerOrderEmail({
        customerName,
        orderId: sessionId.slice(-8).toUpperCase(),
        serviceName,
        amount,
        details,
      })

      await sendEmail({
        to: customerEmail,
        toName: customerName,
        subject: `Your Booking is Confirmed — ${serviceName} (Ref: ${sessionId.slice(-8).toUpperCase()})`,
        html: customerHtml,
        fromType: 'order',
      })
    } catch (emailErr) {
      console.error('[FulfillOrder] Failed to send customer receipt email:', emailErr)
    }
  }

  // 6. Send Internal Alert to order@lateliermaison.com
  try {
    const adminEmail = process.env.EMAIL_ORDER || 'order@lateliermaison.com'
    const internalHtml = buildInternalOrderEmail({
      orderId: sessionId,
      customerName,
      customerEmail,
      customerPhone,
      serviceName,
      amount,
      details,
    })

    await sendEmail({
      to: adminEmail,
      toName: "L'Atelier Maison Order Desk",
      subject: `✦ [NEW PAID ORDER] $${amount.toFixed(2)} — ${customerName} (${serviceName})`,
      html: internalHtml,
      replyTo: customerEmail || undefined,
      fromType: 'order',
    })
  } catch (adminEmailErr) {
    console.error('[FulfillOrder] Failed to send admin alert email:', adminEmailErr)
  }

  return {
    success: true,
    alreadyProcessed: false,
    orderId: sessionId,
    customerName,
    customerEmail,
    customerPhone,
    serviceName,
    amount,
    details,
  }
}
