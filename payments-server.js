import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import Stripe from 'stripe'

dotenv.config()

const app = express()
const port = Number(process.env.PAYMENTS_PORT || 4242)
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

if (!process.env.STRIPE_SECRET_KEY) {
  // eslint-disable-next-line no-console
  console.error('Missing STRIPE_SECRET_KEY in environment.')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

app.use(
  cors({
    origin: allowedOrigin,
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/create-checkout-session', async (req, res) => {
  try {
    const {
      registrationId,
      camp,
      athleteName,
      parentName,
      parentEmail,
      parentPhone,
      paymentPlan,
      amount,
      successUrl,
      cancelUrl,
    } = req.body || {}

    if (!registrationId || !parentEmail || !amount || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }

    const amountInCents = Math.round(Number(amount) * 100)

    if (!Number.isFinite(amountInCents) || amountInCents < 50) {
      return res.status(400).json({ error: 'Invalid amount.' })
    }

    const productName = camp === 'skills-clinic-2026' ? 'Skills Clinic 2026' : 'Summer Camp 2026'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: parentEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      metadata: {
        registrationId,
        camp: camp || '',
        athleteName: athleteName || '',
        parentName: parentName || '',
        parentPhone: parentPhone || '',
        paymentPlan: paymentPlan || '',
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${productName} - ${paymentPlan === 'full' ? 'Full Payment' : 'Deposit'}`,
              description: `Athlete: ${athleteName || 'N/A'}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
    })

    return res.json({ checkoutUrl: session.url, id: session.id })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Stripe checkout session error:', error)
    return res.status(500).json({ error: 'Unable to create checkout session.' })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Payments API listening on http://localhost:${port}`)
})
