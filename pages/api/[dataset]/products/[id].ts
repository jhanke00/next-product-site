import { NextApiRequest, NextApiResponse } from 'next';
import ProductService from '@/services/ProductService';
import { ApiError } from 'next/dist/server/api-utils';
import HttpStatusCode from '@/src/utils/HttpStatusCode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id, dataset } = req.query;

    const invalidQueryParams = !id || !dataset || typeof id !== 'string' || typeof dataset !== 'string';
    if (invalidQueryParams) throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Invalid query params');

    const service: ProductService = ProductService.getInstance(dataset);
    const product = await service.getById(id);

    return res.status(200).json(product);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    const statusCode = error instanceof ApiError ? error.statusCode : 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
}
