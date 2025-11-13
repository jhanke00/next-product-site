import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    // Read orders file
    // const ordersFilePath = path.join(process.cwd(), 'src', 'mock', 'small', 'orders.json');
    const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json');

    let orders: any[] = [];
    try {
      const ordersData = fs.readFileSync(ordersFilePath, 'utf-8');
      orders = JSON.parse(ordersData);
    } catch (error) {
      return res.status(404).json({ error: 'Orders file not found' });
    }

    // Find order by id
    const order = orders.find((o) => o.id === id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
