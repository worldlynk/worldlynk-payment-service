// src/controllers/paymentController.js
const stripeService = require('../services/stripeService');
const { publishPaymentSuccess } = require('../publishers/paymentPublisher');

exports.createPaymentIntent = async (req, res, next) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripeService.createPaymentIntent(amount);
    
    const paymentEvent = {
      status: 'success',
      id: paymentIntent.id,
      amount: paymentIntent.amount,
    };

    await publishPaymentSuccess(paymentEvent);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};
