import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Order {
  id: string;
  cart: any;
  shipping: any;
  paymentId: string;
  userId?: string;
  status: string;
  createdAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cart, shipping, paymentId, userId } = req.body;

    // Validate required fields
    if (!cart || !shipping || !paymentId) {
      return res.status(400).json({ error: 'Missing required fields: cart, shipping, paymentId' });
    }

    // Create order object
    const order: Order = {
      id: `order_${Date.now()}`,
      cart,
      shipping,
      paymentId,
      status: 'created',
      createdAt: new Date().toISOString(),
    };

    if (userId) {
      order.userId = userId;
    }

    // Read existing orders
    // const ordersFilePath = path.join(process.cwd(), 'src', 'mock', 'small', 'orders.json');
    const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json');

    let orders: any[] = [];

    try {
      const ordersData = fs.readFileSync(ordersFilePath, 'utf-8');
      orders = JSON.parse(ordersData);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
      orders = [];
    }

    // Append new order
    orders.push(order);

    // Write back to file
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');

    // Create src/data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Append email log entry
    const emailLogPath = path.join(dataDir, 'emails.log');
    const emailEntry = {
      to: shipping.email || 'customer@example.com',
      subject: `Order Confirmation - ${order.id}`,
      body: `Thank you for your order! Your order ID is ${order.id}. Payment ID: ${paymentId}.`,
      timestamp: new Date().toISOString(),
    };

    const logLine = JSON.stringify(emailEntry) + '\n';
    fs.appendFileSync(emailLogPath, logLine, 'utf-8');

    return res.status(200).json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
