const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { publishPaymentSuccess } = require('../publishers/paymentPublisher');

exports.handleStripeWebhook = async (req, res) => {
  console.log("Webhook received"); // Log when the webhook is received

  const sig = req.headers['stripe-signature'];
  console.log("Stripe signature:", sig); // Log the Stripe signature to verify it's being received

  try {
    console.log("Raw body received:", req.body.toString()); // Log the raw body to check if it's correctly parsed as raw JSON

    // Validate the event by using req.body (should be raw) and the Stripe signature
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("Event type:", event.type); // Log the event type

    // Handle different event types
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful:', paymentIntent.id);

      // Publish the successful payment event to RabbitMQ
      await publishPaymentSuccess({
        status: 'success',
        id: paymentIntent.id,
        amount: paymentIntent.amount,
      });
      console.log("Published payment success event to RabbitMQ");
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object;
      console.log('Charge was successful:', charge.id);

      // Publish the successful charge event to RabbitMQ
      await publishPaymentSuccess({
        status: 'success',
        id: charge.id,
        amount: charge.amount,
      });
      console.log("Published charge success event to RabbitMQ");
    } else if (event.type === 'payment_intent.created') {
      console.log('PaymentIntent created:', event.data.object.id);
      // Optional: handle the created event if needed
    } else if (event.type === 'charge.updated') {
      console.log('Charge updated:', event.data.object.id);
      // Optional: handle the updated event if needed
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
