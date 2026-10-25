import Stripe from 'stripe';

export type CheckoutItem = {
  name: string
  price: number
  quantity: number
}

const SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? ''
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? ''
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173'

if (!SECRET_KEY) {
  throw new Error('Stripe is not configured. Copy .env.example to .env and fill in STRIPE_SECRET_KEY.')
}

const stripe = new Stripe(SECRET_KEY, { timeout: 10_000 });

export async function createHostedCheckout(orderId: string, items: CheckoutItem[]) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'sek',
        unit_amount: Math.round(item.price * 100),
        product_data: { name: item.name }
      },
      locale: 'sv',
    })),
    client_reference_id: orderId,
    success_url: `${CLIENT_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CLIENT_URL}/`,
    expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
  });

  return { sessionId: session.id, url: session.url }
};


export const verifyWebhook = (rawBody: Buffer, signature: string): Stripe.Event => {
  if (!WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is missing in .env. Copy the whsec_... that `stripe listen` prints.')
  }
  return stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
};