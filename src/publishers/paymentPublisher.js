// src/publishers/paymentPublisher.js
const { getChannel } = require('../config/rabbitmq');
const { rabbitmqExchange } = require('../config');

async function publishPaymentSuccess(event) {
  const channel = getChannel();
  
  const message = JSON.stringify(event);
  channel.publish(rabbitmqExchange, '', Buffer.from(message));
  console.log('Published payment success event:', event);
}

module.exports = { publishPaymentSuccess };
