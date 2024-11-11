// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const validateRequest = require('../middlewares/validateRequest');

router.post('/create-payment-intent', validateRequest, paymentController.createPaymentIntent);

module.exports = router;
