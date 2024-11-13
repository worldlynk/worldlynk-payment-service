// src/config/rabbitmq.js
const amqp = require('amqplib');
const RABBITMQ_URL = `${process.env.RABBITMQ_URL}?heartbeat=60` || 'amqp://guest:guest@rabbitmq:5672';

let connection = null;
let channel = null;
const exchange = process.env.RABBITMQ_EXCHANGE || 'payment_exchange';

async function connectRabbitMQ(retries = 5) {
  while (retries) {
    try {
      // Establish connection and create a channel
      connection = await amqp.connect(RABBITMQ_URL);
      console.log('Connected to RabbitMQ');
      
      channel = await connection.createChannel();
      console.log('Channel created');
      
      // Assert the exchange
      await channel.assertExchange(exchange, 'fanout', { durable: true });
      console.log(`Exchange '${exchange}' is asserted`);
      
      // Handle connection close events
      connection.on('close', () => {
        console.error('RabbitMQ connection closed');
        channel = null;
        connection = null;
      });
      
      return { connection, channel };
    } catch (error) {
      console.error('RabbitMQ connection error:', error.message);
      retries -= 1;
      console.log(`Retrying in 5 seconds... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  // Exit process if all retries fail
  console.error('Unable to connect to RabbitMQ after several attempts');
  process.exit(1);
}

// Getter function to retrieve the channel
function getChannel() {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
