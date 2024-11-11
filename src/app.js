// src/app.js
const express = require('express');
const { connectRabbitMQ } = require('./config/rabbitmq');
const config = require('./config');
const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/api/payment', paymentRoutes);
app.use(errorHandler);

connectRabbitMQ().then(() => {
  app.listen(config.port, () => {
    console.log(`Payment Service running on port ${config.port}`);
  });
}).catch((error) => {
  console.error('Failed to connect to RabbitMQ:', error.message);
  process.exit(1); // Exit if unable to connect
});
