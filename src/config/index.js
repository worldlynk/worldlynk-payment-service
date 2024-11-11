// src/config/index.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  rabbitmqExchange: process.env.RABBITMQ_EXCHANGE || 'payment_exchange',
};
