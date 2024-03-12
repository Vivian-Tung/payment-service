const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 8080;
const STRIPE_API_KEY =
  process.env.STRIPE_API_KEY ||
  'sk_test_51OtNuFJuNWrssUaY6CjWE2nNHBvKikd5I24oTtlRNoaidUKsP0CWogWZMPZv89eUCBpAlD4S4XHlf2zdJkwYlrPo00axl2MCsw';

app.use(cors());
app.use(express.json());

const stripe = require('stripe')(STRIPE_API_KEY);

app.post('/api/payment', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'gbp',
    });

    // throws error if card declines
    // use 'pm_card_visa_chargeDeclined' or other payment methods to test error
    const paymentIntentConfirmation = await stripe.paymentIntents.confirm(paymentIntent.id, {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
