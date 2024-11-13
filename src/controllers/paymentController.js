// src/controllers/paymentController.js
const stripeService = require('../services/stripeService');

exports.createPaymentIntent = async (req, res, next) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripeService.createPaymentIntent(amount);

    // Only return the clientSecret; do not publish the event here
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};
