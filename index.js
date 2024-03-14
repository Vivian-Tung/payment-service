const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = 8888;
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;

app.use(cors());
app.use(express.json());

const stripe = require('stripe')(STRIPE_API_KEY);

// Create a customer
app.post('/api/customer', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const customer = await stripe.customers.create({
      name,
      email,
      phone,
    });

    res.send({ customer: customer.id });
  } catch (err) {
    console.error('Error creating customer: ', err);
    res.status(500).json({ err: 'Failed to create customer' });
  }
});

// Create payment intent
// Returns an object containing information about a payment
// requires currency, amount, and customer in the request body
app.post('/api/payment', async (req, res) => {
  const { currency, amount, customer } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency,
      amount,
      customer,
    });

    res.send({
      customer: paymentIntent.customer,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Error creating payment intent: ', err);
    res.status(500).json({ err: 'Failed to create payment intent' });
  }
});

app.post('/api/payment/confirm', async (req, res) => {
  const { paymentIntentId } = req.body;
  try {
    // throws error if card declines
    // use 'pm_card_visa_chargeDeclined' or other payment methods to test error
    const paymentIntentConfirmation = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: 'pm_card_visa',
      return_url: 'https://www.example.com',
    });

    console.log(paymentIntentConfirmation);
    if (paymentIntentConfirmation.status === 'succeeded') res.send({ paymentStatus: paymentIntentConfirmation.status });
  } catch (err) {
    console.error('Error creating payment: ', err);
    res.status(500).json({ err: 'Failed to create payment' });
  }
});

// Searching a payment intent
app.post('/api/payment/search', async (req, res) => {
  const { query } = req.body;
  try {
    const paymentIntents = await stripe.paymentIntents.search({
      query,
    });
    console.log(paymentIntents);
    res.send(paymentIntents.data);
  } catch (err) {
    console.error('Error finding payment: ', err);
    res.status(500).json({ err: 'Failed to find a payment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
