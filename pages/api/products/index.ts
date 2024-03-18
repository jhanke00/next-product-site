import { NextApiRequest, NextApiResponse } from 'next';
import productsData from '@mock/large/products.json';
import { ProductType } from '@type/products';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(productsData);
  } else if (req.method === 'POST') {
    const { query, category } = req.body;

    if ((!query && !category) || (query === '' && category === '')) {
      return res.status(400).json({ error: 'At least one parameter (query or category) must be provided.' });
    }

    const normalizedQuery = query?.toLowerCase() || null;
    const normalizedCategory = category?.toLowerCase() || null;

    const searchResults = productsData.filter((product: ProductType) => {
      const matchesQuery = normalizedQuery
        ? product.name.toLowerCase().includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery)
        : true;
      const matchesCategory = normalizedCategory ? product.category.toLowerCase() === normalizedCategory : true;
      return matchesQuery && matchesCategory;
    });

    res.status(200).json(searchResults);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
