import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { fulfillOrder } from '@/lib/order-fulfillment'

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe secret key is missing.' }, { status: 500 })
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-01-27.acacia' as any,
    })

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    const bodyText = await req.text()

    let event: Stripe.Event

    if (webhookSecret) {
      const sig = req.headers.get('stripe-signature')
      if (!sig) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
      }
      try {
        event = stripe.webhooks.constructEvent(bodyText, sig, webhookSecret)
      } catch (err: any) {
        console.error('[Stripe Webhook Signature Verification Failed]', err.message)
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
      }
    } else {
      // In development or test mode without webhook secret set yet
      try {
        event = JSON.parse(bodyText) as Stripe.Event
      } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
      }
    }

    // Handle checkout session completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log(`[Stripe Webhook] Processing checkout.session.completed for ${session.id}`)
      await fulfillOrder(session)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Stripe Webhook Handler Error]', err)
    return NextResponse.json({ error: err.message || 'Webhook handler failed' }, { status: 500 })
  }
}
