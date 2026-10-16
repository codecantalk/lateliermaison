import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe secret key is not configured.' }, { status: 500 })
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-01-27.acacia' as any,
    })

    const body = await req.json()
    const { 
      amount, 
      serviceName, 
      customerName, 
      customerEmail, 
      customerPhone, 
      details, 
      leadId 
    } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'A valid amount is required.' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lateliermaison.com'

    // Create Stripe Checkout Session with rich metadata & customer prefill
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail && customerEmail.includes('@') ? customerEmail : undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceName || "L'Atelier Maison Home Service",
              description: 'Bespoke Luxury Property Care & Artisan Services',
              images: ['https://www.lateliermaison.com/logo.png'],
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        serviceName: serviceName || '',
        leadId: leadId || '',
        detailsJson: JSON.stringify(details || {}).slice(0, 490),
      },
      billing_address_collection: 'auto',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/estimate`,
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err: any) {
    console.error('[Stripe Checkout Error]', err)
    return NextResponse.json({ error: err.message || 'Checkout failed.' }, { status: 500 })
  }
}
