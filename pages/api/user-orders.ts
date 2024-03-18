// User API Endpoint for Small Dataset #14
//Endpoint that returns all of my user's orders if there are any

import { NextApiRequest, NextApiResponse } from 'next';
import ordersData from '../../src/mock/small/orders.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Filter orders for the specified user ID
  const userOrders = ordersData.filter((order) => order.user === userId);

  res.status(200).json(userOrders);
}
