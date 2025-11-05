import connectToDatabase from '@/lib/mongodb';
import Review from '../../../models/Reviews';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { productId, sortBy } = req.query;

    const filter = productId ? { productId } : {};
    let sort = {};

    if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'highest') {
      sort = { rating: -1 };
    } else if (sortBy === 'lowest') {
      sort = { rating: 1 };
    }

    try {
      const reviews = await Review.find(filter).sort(sort);
      console.log(reviews, 'reviews get');
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  } else if (req.method === 'POST') {
    // const authHeader = req.headers.authorization;
    // console.log(authHeader,"authHeader")

    // if (!authHeader) {
    //   return res.status(401).json({ message: 'Authorization header missing' });
    // }

    // const token = authHeader.split(' ')[1];

    try {
      //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = 12345;

      const { productId, rating, comment } = req.body;

      if (!productId || !rating) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newReview = await Review.create({
        userId,
        productId,
        rating,
        comment,
      });

      if (global.io) {
        global.io.emit('new-review', newReview);
      }

      res.status(201).json(newReview);
    } catch (error) {
      console.error('JWT verification failed:', error);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } else if (req.method === 'PUT') {
    const { rating, comment } = req.body;

    try {
      const updatedReview = await Review.findByIdAndUpdate(id, { rating, comment }, { new: true });
      res.status(200).json(updatedReview);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update review' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Review.findByIdAndDelete(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete review' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
