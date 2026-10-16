import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { fulfillOrder } from '@/lib/order-fulfillment'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id parameter.' }, { status: 400 })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe secret key is not configured.' }, { status: 500 })
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-01-27.acacia' as any,
    })

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 })
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        paid: false,
        status: session.payment_status,
        message: 'Payment has not been completed yet.',
      })
    }

    // Fulfill order idempotently: updates DB and triggers emails
    const result = await fulfillOrder(session)

    return NextResponse.json({
      paid: true,
      order: {
        orderId: result.orderId,
        customerName: result.customerName,
        customerEmail: result.customerEmail,
        customerPhone: result.customerPhone,
        serviceName: result.serviceName,
        amount: result.amount,
        details: result.details,
      },
    })
  } catch (err: any) {
    console.error('[Verify Checkout Error]', err)
    return NextResponse.json({ error: err.message || 'Verification failed.' }, { status: 500 })
  }
}
