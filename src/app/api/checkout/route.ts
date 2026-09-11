import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2026-08-26.dahlia' as any, // Cast to any to avoid TS errors with unreleased Stripe versions
})

export async function POST(req: Request) {
  try {
    const { amount, serviceName } = await req.json()

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceName,
              description: 'L\'Atelier Maison Home Services',
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/estimate`,
    })

    return NextResponse.json({ id: session.id })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 })
  }
}
