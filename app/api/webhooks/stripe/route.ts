import { HandleCheckoutSessionCompleted } from '@/lib/stripe/HandleCheckoutSessionCompleted'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature') as string

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )

    switch (event.type) {
      case 'checkout.session.completed':
        HandleCheckoutSessionCompleted(event.data.object)
        break;
      default:
        break
    }
    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    console.log('Webhook signature verification failed.', error)
    return new NextResponse('Webhook signature verification failed.', {
      status: 400,
    })
  }
}
