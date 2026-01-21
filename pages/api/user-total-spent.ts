// User API Endpoint for Small Dataset #14
// Endpoint that returns the user information
import { NextApiRequest, NextApiResponse } from 'next';
import ordersData from '../../src/mock/small/orders.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // const { userId } = req.query;
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Filter orders for the specified user ID
  const userOrders = ordersData.filter((order) => order.user === userId);

  if (userOrders.length === 0) {
    return res.status(404).json({ message: 'No orders found for the user' });
  }

  // Calculate total spent by the user
  const totalSpent = userOrders.reduce((total, order) => total + order.total, 0);

  res.status(200).json({ totalSpent });
}
