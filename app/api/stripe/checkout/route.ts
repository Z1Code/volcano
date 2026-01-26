import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { ticketTypeId, quantity } = body

  if (!ticketTypeId || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Get ticket type details
  const { data: ticketType, error: ticketError } = await (supabase as any)
    .from('ticket_types')
    .select(`
      *,
      event:events (*)
    `)
    .eq('id', ticketTypeId)
    .single()

  if (ticketError || !ticketType) {
    return NextResponse.json({ error: 'Ticket type not found' }, { status: 404 })
  }

  const tt = ticketType as any
  // Check availability
  const available = tt.quantity_available - tt.quantity_sold
  if (available < quantity) {
    return NextResponse.json({ error: 'Not enough tickets available' }, { status: 400 })
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Create Stripe checkout session
  const origin = request.headers.get('origin') || 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tt.event.title} - ${tt.name}`,
              description: tt.description || undefined,
            },
            unit_amount: Math.round(tt.price * 100), // Convert to cents
          },
          quantity,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/events/${tt.event_id}`,
      metadata: {
        ticketTypeId,
        eventId: tt.event_id,
        userId: user.id,
        quantity: quantity.toString(),
        pricePerTicket: tt.price.toString(),
      },
    })

    // Create pending order
    await (supabase as any).from('orders').insert({
      user_id: user.id,
      stripe_session_id: session.id,
      total: tt.price * quantity,
      status: 'pending',
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
