// pages/api/order.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, order } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'your-email@gmail.com', pass: 'your-password' },
  });

  await transporter.sendMail({
    from: 'shop@example.com',
    to: email,
    subject: 'Order Confirmation',
    text: `Thank you for your order! Details: ${JSON.stringify(order)}`,
  });

  res.status(200).json({ message: 'Order confirmed' });
}
