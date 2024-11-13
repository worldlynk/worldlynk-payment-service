const express = require('express');
const bodyParser = require('body-parser');
const { connectRabbitMQ } = require('./config/rabbitmq');
const config = require('./config');
const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { handleStripeWebhook } = require('./controllers/webhookController');

const app = express();

// Apply raw body parsing specifically to the webhook route
app.post('/api/payment/webhook', bodyParser.raw({ type: 'application/json' }), handleStripeWebhook);

// JSON body parser for all other routes
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
