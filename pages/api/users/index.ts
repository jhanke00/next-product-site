import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/src/config/db';
import User from '@/src/models/User';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const users = await User.find({});
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
      break;
    case 'POST':
      try {
        const { id, firstName, lastName, phoneNumber, email } = req.body;
        const newUser = new User({ id, firstName, lastName, phoneNumber, email });
        await newUser.save();
        res.status(201).json(newUser);
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
