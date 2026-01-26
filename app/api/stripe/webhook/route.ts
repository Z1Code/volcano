import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { generateTicketCode } from '@/lib/qr'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const metadata = session.metadata
    if (!metadata) {
      return NextResponse.json({ error: 'No metadata' }, { status: 400 })
    }

    const { ticketTypeId, eventId, userId, quantity, pricePerTicket } = metadata
    const quantityNum = parseInt(quantity, 10)
    const price = parseFloat(pricePerTicket)

    const supabase = await createServiceClient()

    // Update order status
    await (supabase as any)
      .from('orders')
      .update({
        status: 'completed',
        stripe_payment_intent: session.payment_intent as string,
      })
      .eq('stripe_session_id', session.id)

    // Create tickets
    const tickets = []
    for (let i = 0; i < quantityNum; i++) {
      tickets.push({
        user_id: userId,
        ticket_type_id: ticketTypeId,
        event_id: eventId,
        qr_code: generateTicketCode(),
        status: 'valid',
        stripe_payment_id: session.payment_intent as string,
        price_paid: price,
      })
    }

    const { error: ticketError } = await (supabase as any).from('tickets').insert(tickets)

    if (ticketError) {
      console.error('Error creating tickets:', ticketError)
      return NextResponse.json({ error: 'Error creating tickets' }, { status: 500 })
    }

    // Update quantity sold
    const { error: updateError } = await (supabase as any).rpc('increment_tickets_sold', {
      ticket_type_id: ticketTypeId,
      amount: quantityNum,
    })

    if (updateError) {
      console.error('Error updating quantity:', updateError)
    }
  }

  return NextResponse.json({ received: true })
}

