import type { NextApiRequest, NextApiResponse } from 'next';
import productsData from '@mock/large/products.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const categories = productsData.map((product) => product.category);
    const uniqueCategories = Array.from(new Set(categories));
    res.status(200).json(uniqueCategories);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
