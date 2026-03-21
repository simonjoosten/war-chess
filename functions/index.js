const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Stripe = require('stripe')

admin.initializeApp()

// Initialize Stripe with your secret key (set via Firebase config)
// Run: firebase functions:config:set stripe.secret_key="sk_live_xxx" stripe.webhook_secret="whsec_xxx"
const stripe = new Stripe(functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY)

// War Bucks packages
const PACKAGES = {
  'warbucks_100': { amount: 100, price: 99, name: '100 War Bucks' },      // €0.99
  'warbucks_500': { amount: 500, price: 299, name: '500 War Bucks' },     // €2.99
  'warbucks_1200': { amount: 1200, price: 499, name: '1200 War Bucks' },  // €4.99
  'warbucks_3000': { amount: 3000, price: 999, name: '3000 War Bucks' },  // €9.99
  'warbucks_7000': { amount: 7000, price: 1999, name: '7000 War Bucks' }, // €19.99
}

// Create a Stripe Checkout Session
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in')
  }

  const { packageId } = data
  const package_ = PACKAGES[packageId]

  if (!package_) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid package')
  }

  const userId = context.auth.uid

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal', 'bancontact'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: package_.name,
            description: `Get ${package_.amount} War Bucks for War Chess`,
          },
          unit_amount: package_.price, // Price in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${data.origin || 'https://war-chess.web.app'}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin || 'https://war-chess.web.app'}/?payment=cancelled`,
      metadata: {
        userId: userId,
        packageId: packageId,
        warBucksAmount: package_.amount.toString(),
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new functions.https.HttpsError('internal', 'Could not create checkout session')
  }
})

// Stripe Webhook to handle successful payments
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = functions.config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const userId = session.metadata.userId
    const warBucksAmount = parseInt(session.metadata.warBucksAmount, 10)

    if (userId && warBucksAmount) {
      try {
        // Get user's current War Bucks
        const userRef = admin.firestore().collection('users').doc(userId)
        const userDoc = await userRef.get()

        if (userDoc.exists) {
          const currentWarBucks = userDoc.data().warBucks || 0
          const newWarBucks = currentWarBucks + warBucksAmount

          // Update user's War Bucks
          await userRef.update({
            warBucks: newWarBucks,
            lastPurchase: admin.firestore.FieldValue.serverTimestamp(),
          })

          // Log the purchase
          await admin.firestore().collection('purchases').add({
            userId: userId,
            sessionId: session.id,
            packageId: session.metadata.packageId,
            warBucksAmount: warBucksAmount,
            amountPaid: session.amount_total,
            currency: session.currency,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          })

          console.log(`Added ${warBucksAmount} War Bucks to user ${userId}`)
        }
      } catch (error) {
        console.error('Error updating War Bucks:', error)
        return res.status(500).send('Error updating War Bucks')
      }
    }
  }

  res.json({ received: true })
})

// Verify a payment was successful (called after redirect)
exports.verifyPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in')
  }

  const { sessionId } = data

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid' && session.metadata.userId === context.auth.uid) {
      return {
        success: true,
        warBucksAmount: parseInt(session.metadata.warBucksAmount, 10),
      }
    }

    return { success: false }
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw new functions.https.HttpsError('internal', 'Could not verify payment')
  }
})
