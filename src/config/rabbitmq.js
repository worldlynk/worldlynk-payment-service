// src/config/rabbitmq.js
const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';

let connection = null;
let channel = null;

// Function to establish RabbitMQ connection and create a reusable channel
async function connectRabbitMQ(retries = 5) {
  while (retries) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      console.log('Connected to RabbitMQ');
      
      // Create a channel after establishing the connection
      channel = await connection.createChannel();
      console.log('Channel created');
      
      // Ensure the exchange exists
      const exchange = process.env.RABBITMQ_EXCHANGE || 'payment_exchange';
      await channel.assertExchange(exchange, 'fanout', { durable: true });
      console.log(`Exchange '${exchange}' is asserted`);
      
      return { connection, channel };
    } catch (error) {
      console.error('RabbitMQ connection error:', error.message);
      retries -= 1;
      console.log(`Retrying in 5 seconds... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds before retrying
    }
  }
  throw new Error('Unable to connect to RabbitMQ after several attempts');
}

// Getter function to retrieve the channel
function getChannel() {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
