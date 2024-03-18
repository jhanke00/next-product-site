import { NextApiRequest, NextApiResponse } from 'next';
import productsData from '@mock/large/products.json';
import { ProductType } from '@type/products';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query; // Extract the dynamic id from the query

  // Attempt to find the product by id
  const product = productsData.find((p: ProductType) => p.id === id);

  if (!product) {
    // If the product wasn't found, return a 404 error
    return res.status(404).json({ error: 'Product not found' });
  }

  // If the product is found, return it
  res.status(200).json(product);
}
