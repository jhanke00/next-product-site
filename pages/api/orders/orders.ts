import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/src/config/db';
import Order from '@/src/models/Order';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const orders = await Order.find({});
        res.status(200).json(orders);
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
      break;
    case 'POST':
      try {
        const { id, user, items } = req.body;
        const newOrder = new Order({ id, user, items });
        await newOrder.save();
        res.status(201).json(newOrder);
      } catch (error) {
        res.status(400).json({ message: 'Bad Request' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
export default handler;
