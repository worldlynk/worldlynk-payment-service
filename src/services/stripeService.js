// src/services/stripeService.js
const Stripe = require('stripe');
const { stripeSecretKey } = require('../config');

const stripe = new Stripe(stripeSecretKey);

async function createPaymentIntent(amount) {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'gbp',
    payment_method_types: ['card'],
  });
}

module.exports = { createPaymentIntent };
