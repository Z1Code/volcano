import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  }
  return stripeInstance
}

export const stripe = {
  get checkout() {
    return getStripe().checkout
  },
  get webhooks() {
    return getStripe().webhooks
  },
}

export async function createCheckoutSession({
  ticketTypeId,
  eventId,
  quantity,
  userId,
  successUrl,
  cancelUrl,
}: {
  ticketTypeId: string
  eventId: string
  quantity: number
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Event Ticket',
          },
          unit_amount: 0, // Will be set dynamically
        },
        quantity,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      ticketTypeId,
      eventId,
      userId,
      quantity: quantity.toString(),
    },
  })

  return session
}
