import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData =
  | {
      success: true;
      clientSecret: string;
      amount: number;
      currency: string;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { totalPrice, clientSecret, confirmPayment, paymentMethod } = req.body;

  if (confirmPayment) {
    if (!clientSecret) {
      return res.status(400).json({ success: false, error: 'Missing payment session.' });
    }

    if (!paymentMethod?.cardNumber || paymentMethod.cvc?.length < 3) {
      return res.status(400).json({ success: false, error: 'Invalid payment method details.' });
    }

    await delay(800);

    return res.status(200).json({
      success: true,
      clientSecret,
      amount: 0,
      currency: 'usd',
      message: 'Mock Stripe payment confirmed successfully.',
    });
  }

  const amount = Math.round(Number(totalPrice || 0) * 100);

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid payment amount' });
  }

  await delay(800);

  return res.status(200).json({
    success: true,
    clientSecret: `pi_mock_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
    amount,
    currency: 'usd',
    message: 'Mock Stripe payment intent created successfully.',
  });
}
