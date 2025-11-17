import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/src/config/db';
import Product from '@/src/models/Product';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const products = await Product.find({});
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
      break;
    case 'POST':
      try {
        const { id, name, description, price, category, rating, numReviews, countInStock } = req.body;
        const newProduct = new Product({ id, name, description, price, category, rating, numReviews, countInStock });
        await newProduct.save();
        res.status(201).json(newProduct);
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
